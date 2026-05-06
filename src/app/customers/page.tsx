import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { CustomerTier } from "@/lib/types";
import { mockCustomers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function TierBadge({ tier }: { tier: CustomerTier }) {
  const label = tier.charAt(0).toUpperCase() + tier.slice(1);
  const styles: Record<CustomerTier, string> = {
    bronze:
      "border-canvas-border bg-canvas-bg-subtle text-canvas-text-contrast",
    silver:
      "border-secondary-border bg-secondary-bg-subtle text-secondary-text",
    gold: "border-warning-border bg-warning-bg-subtle text-warning-text",
    platinum:
      "border-primary-border bg-primary-bg-subtle text-primary-text",
  };
  return (
    <Badge variant="outline" className={cn("capitalize", styles[tier])}>
      {label}
    </Badge>
  );
}

export default function CustomersPage() {
  return (
    <DashboardShell title="Customers">
      <Card className="border-canvas-border">
        <CardHeader>
          <CardTitle className="text-canvas-text-contrast">Directory</CardTitle>
          <CardDescription className="text-canvas-text">
            {mockCustomers.length} customers with lifetime value and region.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="rounded-lg border border-canvas-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-canvas-text-contrast">
                    Name
                  </TableHead>
                  <TableHead className="text-canvas-text-contrast">
                    Email
                  </TableHead>
                  <TableHead className="text-canvas-text-contrast">
                    Tier
                  </TableHead>
                  <TableHead className="text-canvas-text-contrast">
                    Region
                  </TableHead>
                  <TableHead className="text-right text-canvas-text-contrast">
                    Orders
                  </TableHead>
                  <TableHead className="text-right text-canvas-text-contrast">
                    Spent
                  </TableHead>
                  <TableHead className="text-canvas-text-contrast">
                    Joined
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCustomers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-canvas-text-contrast">
                      {c.name}
                    </TableCell>
                    <TableCell className="max-w-[14rem] truncate text-canvas-text">
                      {c.email}
                    </TableCell>
                    <TableCell>
                      <TierBadge tier={c.tier} />
                    </TableCell>
                    <TableCell className="text-canvas-text">{c.region}</TableCell>
                    <TableCell className="text-right tabular-nums text-canvas-text">
                      {c.totalOrders}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-canvas-text-contrast">
                      ${c.totalSpent.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-canvas-text">
                      {format(c.joinedAt, "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
