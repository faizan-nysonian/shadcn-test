import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PiFileText } from "@/lib/icons";

const REPORTS = [
  {
    id: "sla",
    title: "SLA & response times",
    description: "Breaches, first response, and resolution trends by priority.",
  },
  {
    id: "revenue",
    title: "Revenue & orders",
    description: "Daily revenue, average order value, and fulfillment latency.",
  },
  {
    id: "satisfaction",
    title: "Customer satisfaction",
    description: "CSAT, NPS-style scores, and repeat purchase behavior.",
  },
] as const;

export default function ReportsPage() {
  return (
    <DashboardShell title="Reports">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report) => (
          <Card key={report.id} className="border-canvas-border">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-bg text-primary-text">
                  <PiFileText className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base text-canvas-text-contrast">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-canvas-text">
                    {report.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="border-t border-canvas-border pt-0">
              <Button type="button" variant="outline" size="sm" disabled>
                Generate (demo)
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
