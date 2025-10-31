"use client";

// import type React from "react";
import React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutToggle,
  type LayoutType,
} from "../../common/subComps/layout-toggle";

interface MenuBarItem {
  slug: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface FeatureBarProps {
  items: MenuBarItem[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  layout?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

const FeatureBar: React.FC<FeatureBarProps> = ({
  items,
  activeFilter,
  setActiveFilter,
  layout = "square",
  onLayoutChange,
  sortBy = "Newest",
  onSortChange,
}) => {
  const sortOptions = ["Newest", "Popular", "Trending"];

  return (
    <>
      {/* Desktop FeatureBar - Hidden on mobile/tablet, only show on desktop */}
      <div className="hidden pt-4 lg:flex items-center justify-between w-full">
        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.slug}
                onClick={() => setActiveFilter(item.slug)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeFilter === item.slug
                    ? "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-sm"
                    : "bg-transparent text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white border border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown and Layout toggle container */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          {onSortChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <button
                onClick={() => {
                  const currentIndex = sortOptions.indexOf(sortBy);
                  const nextIndex = (currentIndex + 1) % sortOptions.length;
                  onSortChange(sortOptions[nextIndex]);
                }}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium bg-muted/50 hover:bg-muted rounded-lg transition-colors"
              >
                <span>{sortBy}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Layout toggle - hidden on mobile/tablet */}
          {onLayoutChange && (
            <div className="hidden lg:block">
              <LayoutToggle
                layout={layout}
                onLayoutChange={onLayoutChange}
                className="shrink-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menubar - Hidden, replaced by MobileNavBar */}
      <div className="md:hidden w-full hidden">
        <div className="bg-background/80 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-lg shadow-lg px-4 py-1 flex items-center gap-1">
          {items.map((item) => {
            return (
              <button
                key={item.slug}
                onClick={() => setActiveFilter(item.slug)}
                className={cn(
                  "text-xs font-medium px-3 py-2 rounded-full transition-all duration-200 flex-1 min-w-0 truncate",
                  activeFilter === item.slug
                    ? "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-sm"
                    : "bg-transparent text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white border border-black/20 dark:border-white/20"
                )}
                title={item.label}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FeatureBar;
