"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {Button} from "@/components/common/wrappers/Button";
import { Calendar } from "@/components/common/wrappers/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/wrappers/Popover";

const DatePicker = React.forwardRef<
  HTMLDivElement,
  {
    date?: Date;
    setDate: (date?: Date) => void;
  }
>(({ date, setDate }, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          intent={"secondary"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" ref={ref}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
});
DatePicker.displayName = "DatePicker";

export default DatePicker;
