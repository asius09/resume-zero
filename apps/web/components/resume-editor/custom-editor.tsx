"use client";

import React from "react";
import type { CustomBlock } from "@resume/types";

interface CustomEditorProps {
  data: CustomBlock;
  onUpdate: (newData: CustomBlock) => void;
}

export function CustomEditor({ data, onUpdate }: CustomEditorProps) {
  return (
    <div className="space-y-3">
      <input
        className="editor-label"
        value={data.title}
        onChange={(e) => onUpdate({ ...data, title: e.target.value })}
        placeholder="SECTION TITLE"
      />
      <textarea
        className="w-full min-h-[100px] text-sm leading-relaxed border-zinc-200 focus:border-zinc-300 rounded-lg p-4 bg-zinc-50/30 editor-input text-zinc-700 placeholder:text-zinc-300"
        value={data.content}
        onChange={(e) => onUpdate({ ...data, content: e.target.value })}
        placeholder="Enter your content..."
      />
    </div>
  );
}
