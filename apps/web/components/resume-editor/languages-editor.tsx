"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { clsx } from "clsx";
import type { LanguageItem } from "@resume/types";

interface LanguagesEditorProps {
  data: LanguageItem[];
  onUpdate: (newData: LanguageItem[]) => void;
}

export function LanguagesEditor({ data, onUpdate }: LanguagesEditorProps) {
  const items = data || [];

  const updateItem = (index: number, updates: Partial<LanguageItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onUpdate([...items, { language: "New Language", proficiency: "Basic" }]);
  };

  return (
    <div className="space-y-4">
      {items.map((item, iIdx) => (
        <div
          key={iIdx}
          className={clsx(
            "flex",
            "gap-4",
            "items-center",
            "group/item",
            "relative",
          )}
        >
          <input
            className={clsx(
              "flex-1",
              "font-bold",
              "text-sm",
              "border-none",
              "p-0",
              "focus:ring-0",
              "text-zinc-900",
            )}
            value={item.language}
            onChange={(e) => updateItem(iIdx, { language: e.target.value })}
            placeholder="Language (e.g. English)"
          />
          <select
            className={clsx(
              "w-32",
              "text-right",
              "text-xs",
              "font-bold",
              "text-zinc-500",
              "border-none",
              "p-0",
              "focus:ring-0",
              "bg-transparent",
            )}
            value={item.proficiency}
            onChange={(e) => updateItem(iIdx, { proficiency: e.target.value })}
          >
            <option value="Native">Native</option>
            <option value="Fluent">Fluent</option>
            <option value="Advanced">Advanced</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Basic">Basic</option>
          </select>
          <button
            onClick={() => removeItem(iIdx)}
            className={clsx(
              "absolute",
              "-right-8",
              "top-1/2",
              "-translate-y-1/2",
              "p-1.5",
              "text-zinc-300",
              "hover:text-red-400",
              "hover:bg-red-50",
              "rounded-md",
              "transition-all",
              "cursor-pointer",
              "opacity-0",
              "group-hover/item:opacity-100",
            )}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer"
      >
        + New Language
      </button>
    </div>
  );
}
