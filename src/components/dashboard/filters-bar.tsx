"use client";

import * as React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PiFunnel, PiMagnifyingGlass } from "@/lib/icons";

export type FiltersBarValue = {
  status: string;
  priority: string;
  region: string;
  dateRange: { from?: Date; to?: Date };
  search: string;
};

export const DEFAULT_FILTERS_BAR_VALUE: FiltersBarValue = {
  status: "all",
  priority: "all",
  region: "all",
  dateRange: {},
  search: "",
};

type FiltersBarProps = {
  onFiltersChange: (filters: FiltersBarValue) => void;
};

export function FiltersBar({ onFiltersChange }: FiltersBarProps) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [priority, setPriority] = React.useState("all");
  const [region, setRegion] = React.useState("all");
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>();
  const [dateTo, setDateTo] = React.useState<Date | undefined>();

  const emit = React.useCallback(() => {
    onFiltersChange({
      status,
      priority,
      region,
      dateRange: { from: dateFrom, to: dateTo },
      search: search.trim(),
    });
  }, [status, priority, region, dateFrom, dateTo, search, onFiltersChange]);

  React.useEffect(() => {
    emit();
  }, [emit]);

  function handleClear() {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setRegion("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  }

  const rangeLabel = React.useMemo(() => {
    if (dateFrom && dateTo) {
      return `${format(dateFrom, "MMM d, yyyy")} – ${format(dateTo, "MMM d, yyyy")}`;
    }
    if (dateFrom) {
      return `${format(dateFrom, "MMM d, yyyy")} – …`;
    }
    return "Date range";
  }, [dateFrom, dateTo]);

  return (
    <div className="flex w-full flex-wrap items-end gap-3">
      <div className="flex shrink-0 items-center gap-2">
        <PiFunnel className="size-5 text-canvas-text" aria-hidden />
        <span className="text-sm font-medium text-canvas-text-contrast">
          Filters
        </span>
      </div>

      <Separator orientation="vertical" className="hidden h-8 sm:block" />

      <div className="relative min-w-[min(100%,16rem)] flex-1 basis-[16rem]">
        <PiMagnifyingGlass
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-canvas-text"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders or tickets…"
          className="pl-9"
          aria-label="Search orders or tickets"
        />
      </div>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger size="sm" className="min-w-[10rem]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger size="sm" className="min-w-[10rem]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger size="sm" className="min-w-[10rem]">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="North">North</SelectItem>
          <SelectItem value="South">South</SelectItem>
          <SelectItem value="East">East</SelectItem>
          <SelectItem value="West">West</SelectItem>
          <SelectItem value="Central">Central</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="min-w-[12rem]">
            {rangeLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-3" align="start">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col gap-2">
              <span className="text-center text-xs font-medium text-canvas-text">
                From
              </span>
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={(d) => {
                  setDateFrom(d);
                  if (d && dateTo && d > dateTo) setDateTo(undefined);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-center text-xs font-medium text-canvas-text">
                To
              </span>
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={(d) => {
                  if (d && dateFrom && d < dateFrom) {
                    setDateTo(dateFrom);
                    setDateFrom(d);
                    return;
                  }
                  setDateTo(d);
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
        Clear filters
      </Button>
    </div>
  );
}
