"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PiChartLine,
  PiFileText,
  PiGear,
  PiHeadset,
  PiShieldCheck,
  PiShoppingCart,
  PiSquaresFour,
  PiTicket,
  PiUsers,
} from "@/lib/icons";
import { mockAgents, mockCustomers, mockOrders, mockTickets } from "@/lib/mock-data";

const pendingOrderCount = mockOrders.filter((o) => o.status === "pending")
  .length;
const openTicketCount = mockTickets.filter(
  (t) => t.status === "open" || t.status === "in-progress",
).length;

const agent = mockAgents[0]!;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-solid text-primary-on-primary">
            <PiShieldCheck className="size-5" aria-hidden />
          </div>
          <span className="truncate font-semibold text-canvas-text-contrast group-data-[collapsible=icon]:hidden">
            SupportDesk
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip="Dashboard"
              >
                <Link href="/">
                  <PiSquaresFour aria-hidden />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/orders"}
                tooltip="Orders"
              >
                <Link href="/orders" className="justify-between">
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <PiShoppingCart aria-hidden />
                    <span className="truncate">Orders</span>
                  </span>
                  <Badge variant="outline">{pendingOrderCount}</Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/tickets"}
                tooltip="Tickets"
              >
                <Link href="/tickets" className="justify-between">
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <PiTicket aria-hidden />
                    <span className="truncate">Tickets</span>
                  </span>
                  <Badge variant="outline">{openTicketCount}</Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/customers"}
                tooltip="Customers"
              >
                <Link href="/customers" className="justify-between">
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <PiUsers aria-hidden />
                    <span className="truncate">Customers</span>
                  </span>
                  <Badge variant="outline">{mockCustomers.length}</Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/agents"}
                tooltip="Agents"
              >
                <Link href="/agents" className="justify-between">
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <PiHeadset aria-hidden />
                    <span className="truncate">Agents</span>
                  </span>
                  <Badge variant="outline">{mockAgents.length}</Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/reports"}
                tooltip="Reports"
              >
                <Link href="/reports">
                  <PiFileText aria-hidden />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/charts"}
                tooltip="Charts"
              >
                <Link href="/charts">
                  <PiChartLine aria-hidden />
                  <span>Charts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1">
          <Avatar size="sm">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>{initials(agent.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-canvas-text-contrast">
              {agent.name}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex shrink-0 rounded-md p-2 text-canvas-text outline-none hover:bg-canvas-bg-hover hover:text-canvas-text-contrast focus-visible:ring-0 focus-visible:ring-primary-border"
                aria-label="Settings"
              >
                <PiGear className="size-4" aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
