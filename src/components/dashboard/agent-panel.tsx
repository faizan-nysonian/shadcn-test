"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiCheckCircle, PiClock } from "@/lib/icons";
import { mockAgents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function satisfactionProgressClass(score: number) {
  if (score >= 80) {
    return "[&_[data-slot=progress-indicator]]:bg-success-solid";
  }
  if (score >= 60) {
    return "[&_[data-slot=progress-indicator]]:bg-warning-solid";
  }
  return "[&_[data-slot=progress-indicator]]:bg-alert-solid";
}

export function AgentPanel() {
  return (
    <Card className="sticky top-4 flex max-h-[calc(100svh-6rem)] flex-col overflow-hidden">
      <CardHeader className="shrink-0 pb-3">
        <CardTitle className="text-base text-canvas-text-contrast">
          Agents
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-0 pb-4">
        <ScrollArea className="max-h-[min(520px,calc(100svh-10rem))] px-6">
          <div className="flex flex-col gap-0 pr-3 pb-1">
            {mockAgents.map((agent, index) => (
              <div key={agent.id}>
                {index > 0 ? (
                  <Separator className="my-4 bg-canvas-border" />
                ) : null}
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <Avatar size="sm">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback className="text-[10px]">
                        {initials(agent.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-canvas-base",
                        agent.isOnline
                          ? "bg-success-solid"
                          : "bg-canvas-solid",
                      )}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-medium text-canvas-text-contrast">
                        {agent.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          agent.isOnline
                            ? "border-success-border bg-success-bg-subtle text-success-text"
                            : "border-canvas-border bg-canvas-bg text-canvas-text"
                        }
                      >
                        {agent.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="block w-full cursor-help">
                          <Progress
                            value={agent.satisfaction}
                            className={cn(
                              "h-2",
                              satisfactionProgressClass(agent.satisfaction),
                            )}
                            aria-label={`Satisfaction ${agent.satisfaction}%`}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="tabular-nums">
                          {agent.satisfaction}% satisfaction
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-canvas-text">
                      <span className="inline-flex items-center gap-1.5">
                        <PiCheckCircle
                          className="size-3.5 shrink-0 text-success-text"
                          aria-hidden
                        />
                        <span className="tabular-nums">
                          {agent.ticketsResolved} resolved
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <PiClock
                          className="size-3.5 shrink-0 text-info-text"
                          aria-hidden
                        />
                        <span className="tabular-nums">
                          {agent.avgResolutionHours}h avg
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
