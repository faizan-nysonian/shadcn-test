"use client";

import { format, parseISO } from "date-fns";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
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
import { mockTimeSeries } from "@/lib/mock-data";

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--color-brand)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--color-success)",
  },
} satisfies ChartConfig;

export function RevenueAreaChart() {
  const data = mockTimeSeries.map((row) => ({
    ...row,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-canvas-text-contrast">
          Orders & revenue trend
        </CardTitle>
        <CardDescription>
          Daily order volume and revenue over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillOrders" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-orders)"
                  stopOpacity={0.85}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-orders)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <linearGradient id="fillRevenue" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.85}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.08}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => format(parseISO(v as string), "MMM d")}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              tickFormatter={(v) => String(v)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={56}
              tickFormatter={(v) =>
                Number(v) >= 1000 ? `${Math.round(Number(v) / 1000)}k` : String(v)
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const raw = payload?.[0]?.payload?.date as string | undefined;
                    return raw
                      ? format(parseISO(raw), "MMM d, yyyy")
                      : "";
                  }}
                  formatter={(value, _name, item) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-canvas-text">{item?.name}</span>
                      <span className="font-mono font-medium tabular-nums text-canvas-text-contrast">
                        {item?.dataKey === "revenue"
                          ? `$${Number(value).toLocaleString()}`
                          : Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                  indicator="dot"
                />
              }
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="orders"
              stroke="var(--color-orders)"
              strokeWidth={2}
              fill="url(#fillOrders)"
              fillOpacity={1}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill="url(#fillRevenue)"
              fillOpacity={1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
