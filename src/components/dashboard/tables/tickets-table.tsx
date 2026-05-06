"use client";

import * as React from "react";
import {
  type Column,
  type ColumnDef,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { endOfDay, format, isAfter, isBefore, startOfDay } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { FiltersBarValue } from "@/components/dashboard/filters-bar";
import type {
  SupportTicket,
  TicketPriority,
  TicketStatus,
} from "@/lib/types";
import { mockTickets } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  PiArrowDown,
  PiArrowUp,
  PiCheckCircle,
  PiClipboard,
  PiDotsThreeVertical,
  PiEye,
} from "@/lib/icons";

const MS_HOUR = 60 * 60 * 1000;

export function applyTicketFilters(
  tickets: SupportTicket[],
  filters: FiltersBarValue,
): SupportTicket[] {
  const q = filters.search?.trim().toLowerCase() ?? "";

  return tickets.filter((t) => {
    if (filters.priority !== "all" && t.priority !== filters.priority) {
      return false;
    }
    const { from, to } = filters.dateRange;
    if (from) {
      const start = startOfDay(from);
      if (isBefore(t.createdAt, start)) return false;
    }
    if (to) {
      const end = endOfDay(to);
      if (isAfter(t.createdAt, end)) return false;
    }
    if (q) {
      const haystack = [
        t.id,
        t.customerName,
        t.subject,
        t.assignedAgent,
        t.status,
        t.priority,
        t.customerId,
        t.orderId ?? "",
        ...t.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  switch (priority) {
    case "low":
      return (
        <Badge
          variant="outline"
          className="border-success-border bg-success-bg-subtle text-success-text"
        >
          {label}
        </Badge>
      );
    case "medium":
      return (
        <Badge
          variant="outline"
          className="border-warning-border bg-warning-bg-subtle text-warning-text"
        >
          {label}
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="outline"
          className="border-alert-border bg-alert-bg-subtle text-alert-text"
        >
          {label}
        </Badge>
      );
    case "urgent":
      return (
        <Badge
          variant="outline"
          className="animate-pulse border-alert-border bg-alert-bg-subtle text-alert-text ring-2 ring-alert-border/50"
        >
          {label}
        </Badge>
      );
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}

const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  "in-progress": "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const title = TICKET_STATUS_LABEL[status];
  switch (status) {
    case "open":
      return (
        <Badge
          variant="outline"
          className="border-info-border bg-info-bg-subtle text-info-text"
        >
          {title}
        </Badge>
      );
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="border-primary-border bg-primary-bg text-primary-text"
        >
          {title}
        </Badge>
      );
    case "resolved":
      return (
        <Badge
          variant="outline"
          className="border-success-border bg-success-bg-subtle text-success-text"
        >
          {title}
        </Badge>
      );
    case "closed":
      return (
        <Badge
          variant="outline"
          className="border-canvas-border bg-canvas-bg text-canvas-text"
        >
          {title}
        </Badge>
      );
    default:
      return <Badge variant="outline">{title}</Badge>;
  }
}

function formatResolutionHours(ticket: SupportTicket): string {
  if (!ticket.resolvedAt) return "—";
  const ms = ticket.resolvedAt.getTime() - ticket.createdAt.getTime();
  const hours = ms / MS_HOUR;
  if (hours < 1 / 60) return "0h";
  const rounded = Math.round(hours * 10) / 10;
  if (Number.isInteger(rounded)) return `${rounded}h`;
  return `${rounded.toFixed(1)}h`;
}

type TicketsTableProps = {
  filters: FiltersBarValue;
  loading?: boolean;
};

export function TicketsTable({ filters, loading = false }: TicketsTableProps) {
  const data = React.useMemo(
    () => applyTicketFilters(mockTickets, filters),
    [filters],
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [detail, setDetail] = React.useState<SupportTicket | null>(null);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [filters]);

  React.useEffect(() => {
    if (!detail) setNote("");
  }, [detail]);

  const columns = React.useMemo<ColumnDef<SupportTicket>[]>(
    () => [
      {
        id: "select",
        meta: { label: "Select" },
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(v) =>
              table.toggleAllPageRowsSelected(!!v)
            }
            aria-label="Select all"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(v) => row.toggleSelected(!!v)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        meta: { label: "Ticket ID" },
        header: "Ticket ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.id}</span>
        ),
      },
      {
        accessorKey: "customerName",
        meta: { label: "Customer" },
        header: "Customer",
      },
      {
        accessorKey: "subject",
        meta: { label: "Subject" },
        header: "Subject",
        cell: ({ row }) => (
          <span
            className="max-w-[200px] truncate"
            title={row.original.subject}
          >
            {row.original.subject}
          </span>
        ),
      },
      {
        accessorKey: "priority",
        meta: { label: "Priority" },
        header: "Priority",
        cell: ({ row }) => (
          <PriorityBadge priority={row.original.priority} />
        ),
      },
      {
        accessorKey: "status",
        meta: { label: "Status" },
        header: "Status",
        cell: ({ row }) => (
          <TicketStatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: "assignedAgent",
        meta: { label: "Agent" },
        header: "Agent",
      },
      {
        accessorKey: "createdAt",
        meta: { label: "Created" },
        accessorFn: (row) => row.createdAt.getTime(),
        header: ({ column }) => (
          <TicketSortHeader
            column={column as Column<SupportTicket, unknown>}
          >
            Created
          </TicketSortHeader>
        ),
        cell: ({ row }) =>
          format(row.original.createdAt, "MMM d, yyyy HH:mm"),
      },
      {
        id: "resolution",
        meta: { label: "Resolution time" },
        accessorFn: (row) =>
          row.resolvedAt
            ? row.resolvedAt.getTime() - row.createdAt.getTime()
            : null,
        header: ({ column }) => (
          <TicketSortHeader
            column={column as Column<SupportTicket, unknown>}
          >
            Resolution time
          </TicketSortHeader>
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-canvas-text">
            {formatResolutionHours(row.original)}
          </span>
        ),
      },
      {
        id: "actions",
        meta: { label: "Actions" },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-canvas-text"
                  aria-label="Actions"
                >
                  <PiDotsThreeVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setDetail(row.original)}
                >
                  <PiEye className="size-4" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <PiCheckCircle className="size-4" />
                  Quick resolve
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: true,
    enableSorting: true,
    enableHiding: true,
  });

  const pageCount = table.getPageCount();
  const filteredTotal = data.length;
  const pageStart =
    filteredTotal === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    filteredTotal,
  );

  const skeletonRows = 8;
  const skeletonColCount = columns.length;

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-canvas-text-contrast">
                Toggle columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllLeafColumns()
                .filter((col) => col.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  >
                    {(column.columnDef.meta as { label?: string } | undefined)
                      ?.label ?? column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-lg border border-canvas-border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {Array.from({ length: skeletonColCount }).map((__, j) => (
                      <TableCell key={`skc-${j}`}>
                        <Skeleton className="mx-auto h-8 w-full max-w-[140px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => setDetail(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-40 text-center align-middle"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 py-6 text-canvas-text">
                      <PiClipboard className="size-10 opacity-60" />
                      <p className="text-sm font-medium text-canvas-text-contrast">
                        No tickets found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {!loading && (
              <TableFooter>
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-canvas-text">
                          Rows per page
                        </span>
                        <Select
                          value={String(pagination.pageSize)}
                          onValueChange={(v) =>
                            table.setPageSize(Number(v))
                          }
                        >
                          <SelectTrigger size="sm" className="w-[4.5rem]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-canvas-text">
                          {filteredTotal === 0
                            ? "0–0 of 0"
                            : `${pageStart}–${pageEnd} of ${filteredTotal}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                        >
                          Prev
                        </Button>
                        <span className="text-sm tabular-nums text-canvas-text">
                          Page{" "}
                          {filteredTotal === 0 ? 0 : pagination.pageIndex + 1}{" "}
                          of{" "}
                          {filteredTotal === 0 ? 0 : Math.max(pageCount, 1)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </div>

      <Dialog
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
          showCloseButton
        >
          {detail ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-canvas-text-contrast">
                  {detail.id}
                </DialogTitle>
                <DialogDescription className="text-canvas-text">
                  Full ticket record for {detail.customerName}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 text-sm">
                <dl className="grid grid-cols-[minmax(6rem,auto)_1fr] gap-x-3 gap-y-2">
                  <dt className="text-canvas-text">Customer</dt>
                  <dd className="text-canvas-text-contrast">
                    {detail.customerName}
                  </dd>
                  <dt className="text-canvas-text">Customer ID</dt>
                  <dd className="font-mono text-canvas-text-contrast">
                    {detail.customerId}
                  </dd>
                  {detail.orderId ? (
                    <>
                      <dt className="text-canvas-text">Order ID</dt>
                      <dd className="font-mono text-canvas-text-contrast">
                        {detail.orderId}
                      </dd>
                    </>
                  ) : null}
                  <dt className="text-canvas-text">Subject</dt>
                  <dd className="text-canvas-text-contrast">{detail.subject}</dd>
                  <dt className="text-canvas-text">Priority</dt>
                  <dd>
                    <PriorityBadge priority={detail.priority} />
                  </dd>
                  <dt className="text-canvas-text">Status</dt>
                  <dd>
                    <TicketStatusBadge status={detail.status} />
                  </dd>
                  <dt className="text-canvas-text">Agent</dt>
                  <dd className="text-canvas-text-contrast">
                    {detail.assignedAgent}
                  </dd>
                  <dt className="text-canvas-text">Created</dt>
                  <dd className="text-canvas-text-contrast">
                    {format(detail.createdAt, "PPpp")}
                  </dd>
                  <dt className="text-canvas-text">Resolved</dt>
                  <dd className="text-canvas-text-contrast">
                    {detail.resolvedAt
                      ? format(detail.resolvedAt, "PPpp")
                      : "—"}
                  </dd>
                  <dt className="text-canvas-text">Resolution time</dt>
                  <dd className="tabular-nums text-canvas-text-contrast">
                    {formatResolutionHours(detail)}
                  </dd>
                </dl>

                <div>
                  <p className="mb-2 text-xs font-medium text-canvas-text">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-secondary-border bg-secondary-bg-subtle text-secondary-text"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="ticket-note"
                    className="text-xs font-medium text-canvas-text"
                  >
                    Add a note
                  </label>
                  <Textarea
                    id="ticket-note"
                    placeholder="Internal note…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  className="bg-success-solid text-success-on-success hover:bg-success-solid-hover"
                  onClick={() => setDetail(null)}
                >
                  Resolve
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function TicketSortHeader({
  column,
  children,
}: {
  column: Column<SupportTicket, unknown>;
  children: React.ReactNode;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      className={cn(
        "-mx-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-left font-medium text-canvas-text-contrast hover:bg-canvas-bg-hover",
      )}
      onClick={column.getToggleSortingHandler() as () => void}
    >
      {children}
      {sorted === "asc" ? (
        <PiArrowUp className="size-4 shrink-0 text-primary-solid" />
      ) : sorted === "desc" ? (
        <PiArrowDown className="size-4 shrink-0 text-primary-solid" />
      ) : (
        <span className="inline-block size-4 shrink-0 opacity-40" aria-hidden />
      )}
    </button>
  );
}
