"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import type { CertificationItem } from "@resume/types";

interface CertificationsEditorProps {
  data: CertificationItem[];
  onUpdate: (newData: CertificationItem[]) => void;
}

export function CertificationsEditor({
  data,
  onUpdate,
}: CertificationsEditorProps) {
  const items = data || [];

  const updateItem = (index: number, updates: Partial<CertificationItem>) => {
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
      { name: "New Certification", issuer: "Issuer", year: "20XX" },
    ]);
  };

  return (
    <div className="space-y-4">
      {items.map((item, iIdx) => (
        <div key={iIdx} className="flex items-center gap-4 group/item relative">
          <input
            className="editor-input editor-input-heading flex-1"
            value={item.name}
            onChange={(e) => updateItem(iIdx, { name: e.target.value })}
            placeholder="Certification Name"
          />
          <input
            className="editor-input editor-input-subtext text-right w-24"
            value={item.issuer || ""}
            onChange={(e) => updateItem(iIdx, { issuer: e.target.value })}
            placeholder="Issuer"
          />
          <button
            onClick={() => removeItem(iIdx)}
            className="p-1.5 text-zinc-300 hover:text-red-400 hover:bg-red-50 rounded-md transition-all cursor-pointer opacity-0 group-hover/item:opacity-100"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer"
      >
        + New Certification
      </button>
    </div>
  );
}
