"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LayoutToggle, type LayoutType } from "./layout-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface MenuBarItem {
  slug: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
interface MenuBarProps {
  items: MenuBarItem[];
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
  layout?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  items,
  activeFilter,
  setActiveFilter,
  layout = "square",
  onLayoutChange,
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md border rounded-full px-3 py-2 shadow-lg">
        {/* Filter Items */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.slug}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveFilter?.(item.slug)}
                    className={cn(
                      "p-2 rounded-full transition-all duration-200 shrink-0",
                      activeFilter === item.slug
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Layout Toggle - hidden on mobile/tablet */}
        {onLayoutChange && (
          <div className="hidden lg:block w-px h-6 bg-border mx-1" />
        )}
        {onLayoutChange && (
          <div className="hidden lg:block">
            <LayoutToggle
              layout={layout}
              onLayoutChange={onLayoutChange}
              className="bg-transparent border-0 p-0 gap-1"
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
