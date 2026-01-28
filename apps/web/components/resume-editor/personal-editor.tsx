import { Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { PersonalDetailItem } from "@resume/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { EditorAddButton } from "./editor-add-button";
import { useToast } from "@/hooks/use-toast";

interface PersonalEditorProps {
  data: PersonalDetailItem[];
  onUpdate: (newData: PersonalDetailItem[]) => void;
}

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const MARITAL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Unmarried",
  "Divorced",
  "Widowed",
];
const NATIONALITY_OPTIONS = [
  "Indian",
  "American",
  "British",
  "Canadian",
  "Australian",
  "Other",
];

export function PersonalEditor({ data, onUpdate }: PersonalEditorProps) {
  const { toast } = useToast();
  const items = data || [];

  const updateItem = (index: number, updates: Partial<PersonalDetailItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number) => {
    const label = items[index].label || "Detail";
    onUpdate(items.filter((_, i) => i !== index));
    toast({
      title: "Detail Removed",
      description: `Removed ${label} from personal information.`,
      variant: "destructive",
    });
  };

  const addItem = () => {
    onUpdate([...items, { label: "New Field", value: "" }]);
  };

  const renderValueInput = (item: PersonalDetailItem, index: number) => {
    const label = (item.label || "").toLowerCase();

    if (label.includes("gender")) {
      return (
        <Select
          value={item.value || ""}
          onValueChange={(val) => updateItem(index, { value: val })}
        >
          <SelectTrigger className="h-10 border-zinc-200">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            {GENDER_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (label.includes("marital")) {
      return (
        <Select
          value={item.value || ""}
          onValueChange={(val) => updateItem(index, { value: val })}
        >
          <SelectTrigger className="h-10 border-zinc-200">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {MARITAL_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (label.includes("nationality")) {
      return (
        <Select
          value={item.value || ""}
          onValueChange={(val) => updateItem(index, { value: val })}
        >
          <SelectTrigger className="h-10 border-zinc-200">
            <SelectValue placeholder="Select Nationality" />
          </SelectTrigger>
          <SelectContent>
            {NATIONALITY_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (label.includes("date") || label.includes("birth")) {
      const date = item.value ? new Date(item.value) : undefined;

      return (
        <div className="space-y-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal border-zinc-200 h-10",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date && !isNaN(date.getTime()) ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date && !isNaN(date.getTime()) ? date : undefined}
                onSelect={(newDate) => {
                  if (newDate) {
                    updateItem(index, { value: format(newDate, "yyyy-MM-dd") });
                  }
                }}
                initialFocus
                captionLayout="dropdown"
                fromYear={1950}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
          <div className="px-1">
             <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-tight">Format: 19 December 2001</span>
          </div>
        </div>
      );
    }

    return (
      <Input
        value={item.value || ""}
        onChange={(e) => updateItem(index, { value: e.target.value })}
        placeholder="Enter value..."
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, iIdx) => (
          <Card
            key={iIdx}
            className="group/pitem border-zinc-100 shadow-none hover:border-zinc-200"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <input
                  className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 bg-transparent border-none p-0 focus:ring-0 w-full hover:text-zinc-600 transition-colors"
                  value={item.label || ""}
                  onChange={(e) => updateItem(iIdx, { label: e.target.value })}
                  placeholder="FIELD LABEL"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(iIdx)}
                  className="h-6 w-6 opacity-0 group-hover/pitem:opacity-100"
                >
                  <Trash2
                    size={12}
                    className="text-zinc-400 hover:text-red-500"
                  />
                </Button>
              </div>
              {renderValueInput(item, iIdx)}
            </CardContent>
          </Card>
        ))}
      </div>
      <EditorAddButton
        label="Add Personal Detail"
        onClick={addItem}
        toastTitle="Detail Added"
        toastDescription="A new personal information field has been created."
      />
    </div>
  );
}
