// 1. Import all the Breadcrumb components from the raw Shadcn UI file
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbItem as ShadcnBreadcrumbItem,
  BreadcrumbLink as ShadcnBreadcrumbLink,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
  BreadcrumbEllipsis as ShadcnBreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

// 2. Re-export all the components for use in your application.
const Breadcrumb = ShadcnBreadcrumb;
const BreadcrumbList = ShadcnBreadcrumbList;
const BreadcrumbItem = ShadcnBreadcrumbItem;
const BreadcrumbLink = ShadcnBreadcrumbLink;
const BreadcrumbPage = ShadcnBreadcrumbPage;
const BreadcrumbSeparator = ShadcnBreadcrumbSeparator;
const BreadcrumbEllipsis = ShadcnBreadcrumbEllipsis;

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
