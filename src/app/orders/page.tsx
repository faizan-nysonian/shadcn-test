"use client";

import { useState } from "react";

import {
  DEFAULT_FILTERS_BAR_VALUE,
  FiltersBar,
  type FiltersBarValue,
} from "@/components/dashboard/filters-bar";
import { OrdersTable } from "@/components/dashboard/tables/orders-table";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function OrdersPage() {
  const [filterState, setFilterState] = useState<FiltersBarValue>(
    DEFAULT_FILTERS_BAR_VALUE,
  );

  return (
    <DashboardShell title="Orders">
      <div className="flex flex-col gap-6">
        <FiltersBar onFiltersChange={setFilterState} />
        <OrdersTable filters={filterState} />
      </div>
    </DashboardShell>
  );
}
