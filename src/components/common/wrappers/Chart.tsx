// 1. Import all the Chart components from the raw Shadcn UI file
import {
  ChartContainer as ShadcnChartContainer,
  ChartTooltip as ShadcnChartTooltip,
  ChartTooltipContent as ShadcnChartTooltipContent,
  ChartLegend as ShadcnChartLegend,
  ChartLegendContent as ShadcnChartLegendContent,
} from "@/components/ui/chart";

// 2. Re-export all the components for use in your application.
const ChartContainer = ShadcnChartContainer;
const ChartTooltip = ShadcnChartTooltip;
const ChartTooltipContent = ShadcnChartTooltipContent;
const ChartLegend = ShadcnChartLegend;
const ChartLegendContent = ShadcnChartLegendContent;

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
