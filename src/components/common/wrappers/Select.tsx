// 1. Import all the Select components from the raw Shadcn UI file
import {
  Select as ShadcnSelect,
  SelectGroup as ShadcnSelectGroup,
  SelectValue as ShadcnSelectValue,
  SelectTrigger as ShadcnSelectTrigger,
  SelectContent as ShadcnSelectContent,
  SelectLabel as ShadcnSelectLabel,
  SelectItem as ShadcnSelectItem,
  SelectSeparator as ShadcnSelectSeparator,
} from "@/components/ui/select";

// 2. Re-export all the components for use in your application.
const Select = ShadcnSelect;
const SelectGroup = ShadcnSelectGroup;
const SelectValue = ShadcnSelectValue;
const SelectTrigger = ShadcnSelectTrigger;
const SelectContent = ShadcnSelectContent;
const SelectLabel = ShadcnSelectLabel;
const SelectItem = ShadcnSelectItem;
const SelectSeparator = ShadcnSelectSeparator;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
