// 1. Import all the Pagination components from the raw Shadcn UI file
import {
  Pagination as ShadcnPagination,
  PaginationContent as ShadcnPaginationContent,
  PaginationEllipsis as ShadcnPaginationEllipsis,
  PaginationItem as ShadcnPaginationItem,
  PaginationLink as ShadcnPaginationLink,
  PaginationNext as ShadcnPaginationNext,
  PaginationPrevious as ShadcnPaginationPrevious,
} from "@/components/ui/pagination";

// 2. Re-export all the components for use in your application.
// This creates a "pass-through" wrapper, which is great for future customization.
const Pagination = ShadcnPagination;
const PaginationContent = ShadcnPaginationContent;
const PaginationEllipsis = ShadcnPaginationEllipsis;
const PaginationItem = ShadcnPaginationItem;
const PaginationLink = ShadcnPaginationLink;
const PaginationNext = ShadcnPaginationNext;
const PaginationPrevious = ShadcnPaginationPrevious;

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
