"use client";

import * as React from "react";

import type { FiltersBarValue } from "@/components/dashboard/filters-bar";
import {
  OrdersTable,
  applyOrderFilters,
} from "@/components/dashboard/tables/orders-table";
import {
  TicketsTable,
  applyTicketFilters,
} from "@/components/dashboard/tables/tickets-table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiHeadset, PiShoppingCart } from "@/lib/icons";
import { mockOrders, mockTickets } from "@/lib/mock-data";

type TablesSectionProps = {
  filters: FiltersBarValue;
  loading?: boolean;
};

export default function TablesSection({ filters, loading }: TablesSectionProps) {
  const orderCount = React.useMemo(
    () => applyOrderFilters(mockOrders, filters).length,
    [filters],
  );
  const ticketCount = React.useMemo(
    () => applyTicketFilters(mockTickets, filters).length,
    [filters],
  );

  return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList>
        <TabsTrigger value="orders" className="gap-2">
          <PiShoppingCart className="size-4 shrink-0" aria-hidden />
          Orders
          <Badge variant="secondary">{orderCount}</Badge>
        </TabsTrigger>
        <TabsTrigger value="tickets" className="gap-2">
          <PiHeadset className="size-4 shrink-0" aria-hidden />
          Tickets
          <Badge variant="secondary">{ticketCount}</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="orders" className="mt-4 outline-none">
        <OrdersTable filters={filters} loading={loading} />
      </TabsContent>
      <TabsContent value="tickets" className="mt-4 outline-none">
        <TicketsTable filters={filters} loading={loading} />
      </TabsContent>
    </Tabs>
  );
}
