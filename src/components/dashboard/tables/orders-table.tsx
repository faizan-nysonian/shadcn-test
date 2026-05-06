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
import type { FiltersBarValue } from "@/components/dashboard/filters-bar";
import type { Order, OrderStatus } from "@/lib/types";
import { mockOrders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  PiArrowDown,
  PiArrowUp,
  PiClipboard,
  PiDotsThreeVertical,
  PiEye,
  PiTruck,
  PiXCircle,
} from "@/lib/icons";

export function applyOrderFilters(
  orders: Order[],
  filters: FiltersBarValue,
): Order[] {
  const q = filters.search?.trim().toLowerCase() ?? "";

  return orders.filter((order) => {
    if (filters.status !== "all" && order.status !== filters.status) {
      return false;
    }
    if (filters.region !== "all" && order.region !== filters.region) {
      return false;
    }
    const { from, to } = filters.dateRange;
    if (from) {
      const start = startOfDay(from);
      if (isBefore(order.createdAt, start)) return false;
    }
    if (to) {
      const end = endOfDay(to);
      if (isAfter(order.createdAt, end)) return false;
    }
    if (q) {
      const haystack = [
        order.id,
        order.customerName,
        order.product,
        order.category,
        order.region,
        order.status,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="border-warning-border bg-warning-bg-subtle text-warning-text"
        >
          {label}
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className="border-primary-border bg-primary-bg-subtle text-primary-text"
        >
          {label}
        </Badge>
      );
    case "shipped":
      return (
        <Badge
          variant="outline"
          className="border-info-border bg-info-bg-subtle text-info-text"
        >
          {label}
        </Badge>
      );
    case "delivered":
      return (
        <Badge
          variant="outline"
          className="border-success-border bg-success-bg-subtle text-success-text"
        >
          {label}
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="border-alert-border bg-alert-bg-subtle text-alert-text"
        >
          {label}
        </Badge>
      );
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}

type OrdersTableProps = {
  filters: FiltersBarValue;
  loading?: boolean;
};

export function OrdersTable({ filters, loading = false }: OrdersTableProps) {
  const data = React.useMemo(
    () => applyOrderFilters(mockOrders, filters),
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

  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [filters]);

  const columns = React.useMemo<ColumnDef<Order>[]>(
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
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        meta: { label: "Order ID" },
        header: "Order ID",
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
        accessorKey: "product",
        meta: { label: "Product" },
        header: "Product",
        cell: ({ row }) => (
          <span className="max-w-[180px] truncate" title={row.original.product}>
            {row.original.product}
          </span>
        ),
      },
      {
        accessorKey: "category",
        meta: { label: "Category" },
        header: "Category",
      },
      {
        accessorKey: "amount",
        meta: { label: "Amount" },
        header: ({ column }) => (
          <SortHeader column={column as Column<Order, unknown>}>
            Amount ($)
          </SortHeader>
        ),
        cell: ({ row }) =>
          `$${row.original.amount.toLocaleString("en-US")}`,
      },
      {
        accessorKey: "status",
        meta: { label: "Status" },
        header: "Status",
        cell: ({ row }) => (
          <OrderStatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: "region",
        meta: { label: "Region" },
        header: "Region",
      },
      {
        accessorKey: "createdAt",
        meta: { label: "Date" },
        accessorFn: (row) => row.createdAt.getTime(),
        header: ({ column }) => (
          <SortHeader column={column as Column<Order, unknown>}>
            Date
          </SortHeader>
        ),
        cell: ({ row }) =>
          format(row.original.createdAt, "MMM d, yyyy HH:mm"),
      },
      {
        id: "actions",
        meta: { label: "Actions" },
        enableSorting: false,
        enableHiding: false,
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-canvas-text"
                aria-label="Actions"
                onClick={(e) => e.stopPropagation()}
              >
                <PiDotsThreeVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PiEye className="size-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PiTruck className="size-4" />
                Mark as shipped
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <PiXCircle className="size-4" />
                Cancel order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                      No orders found
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
                        {filteredTotal === 0 ? 0 : pagination.pageIndex + 1} of{" "}
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
  );
}

function SortHeader({
  column,
  children,
}: {
  column: Column<Order, unknown>;
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
