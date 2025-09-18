// 1. Import the raw Shadcn Table components
import {
  Table as ShadcnTable,
  TableHeader as ShadcnTableHeader,
  TableBody as ShadcnTableBody,
  TableFooter as ShadcnTableFooter,
  TableRow as ShadcnTableRow,
  TableHead as ShadcnTableHead,
  TableCell as ShadcnTableCell,
  TableCaption as ShadcnTableCaption,
} from "@/components/ui/table";

// 2. Re-export the components for use in your application.
const Table = ShadcnTable;
const TableHeader = ShadcnTableHeader;
const TableBody = ShadcnTableBody;
const TableFooter = ShadcnTableFooter;
const TableRow = ShadcnTableRow;
const TableHead = ShadcnTableHead;
const TableCell = ShadcnTableCell;
const TableCaption = ShadcnTableCaption;

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
