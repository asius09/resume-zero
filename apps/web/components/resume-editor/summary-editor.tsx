"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface SummaryEditorProps {
  data: string;
  onUpdate: (newData: string) => void;
}

export function SummaryEditor({ data, onUpdate }: SummaryEditorProps) {
  return (
    <div className="space-y-3">
      <Textarea
        className="min-h-[120px] leading-relaxed"
        value={data}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Briefly touch on your role and biggest value proposition..."
      />
    </div>
  );
}
