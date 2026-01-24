"use client";

import React from "react";
import { Trash2, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SkillGroup } from "@resume/types";
import { cn } from "@/lib/cn";
import { EditorAddButton } from "./editor-add-button";

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
    onUpdate([...items, { category: "", skills: [] }]);
  };

  return (
    <div className="space-y-4">
      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
        {items.map((group, iIdx) => (
          <Card
            key={iIdx}
            className={cn('group/skill', 'border-zinc-200', 'shadow-sm', 'hover:border-zinc-300', 'transition-all', 'duration-200', 'overflow-hidden')}
          >
            <CardContent className={cn('p-4', 'space-y-4')}>
              <div className={cn('flex', 'items-center', 'justify-between', 'gap-4')}>
                <div className={cn('flex', 'items-center', 'gap-2', 'flex-1')}>
                  <LayoutGrid size={14} className="text-zinc-400" />
                  <Input
                    className={cn('h-8', 'font-bold', 'text-xs', 'border-transparent', 'hover:border-zinc-200', 'focus:border-zinc-900', 'focus:ring-0', 'p-0', 'px-2', 'transition-all', 'bg-transparent')}
                    value={group.category}
                    onChange={(e) =>
                      updateGroup(iIdx, { category: e.target.value })
                    }
                    placeholder="Category (e.g. Frontend)"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeGroup(iIdx)}
                  className={cn('h-7', 'w-7', 'text-zinc-300', 'hover:text-red-500', 'hover:bg-red-50', 'sm:opacity-0', 'sm:group-hover/skill:opacity-100', 'transition-all')}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
              <div className={cn('space-y-2')}>
                <div className={cn('flex', 'items-center', 'gap-2', 'px-1')}>
                   <List size={12} className="text-zinc-400" />
                   <Label className={cn('text-[10px]', 'font-bold', 'uppercase', 'text-zinc-400')}>Skills (comma separated)</Label>
                </div>
                <Textarea
                  className={cn('min-h-[80px]', 'text-xs', 'py-2', 'border-zinc-100', 'focus:border-zinc-900', 'focus:ring-0', 'rounded-lg', 'bg-zinc-50/30', 'transition-all', 'resize-none')}
                  value={group.skills.join(", ")}
                  onChange={(e) =>
                    updateGroup(iIdx, {
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  placeholder="React, TypeScript, Next.js, Redux, Tailwind..."
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditorAddButton
        label="Add Skill Category"
        onClick={addGroup}
      />
    </div>
  );
}
