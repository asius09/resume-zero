"use client";

import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, GripVertical, Calendar, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EducationItem } from "@resume/types";
import { cn } from "@/lib/cn";
import { EditorAddButton } from "./editor-add-button";

const YEARS = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() + 5 - i).toString());

interface EducationEditorProps {
  data: EducationItem[];
  onUpdate: (newData: EducationItem[]) => void;
}

export function EducationEditor({ data, onUpdate }: EducationEditorProps) {
  const items = data || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateItem = (index: number, updates: Partial<EducationItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(items.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const addItem = () => {
    const newItem: EducationItem = {
      degree: "",
      institution: "",
      graduationYear: new Date().getFullYear().toString(),
      isPursuing: false,
    };
    onUpdate([...items, newItem]);
    setExpandedIndex(items.length);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, iIdx) => {
        const isExpanded = expandedIndex === iIdx;
        
        return (
          <Card
            key={iIdx}
            className={cn(
              "group/item border-zinc-200 shadow-sm transition-all duration-200 overflow-hidden",
              isExpanded ? "ring-1 ring-zinc-900 border-zinc-900" : "hover:border-zinc-300"
            )}
          >
            {/* Header View */}
            <div 
              className={cn(
                "p-4 flex items-center gap-3 sm:gap-4 cursor-pointer select-none",
                isExpanded ? "bg-zinc-50/50 border-b border-zinc-100" : "bg-white"
              )}
              onClick={() => toggleExpand(iIdx)}
            >
              <div className={cn('text-zinc-300', 'group-hover/item:text-zinc-500', 'transition-colors', 'hidden', 'sm:block')}>
                <GripVertical size={16} />
              </div>

              <div className={cn('flex-1', 'min-w-0')}>
                <div className={cn('flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'gap-1', 'sm:gap-2')}>
                  <span className={cn(
                    "font-semibold truncate text-sm sm:text-base",
                    !item.degree && "text-zinc-400 italic"
                  )}>
                    {item.degree || "Degree Name"}
                  </span>
                  {item.institution && (
                    <div className={cn('flex', 'items-center', 'gap-1', 'sm:gap-2')}>
                      <span className={cn('text-zinc-300', 'hidden', 'sm:inline')}>•</span>
                      <span className={cn('text-zinc-600', 'truncate', 'text-xs', 'sm:text-sm')}>{item.institution}</span>
                    </div>
                  )}
                </div>
                {!isExpanded && (
                  <div className={cn('flex', 'items-center', 'gap-4', 'mt-1', 'text-[10px]', 'sm:text-xs', 'text-zinc-500')}>
                    <div className={cn('flex', 'items-center', 'gap-1')}>
                      <Calendar size={12} className="shrink-0" />
                      {item.isPursuing ? `${item.graduationYear} (Expected)` : (item.graduationYear || "Year")}
                    </div>
                  </div>
                )}
              </div>

              <div className={cn('flex', 'items-center', 'gap-1')}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => removeItem(iIdx, e)}
                  className={cn('h-8', 'w-8', 'text-zinc-400', 'hover:text-red-500', 'hover:bg-red-50', 'sm:opacity-0', 'sm:group-hover/item:opacity-100', 'transition-opacity')}
                >
                  <Trash2 size={14} />
                </Button>
                <div className={cn('text-zinc-400', 'ml-1')}>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <CardContent className={cn('p-4', 'sm:p-6', 'space-y-6', 'sm:space-y-8', 'animate-in', 'fade-in', 'slide-in-from-top-2', 'duration-200')}>
                <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-x-8', 'gap-y-6')}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Institution</Label>
                      <Input
                        className={cn('h-11', 'border-zinc-200', 'rounded-lg', 'focus:border-zinc-900', 'focus:ring-0', 'transition-all', 'font-medium')}
                        value={item.institution}
                        onChange={(e) => updateItem(iIdx, { institution: e.target.value })}
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Degree / Course</Label>
                      <div className="relative">
                        <GraduationCap className={cn('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'text-zinc-400')} size={16} />
                        <Input
                          className={cn('pl-10', 'h-11', 'border-zinc-200', 'rounded-lg', 'focus:border-zinc-900', 'focus:ring-0', 'transition-all')}
                          value={item.degree}
                          onChange={(e) => updateItem(iIdx, { degree: e.target.value })}
                          placeholder="e.g. Master's in Computer Science"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Graduation / Expected Year</Label>
                      <Select 
                        value={item.graduationYear} 
                        onValueChange={(val) => updateItem(iIdx, { graduationYear: val })}
                      >
                        <SelectTrigger className="h-11 border-zinc-200">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                       <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>GPA / Grade (Optional)</Label>
                       <Input
                         className={cn('h-11', 'border-zinc-200', 'rounded-lg', 'focus:border-zinc-900', 'focus:ring-0', 'transition-all')}
                         value={item.gpa || ""}
                         onChange={(e) => updateItem(iIdx, { gpa: e.target.value })}
                         placeholder="e.g. 3.8/4.0 or 85%"
                       />
                    </div>

                    <div className="space-y-3 pt-2">
                      <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-400', 'tracking-widest')}>Education Status</Label>
                      <div className="flex p-1 bg-zinc-100/50 rounded-lg border border-zinc-100">
                        <button
                          type="button"
                          onClick={() => updateItem(iIdx, { isPursuing: false })}
                          className={cn(
                            "flex-1 py-1.5 px-3 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all",
                            !item.isPursuing 
                              ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50" 
                              : "text-zinc-400 hover:text-zinc-600"
                          )}
                        >
                          Graduated
                        </button>
                        <button
                          type="button"
                          onClick={() => updateItem(iIdx, { isPursuing: true })}
                          className={cn(
                            "flex-1 py-1.5 px-3 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all",
                            item.isPursuing 
                              ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50" 
                              : "text-zinc-400 hover:text-zinc-600"
                          )}
                        >
                          Pursuing
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      <EditorAddButton
        label="Add Education"
        onClick={addItem}
      />
    </div>
  );
}
