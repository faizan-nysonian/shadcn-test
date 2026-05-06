"use client";

import { useState } from "react";

import { AgentPanel } from "@/components/dashboard/agent-panel";
import { AlertsBar } from "@/components/dashboard/alerts-bar";
import ChartsSection from "@/components/dashboard/charts-section";
import {
  DEFAULT_FILTERS_BAR_VALUE,
  FiltersBar,
  type FiltersBarValue,
} from "@/components/dashboard/filters-bar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import TablesSection from "@/components/dashboard/tables-section";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { mockStatsCards } from "@/lib/mock-data";

export default function Home() {
  const [filterState, setFilterState] = useState<FiltersBarValue>(
    DEFAULT_FILTERS_BAR_VALUE,
  );

  return (
    <DashboardShell title="Dashboard">
      <div className="flex flex-col gap-6">
        <AlertsBar />
        <StatsCards cards={mockStatsCards} />
        <FiltersBar onFiltersChange={setFilterState} />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="flex min-w-0 flex-col gap-6">
            <ChartsSection />
            <TablesSection filters={filterState} />
          </div>
          <AgentPanel />
        </div>
      </div>
    </DashboardShell>
  );
}
