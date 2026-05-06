"use client";

import * as React from "react";
import type { PieLabelRenderProps } from "recharts";
import { Cell, Pie, PieChart } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ticketsByPriority } from "@/lib/mock-data";

const chartConfig = {
  low: {
    label: "Low",
    color: "var(--color-success)",
  },
  medium: {
    label: "Medium",
    color: "var(--color-brand)",
  },
  high: {
    label: "High",
    color: "var(--color-warning)",
  },
  urgent: {
    label: "Urgent",
    color: "var(--color-danger)",
  },
} satisfies ChartConfig;

function sliceLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, outerRadius, payload } = props;
  if (
    cx == null ||
    cy == null ||
    midAngle == null ||
    outerRadius == null
  ) {
    return null;
  }
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const p = payload as { label?: string; value?: number } | undefined;
  const label = p?.label ?? "";
  const value = p?.value ?? 0;
  const title =
    label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="fill-canvas-text-contrast text-[11px] font-medium"
    >
      {`${title}: ${value}`}
    </text>
  );
}

export function TicketPriorityPie() {
  const data = ticketsByPriority;
  const total = React.useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-canvas-text-contrast">
          Tickets by priority
        </CardTitle>
        <CardDescription>Open and resolved tickets grouped by priority.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <div className="relative">
          <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                cx="42%"
                cy="50%"
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                strokeWidth={2}
                stroke="var(--color-canvas-base)"
                label={sliceLabel}
                labelLine
              >
                {data.map((entry) => (
                  <Cell key={entry.label} fill={`var(--color-${entry.label})`} />
                ))}
              </Pie>
              <text
                x="42%"
                y="50%"
                dy="-0.35rem"
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none fill-canvas-text-contrast text-3xl font-bold tabular-nums"
              >
                {total}
              </text>
              <text
                x="42%"
                y="50%"
                dy="0.95rem"
                textAnchor="middle"
                className="pointer-events-none fill-canvas-text text-xs"
              >
                Total tickets
              </text>
              <ChartLegend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                content={
                  <ChartLegendContent className="flex-col items-start gap-2 pt-0" />
                }
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
