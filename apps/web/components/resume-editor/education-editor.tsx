"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import type { EducationItem } from "@resume/types";

interface EducationEditorProps {
  data: EducationItem[];
  onUpdate: (newData: EducationItem[]) => void;
}

export function EducationEditor({ data, onUpdate }: EducationEditorProps) {
  const items = data || [];

  const updateItem = (index: number, updates: Partial<EducationItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onUpdate([
      ...items,
      {
        degree: "New Degree",
        institution: "Institution",
        graduationYear: "20XX",
      },
    ]);
  };

  return (
    <div className="space-y-8">
      {items.map((item, iIdx) => (
        <div key={iIdx} className="space-y-4 group/item relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_100px] gap-4">
                <input
                  className="editor-input editor-input-heading"
                  value={item.institution}
                  onChange={(e) =>
                    updateItem(iIdx, { institution: e.target.value })
                  }
                  placeholder="Institution Name"
                />
                <input
                  className="editor-input editor-input-subtext text-right w-20"
                  value={item.graduationYear}
                  onChange={(e) =>
                    updateItem(iIdx, { graduationYear: e.target.value })
                  }
                  placeholder="Year"
                />
              </div>
              <input
                className="editor-input editor-input-subtext"
                value={item.degree}
                onChange={(e) => updateItem(iIdx, { degree: e.target.value })}
                placeholder="Degree / Course"
              />
            </div>
            <button
              onClick={() => removeItem(iIdx)}
              className="p-1.5 text-zinc-300 hover:text-red-400 hover:bg-red-50 rounded-md transition-all cursor-pointer shrink-0 opacity-0 group-hover/item:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer"
      >
        + New Education Item
      </button>
    </div>
  );
}
