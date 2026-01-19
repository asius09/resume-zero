"use client";

import React from "react";
import { Trash2, Plus } from "lucide-react";
import type { PersonalDetailItem } from "@resume/types";

interface PersonalEditorProps {
  data: PersonalDetailItem[];
  onUpdate: (newData: PersonalDetailItem[]) => void;
}

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {items.map((item, iIdx) => (
          <div key={iIdx} className="space-y-1.5 group/pitem relative">
            <div className="flex items-center justify-between">
              <input
                className="editor-label bg-transparent w-full mb-0"
                value={item.label || ""}
                onChange={(e) => updateItem(iIdx, { label: e.target.value })}
                placeholder="FIELD LABEL"
              />
              <button
                onClick={() => removeItem(iIdx)}
                className="p-1.5 text-zinc-300 hover:text-red-400 hover:bg-red-50 rounded-md transition-all cursor-pointer opacity-0 group-hover/pitem:opacity-100 -mr-2"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <input
              className="w-full text-sm font-medium border-none p-0 focus:ring-0 bg-transparent text-zinc-900"
              value={item.value || ""}
              onChange={(e) => updateItem(iIdx, { value: e.target.value })}
              placeholder="Value..."
            />
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Plus size={12} /> Add Personal Detail
      </button>
    </div>
  );
}
