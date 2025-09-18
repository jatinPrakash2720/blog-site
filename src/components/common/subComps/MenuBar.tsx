


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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/common/wrappers/Pagination"; // Import pagination components
import type { PaginatedBlogResponse } from "@/types/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  paginationData: PaginatedBlogResponse | null;
  onPageChange: (page: number) => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  items,
  activeFilter,
  setActiveFilter,
  layout = "square",
  onLayoutChange,
  paginationData,
  onPageChange
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
                      "p-2 rounded-full transition-all duration-200 flex-shrink-0",
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

        {/* Pagination COntrols*/}
        {paginationData && paginationData.totalPages > 1 && (
          <>
            <div className="w-px h-6 bg-border mx-1" />
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (paginationData.hasPrevPage)
                        onPageChange(paginationData.page - 1);
                    }}
                    className={cn(
                      "!w-9 !h-9",
                      !paginationData.hasPrevPage &&
                        "opacity-50 pointer-events-none"
                    )}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <span className="text-sm font-medium text-foreground px-2 tabular-nums">
                    {paginationData.page} / {paginationData.totalPages}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (paginationData.hasNextPage)
                        onPageChange(paginationData.page + 1);
                    }}
                    className={cn(
                      "!w-9 !h-9",
                      !paginationData.hasNextPage &&
                        "opacity-50 pointer-events-none"
                    )}
                    aria-label="Go to next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}

        {/* Layout Toggle*/}
        {onLayoutChange && (
          <div className="hidden sm:block w-px h-6 bg-border mx-1" />
        )}
        {onLayoutChange && (
          <LayoutToggle
            layout={layout}
            onLayoutChange={onLayoutChange}
            className="bg-transparent border-0 p-0 gap-1"
          />
        )}
      </div>
    </TooltipProvider>
  );
};
