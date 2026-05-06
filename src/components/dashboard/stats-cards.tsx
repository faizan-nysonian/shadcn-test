import type { IconType } from "react-icons";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatsCard } from "@/lib/types";
import {
  PiClock,
  PiCurrencyDollar,
  PiLifebuoy,
  PiShoppingCart,
  PiSquaresFour,
} from "@/lib/icons";

const ICON_MAP: Record<string, IconType> = {
  DollarSign: PiCurrencyDollar,
  LifeBuoy: PiLifebuoy,
  ShoppingCart: PiShoppingCart,
  Clock: PiClock,
};

function StatsCardIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? PiSquaresFour;
  return <Icon className="size-4 shrink-0 text-canvas-text" aria-hidden />;
}

function trendBorderClass(trend: StatsCard["trend"]) {
  switch (trend) {
    case "up":
      return "border-l-success-solid";
    case "down":
      return "border-l-alert-solid";
    default:
      return "border-l-canvas-border";
  }
}

type StatsCardsProps = {
  cards: StatsCard[];
};

export function StatsCards({ cards }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={cn("border-l-4", trendBorderClass(card.trend))}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-canvas-text">
              {card.title}
            </CardTitle>
            <StatsCardIcon name={card.icon} />
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-bold tracking-tight text-canvas-text-contrast">
              {card.value}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {card.change > 0 ? (
                <Badge
                  variant="outline"
                  className="border-success-border bg-success-bg-subtle text-success-text"
                >
                  +{card.change}%
                </Badge>
              ) : card.change < 0 ? (
                <Badge variant="destructive">{card.change}%</Badge>
              ) : (
                <Badge variant="outline">{card.change}%</Badge>
              )}
              <span className="text-sm text-canvas-text">{card.changeLabel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
