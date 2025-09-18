// 1. Import all the Command components from the raw Shadcn UI file
import {
  Command as ShadcnCommand,
  CommandDialog as ShadcnCommandDialog,
  CommandInput as ShadcnCommandInput,
  CommandList as ShadcnCommandList,
  CommandEmpty as ShadcnCommandEmpty,
  CommandGroup as ShadcnCommandGroup,
  CommandItem as ShadcnCommandItem,
  CommandShortcut as ShadcnCommandShortcut,
  CommandSeparator as ShadcnCommandSeparator,
} from "@/components/ui/command";

// 2. Re-export all the components for use in your application.
const Command = ShadcnCommand;
const CommandDialog = ShadcnCommandDialog;
const CommandInput = ShadcnCommandInput;
const CommandList = ShadcnCommandList;
const CommandEmpty = ShadcnCommandEmpty;
const CommandGroup = ShadcnCommandGroup;
const CommandItem = ShadcnCommandItem;
const CommandShortcut = ShadcnCommandShortcut;
const CommandSeparator = ShadcnCommandSeparator;

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
