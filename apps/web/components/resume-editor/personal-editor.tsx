import React from "react";
import { Trash2 } from "lucide-react";
import type { PersonalDetailItem } from "@resume/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditorAddButton } from "./editor-add-button";

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
  const items = data || [];

  const updateItem = (index: number, updates: Partial<PersonalDetailItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
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
          onChange={(e) => updateItem(index, { value: e.target.value })}
        >
          <option value="" disabled>
            Select Gender
          </option>
          {GENDER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      );
    }

    if (label.includes("marital")) {
      return (
        <Select
          value={item.value || ""}
          onChange={(e) => updateItem(index, { value: e.target.value })}
        >
          <option value="" disabled>
            Select Status
          </option>
          {MARITAL_STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      );
    }

    if (label.includes("nationality")) {
      return (
        <Select
          value={item.value || ""}
          onChange={(e) => updateItem(index, { value: e.target.value })}
        >
          <option value="" disabled>
            Select Nationality
          </option>
          {NATIONALITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      );
    }

    if (label.includes("date") || label.includes("birth")) {
      return (
        <Input
          value={item.value || ""}
          onChange={(e) => updateItem(index, { value: e.target.value })}
          placeholder="e.g. 19 December 2001"
        />
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
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-transparent border-none p-0 focus:ring-0 w-full hover:text-zinc-600 transition-colors"
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
      />
    </div>
  );
}
