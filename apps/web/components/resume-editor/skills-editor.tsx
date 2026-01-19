"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import type { SkillGroup } from "@resume/types";

interface SkillsEditorProps {
  data: SkillGroup[];
  onUpdate: (newData: SkillGroup[]) => void;
}

export function SkillsEditor({ data, onUpdate }: SkillsEditorProps) {
  const items = data || [];

  const updateGroup = (index: number, updates: Partial<SkillGroup>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeGroup = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const addGroup = () => {
    onUpdate([...items, { category: "Category", skills: [] }]);
  };

  return (
    <div className="space-y-8">
      {items.map((group, iIdx) => (
        <div
          key={iIdx}
          className="p-4 bg-zinc-50/30 border border-zinc-100 rounded-xl space-y-3 group/skill relative transition-all hover:border-zinc-200"
        >
          <div className="flex items-center justify-between gap-4">
            <input
              className="editor-input editor-input-heading"
              value={group.category}
              onChange={(e) => updateGroup(iIdx, { category: e.target.value })}
              placeholder="Skill Category (e.g. Languages)"
            />
            <button
              onClick={() => removeGroup(iIdx)}
              className="p-1.5 text-zinc-300 hover:text-red-400 hover:bg-red-50 rounded-md transition-all cursor-pointer opacity-0 group-hover/skill:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <textarea
            className="editor-input text-xs text-zinc-500 font-normal leading-relaxed resize-none h-16"
            value={group.skills.join(", ")}
            onChange={(e) =>
              updateGroup(iIdx, {
                skills: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            placeholder="Skill 1, Skill 2, Skill 3..."
          />
        </div>
      ))}
      <button
        onClick={addGroup}
        className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer"
      >
        + New Skills Group
      </button>
    </div>
  );
}
