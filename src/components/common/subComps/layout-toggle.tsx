"use client";

import type React from "react";
import { Grid,Rows} from "lucide-react";
import { cn } from "@/lib/utils";

export type LayoutType = "square" | "landscape";

interface LayoutToggleProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  className?: string;
}

export const LayoutToggle: React.FC<LayoutToggleProps> = ({
  layout,
  onLayoutChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border bg-muted p-1",
        className
      )}
    >
      <button
        onClick={() => onLayoutChange("square")}
        className={cn(
          "p-1.5 rounded-full transition-all duration-200",
          layout === "square"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-background/70"
        )}
        aria-label="Square layout"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onLayoutChange("landscape")}
        className={cn(
          "p-1.5 rounded-full transition-colors duration-200",
          layout === "landscape"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-background/70"
        )}
        aria-label="Landscape layout"
      >
        <Rows className="w-4 h-4" />
      </button>
    </div>
  );
};

// "use client";

// import type React from "react";
// import { LayoutGrid, Rows3 } from "lucide-react";
// import { cn } from "@/lib/utils";

// export type LayoutType = "square" | "landscape";

// interface LayoutToggleProps {
//   layout: LayoutType;
//   onLayoutChange: (layout: LayoutType) => void;
//   className?: string;
// }

// export const LayoutToggle: React.FC<LayoutToggleProps> = ({
//   layout,
//   onLayoutChange,
//   className,
// }) => {
//   return (
//     <div
//       className={cn(
//         "hidden md:flex items-center gap-1 p-1 bg-sky-100/80 dark:bg-sky-900/30 backdrop-blur-sm rounded-lg border border-sky-200/50 dark:border-sky-800/50",
//         className
//       )}
//     >
//       <button
//         onClick={() => onLayoutChange("square")}
//         className={cn(
//           "p-2 rounded-md transition-all duration-200 flex items-center justify-center",
//           layout === "square"
//             ? "bg-sky-500 text-white shadow-sm"
//             : "text-sky-600 dark:text-sky-400 hover:bg-sky-200/50 dark:hover:bg-sky-800/50"
//         )}
//         aria-label="Square layout"
//       >
//         <LayoutGrid className="w-4 h-4" />
//       </button>
//       <button
//         onClick={() => onLayoutChange("landscape")}
//         className={cn(
//           "p-2 rounded-md transition-all duration-200 flex items-center justify-center",
//           layout === "landscape"
//             ? "bg-sky-500 text-white shadow-sm"
//             : "text-sky-600 dark:text-sky-400 hover:bg-sky-200/50 dark:hover:bg-sky-800/50"
//         )}
//         aria-label="Landscape layout"
//       >
//         <Rows3 className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };
