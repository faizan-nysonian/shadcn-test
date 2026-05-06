import { AgentPanel } from "@/components/dashboard/agent-panel";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AgentsPage() {
  return (
    <DashboardShell title="Agents">
      <div className="mx-auto w-full max-w-md lg:max-w-sm">
        <AgentPanel />
      </div>
    </DashboardShell>
  );
}
