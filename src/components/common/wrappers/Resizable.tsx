// 1. Import the raw Shadcn Resizable components
import {
  ResizablePanelGroup as ShadcnResizablePanelGroup,
  ResizablePanel as ShadcnResizablePanel,
  ResizableHandle as ShadcnResizableHandle,
} from "@/components/ui/resizable";

// 2. Re-export the components for use in your application.
const ResizablePanelGroup = ShadcnResizablePanelGroup;
const ResizablePanel = ShadcnResizablePanel;
const ResizableHandle = ShadcnResizableHandle;

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
