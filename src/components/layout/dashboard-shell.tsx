"use client";

import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiBell } from "@/lib/icons";
import { mockAgents } from "@/lib/mock-data";

const headerAgent = mockAgents[0]!;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type DashboardShellProps = {
  title: string;
  children: ReactNode;
};

export function DashboardShell({ title, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="relative flex min-h-svh min-w-0 flex-1 flex-col bg-canvas-base">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-canvas-border px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold tracking-tight text-canvas-text-contrast">
            {title}
          </h1>
          <Separator orientation="vertical" className="h-6" />
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex rounded-md p-2 text-canvas-text outline-none hover:bg-canvas-bg-hover hover:text-canvas-text-contrast focus-visible:ring-0 focus-visible:ring-primary-border"
                  aria-label="Notifications"
                >
                  <PiBell className="size-5" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            <Avatar size="sm">
              <AvatarImage src={headerAgent.avatar} alt={headerAgent.name} />
              <AvatarFallback>{initials(headerAgent.name)}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col p-4">{children}</div>
      </div>
    </SidebarProvider>
  );
}
