"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CustomBlock } from "@resume/types";

interface CustomEditorProps {
  data: CustomBlock;
  onUpdate: (newData: CustomBlock) => void;
}

export function CustomEditor({ data, onUpdate }: CustomEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Section Title</Label>
        <Input
          value={data.title}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          placeholder="e.g. Publications"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Content</Label>
        <Textarea
          className="min-h-[150px]"
          value={data.content}
          onChange={(e) => onUpdate({ ...data, content: e.target.value })}
          placeholder="Enter your content..."
        />
      </div>
    </div>
  );
}
