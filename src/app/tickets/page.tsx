"use client";

import { useState } from "react";

import {
  DEFAULT_FILTERS_BAR_VALUE,
  FiltersBar,
  type FiltersBarValue,
} from "@/components/dashboard/filters-bar";
import { TicketsTable } from "@/components/dashboard/tables/tickets-table";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function TicketsPage() {
  const [filterState, setFilterState] = useState<FiltersBarValue>(
    DEFAULT_FILTERS_BAR_VALUE,
  );

  return (
    <DashboardShell title="Tickets">
      <div className="flex flex-col gap-6">
        <FiltersBar onFiltersChange={setFilterState} />
        <TicketsTable filters={filterState} />
      </div>
    </DashboardShell>
  );
}
