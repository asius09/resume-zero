"use client";

import React from "react";

interface SummaryEditorProps {
  data: string;
  onUpdate: (newData: string) => void;
}

export function SummaryEditor({ data, onUpdate }: SummaryEditorProps) {
  return (
    <div className="space-y-3">
      <textarea
        className="w-full min-h-[100px] text-sm leading-relaxed border-zinc-200 focus:border-zinc-300 rounded-lg p-4 bg-zinc-50/30 editor-input text-zinc-700 placeholder:text-zinc-300"
        value={data}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Briefly touch on your role and biggest value proposition..."
      />
    </div>
  );
}
