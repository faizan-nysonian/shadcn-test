"use client";

import {
  Bar,
  BarChart,
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
import { revenueByRegion } from "@/lib/mock-data";

const chartConfig = {
  value: {
    label: "Revenue",
    color: "var(--color-brand)",
  },
} satisfies ChartConfig;

export function RevenueByRegionBar() {
  const data = revenueByRegion;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-canvas-text-contrast">
          Revenue by region
        </CardTitle>
        <CardDescription>
          Sum of non-cancelled order amounts per region.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <BarChart
            accessibilityLayer
            layout="vertical"
            data={data}
            margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) =>
                `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              }
            />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={72}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-mono font-medium tabular-nums text-canvas-text-contrast">
                      $
                      {Number(value).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  )}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[0, 4, 4, 0]}
              barSize={28}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
