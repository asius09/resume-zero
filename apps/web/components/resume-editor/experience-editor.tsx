"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ExperienceItem } from "@resume/types";

interface ExperienceEditorProps {
  data: ExperienceItem[];
  onUpdate: (newData: ExperienceItem[]) => void;
}

export function ExperienceEditor({ data, onUpdate }: ExperienceEditorProps) {
  const items = data || [];

  const updateItem = (index: number, updates: Partial<ExperienceItem>) => {
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
        jobTitle: "New Role",
        companyName: "Company",
        location: "City",
        startDate: "202X",
        isCurrent: false,
        bullets: [""],
      },
    ]);
  };

  const addBullet = (itemIdx: number) => {
    const newData = [...items];
    newData[itemIdx].bullets = [...(newData[itemIdx].bullets || []), ""];
    onUpdate(newData);
  };

  const updateBullet = (itemIdx: number, bulletIdx: number, value: string) => {
    const newData = [...items];
    newData[itemIdx].bullets[bulletIdx] = value;
    onUpdate(newData);
  };

  const removeBullet = (itemIdx: number, bulletIdx: number) => {
    const newData = [...items];
    newData[itemIdx].bullets = newData[itemIdx].bullets.filter(
      (_, i) => i !== bulletIdx,
    );
    onUpdate(newData);
  };

  return (
    <div className="space-y-8">
      {items.map((item, iIdx) => (
        <div key={iIdx} className="space-y-6 relative group/item">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
                <input
                  className="editor-input editor-input-heading"
                  value={item.jobTitle}
                  onChange={(e) =>
                    updateItem(iIdx, { jobTitle: e.target.value })
                  }
                  placeholder="Title"
                />
                <div className="flex items-center justify-end gap-1">
                  <input
                    className="editor-input editor-input-subtext text-right w-20"
                    value={item.startDate}
                    onChange={(e) =>
                      updateItem(iIdx, { startDate: e.target.value })
                    }
                    placeholder="Start"
                  />
                  <span className="mx-2 text-zinc-300">—</span>
                  <input
                    className="editor-input editor-input-subtext w-20"
                    value={item.endDate || ""}
                    onChange={(e) =>
                      updateItem(iIdx, {
                        endDate: e.target.value,
                        isCurrent: e.target.value.toLowerCase() === "present",
                      })
                    }
                    placeholder="End"
                  />
                </div>
              </div>
              <input
                className="editor-input editor-input-subtext"
                value={item.companyName}
                onChange={(e) =>
                  updateItem(iIdx, { companyName: e.target.value })
                }
                placeholder="Company"
              />
            </div>
            <button
              onClick={() => removeItem(iIdx)}
              className="p-1.5 text-zinc-300 hover:text-red-400 hover:bg-red-50 rounded-md transition-all cursor-pointer opacity-0 group-hover/item:opacity-100 shrink-0"
            >
              <Trash2 size={13} />
            </button>
          </div>

          <div className="space-y-4">
            {(item.bullets || []).map((bullet, bulIdx) => (
              <div key={bulIdx} className="flex gap-3 items-start group/bullet">
                <div className="shrink-0 text-zinc-400 text-lg leading-none mt-0.5">
                  •
                </div>
                <textarea
                  className="editor-input editor-input-subtext min-h-6 h-auto"
                  value={bullet}
                  onChange={(e) => updateBullet(iIdx, bulIdx, e.target.value)}
                  placeholder="Accomplishment..."
                />
                <button
                  onClick={() => removeBullet(iIdx, bulIdx)}
                  className="p-1.5 text-zinc-300 hover:text-red-400 hover:bg-red-50 rounded-md transition-all cursor-pointer opacity-0 group-hover/bullet:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addBullet(iIdx)}
              className="ml-8 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={10} /> Add Bullet
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer"
      >
        + New Experience Item
      </button>
    </div>
  );
}
