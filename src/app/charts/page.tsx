import ChartsSection from "@/components/dashboard/charts-section";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function ChartsPage() {
  return (
    <DashboardShell title="Charts">
      <ChartsSection />
    </DashboardShell>
  );
}
