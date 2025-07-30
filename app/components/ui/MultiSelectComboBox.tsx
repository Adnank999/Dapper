"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectComboboxProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = "Select technologies...",
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const toggleSelection = (item: Option) => {
    if (selected.find((s) => s.value === item.value)) {
      onChange(selected.filter((s) => s.value !== item.value));
    } else {
      onChange([...selected, item]);
    }
  };

  const removeSelection = (value: string) => {
    const newSelected = selected.filter((s) => s.value !== value);

    onChange(newSelected);
  };

  return (
    <div className={cn("w-full ", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between")}
          >
            {selected.length > 0 ? `${selected.length} selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          data-lenis-prevent
          className="w-full bg-background p-0 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
        >
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => {
                const isSelected = selected.some((s) => s.value === item.value);
                return (
                  <CommandItem
                    key={item.value}
                    onSelect={() => toggleSelection(item)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected tags */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selected.map((item) => (
          <Badge
            key={item.value}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {item.label}
            <button
              type="button"
              onClick={() => removeSelection(item.value)}
              className="p-0 ml-1"
              aria-label={`Remove ${item.label}`}
            >
              <X className="h-3 w-3 cursor-pointer" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
