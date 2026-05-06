"use client";

import * as React from "react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  PiArrowUp,
  PiClock,
  PiWarning,
  PiX,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

type DashboardAlert = {
  id: string;
  kind: "warning" | "info" | "destructive";
  title: string;
  description: string;
};

const INITIAL_ALERTS: DashboardAlert[] = [
  {
    id: "urgent-unassigned",
    kind: "warning",
    title: "3 urgent tickets unassigned",
    description: "Assign agents from the queue to meet SLA.",
  },
  {
    id: "revenue-up",
    kind: "info",
    title: "Revenue up 12% this week",
    description: "Compared to the prior seven-day period.",
  },
  {
    id: "orders-stuck",
    kind: "destructive",
    title: "2 orders stuck in processing >48h",
    description: "Investigate fulfillment delays immediately.",
  },
];

function AlertIcon({ kind }: { kind: DashboardAlert["kind"] }) {
  if (kind === "warning") {
    return (
      <PiWarning
        className="text-warning-text"
        aria-hidden
      />
    );
  }
  if (kind === "info") {
    return (
      <PiArrowUp
        className="text-info-text"
        aria-hidden
      />
    );
  }
  return (
    <PiClock
      className="text-alert-text"
      aria-hidden
    />
  );
}

export function AlertsBar() {
  const [alerts, setAlerts] = React.useState<DashboardAlert[]>(INITIAL_ALERTS);

  function dismiss(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.kind === "destructive" ? "destructive" : "default"}
          className={cn(
            "min-w-[min(100%,280px)] shrink-0 sm:min-w-[320px]",
            alert.kind === "warning" &&
              "border-warning-border bg-warning-bg-subtle text-warning-text *:data-[slot=alert-description]:text-warning-text/90 [&_[data-slot=alert-title]]:text-warning-text-contrast",
            alert.kind === "info" &&
              "border-info-border bg-info-bg-subtle text-info-text *:data-[slot=alert-description]:text-info-text/90 [&_[data-slot=alert-title]]:text-info-text-contrast",
            alert.kind === "destructive" &&
              "border-alert-border bg-alert-bg-subtle",
          )}
        >
          <AlertIcon kind={alert.kind} />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-current hover:bg-canvas-bg/60"
              aria-label={`Dismiss ${alert.description}`}
              onClick={() => dismiss(alert.id)}
            >
              <PiX className="size-4" />
            </Button>
          </AlertAction>
        </Alert>
      ))}
    </div>
  );
}
