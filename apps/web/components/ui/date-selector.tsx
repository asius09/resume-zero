import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS, YEARS } from "@/lib/constants";
import type { ParsedDate } from "@/lib/date-utils";

interface DateSelectorProps {
  label?: string;
  value: ParsedDate;
  onChange: (field: "month" | "year", value: string) => void;
  disabled?: boolean;
}

export function DateSelector({ label, value, onChange, disabled }: DateSelectorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
          {label}
        </Label>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={value.month || undefined}
          onValueChange={(val) => onChange("month", val)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={value.year || undefined}
          onValueChange={(val) => onChange("year", val)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
