"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
import { ordersByStatus } from "@/lib/mock-data";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "var(--color-warning)",
  },
  processing: {
    label: "Processing",
    color: "var(--color-brand)",
  },
  shipped: {
    label: "Shipped",
    color: "var(--color-success)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--color-secondary-solid)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--color-danger)",
  },
} satisfies ChartConfig;

export function OrdersBarChart() {
  const data = ordersByStatus;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-canvas-text-contrast">
          Orders by status
        </CardTitle>
        <CardDescription>
          Total orders grouped by fulfillment status.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 8, right: 8, top: 24, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) =>
                String(v).charAt(0).toUpperCase() + String(v).slice(1)
              }
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                className="fill-canvas-text-contrast text-xs font-medium"
                offset={8}
              />
              {data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={`var(--color-${entry.label})`}
                />
              ))}
            </Bar>
            <ChartLegend
              verticalAlign="bottom"
              content={<ChartLegendContent />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
