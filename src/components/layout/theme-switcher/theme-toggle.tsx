"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconSun,
  IconMoon,
  IconDesktop,
  IconCircleHalf,
} from "@/lib/icons";

const themes = [
  { value: "light", label: "Light", Icon: IconSun },
  { value: "dark",  label: "Dark",  Icon: IconMoon },
  { value: "system", label: "System", Icon: IconDesktop },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Skeleton to prevent layout shift before hydration
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0" aria-hidden>
          <IconCircleHalf className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const CurrentIcon =
    theme === "system"
      ? IconDesktop
      : resolvedTheme === "dark"
      ? IconMoon
      : IconSun;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Toggle theme"
              >
                <CurrentIcon className="h-4 w-4 transition-transform duration-300 ease-in-out" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent side="top">
            <p>Toggle theme</p>
          </TooltipContent>

          <DropdownMenuContent align="end" side="top">
            {themes.map(({ value, label, Icon }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => setTheme(value)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {theme === value && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-canvas-text-contrast" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </div>
  );
}
