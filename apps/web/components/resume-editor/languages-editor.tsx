"use client";

import React from "react";
import { Trash2, Languages, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { LanguageItem } from "@resume/types";
import { EditorAddButton } from "./editor-add-button";

interface LanguagesEditorProps {
  data: LanguageItem[];
  onUpdate: (newData: LanguageItem[]) => void;
}

export function LanguagesEditor({ data, onUpdate }: LanguagesEditorProps) {
  const items = data || [];

  const updateItem = (index: number, updates: Partial<LanguageItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onUpdate([...items, { language: "", proficiency: "Basic" }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Languages</h3>
        <span className="text-xs text-zinc-400 hidden sm:inline">{items.length} languages</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, iIdx) => (
          <Card
            key={iIdx}
            className="group/item border-zinc-200 shadow-sm hover:border-zinc-300 transition-all duration-200 overflow-hidden"
          >
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Languages size={14} className="text-zinc-400" />
                  <Input
                    className="h-8 font-bold text-xs border-transparent hover:border-zinc-200 focus:border-zinc-900 focus:ring-0 p-0 px-2 transition-all bg-transparent"
                    value={item.language}
                    onChange={(e) => updateItem(iIdx, { language: e.target.value })}
                    placeholder="Language (e.g. English)"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(iIdx)}
                  className="h-7 w-7 text-zinc-300 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover/item:opacity-100 transition-all"
                >
                  <Trash2 size={12} />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                   <Star size={12} className="text-zinc-400" />
                   <Label className="text-[10px] font-bold uppercase text-zinc-400">Proficiency</Label>
                </div>
                <Select
                  className="h-9 text-xs"
                  value={item.proficiency}
                  onChange={(e) =>
                    updateItem(iIdx, { proficiency: e.target.value })
                  }
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditorAddButton
        label="Add Language"
        onClick={addItem}
      />
    </div>
  );
}
