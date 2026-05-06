import { OrdersBarChart } from "@/components/dashboard/charts/orders-bar-chart";
import { RevenueAreaChart } from "@/components/dashboard/charts/revenue-area-chart";
import { RevenueByRegionBar } from "@/components/dashboard/charts/revenue-by-region-bar";
import { TicketPriorityPie } from "@/components/dashboard/charts/ticket-priority-pie";

export default function ChartsSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueAreaChart />
        </div>
        <div className="lg:col-span-1">
          <TicketPriorityPie />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <OrdersBarChart />
        <RevenueByRegionBar />
      </div>
    </div>
  );
}
