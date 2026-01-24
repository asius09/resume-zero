"use client";

import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, GripVertical, Calendar, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { CertificationItem } from "@resume/types";
import { cn } from "@/lib/cn";
import { EditorAddButton } from "./editor-add-button";

interface CertificationsEditorProps {
  data: CertificationItem[];
  onUpdate: (newData: CertificationItem[]) => void;
}

export function CertificationsEditor({
  data,
  onUpdate,
}: CertificationsEditorProps) {
  const items = data || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateItem = (index: number, updates: Partial<CertificationItem>) => {
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
    const newItem: CertificationItem = {
      name: "",
      issuer: "",
      year: "",
    };
    onUpdate([...items, newItem]);
    setExpandedIndex(items.length);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Certifications</h3>
        <span className="text-xs text-zinc-400 hidden sm:inline">{items.length} records</span>
      </div>

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

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className={cn(
                    "font-semibold truncate text-sm sm:text-base",
                    !item.name && "text-zinc-400 italic"
                  )}>
                    {item.name || "Certification Name"}
                  </span>
                  {item.issuer && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-zinc-300 hidden sm:inline">•</span>
                      <span className="text-zinc-600 truncate text-xs sm:text-sm">{item.issuer}</span>
                    </div>
                  )}
                </div>
                {!isExpanded && (
                  <div className="flex items-center gap-4 mt-1 text-[10px] sm:text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="shrink-0" />
                      {item.year || "Date"}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => removeItem(iIdx, e)}
                  className={cn('h-8', 'w-8', 'text-zinc-400', 'hover:text-red-500', 'hover:bg-red-50', 'sm:opacity-0', 'sm:group-hover/item:opacity-100', 'transition-opacity')}
                >
                  <Trash2 size={14} />
                </Button>
                <div className="text-zinc-400 ml-1">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <CardContent className={cn('p-4', 'sm:p-6', 'space-y-6', 'sm:space-y-8', 'animate-in', 'fade-in', 'slide-in-from-top-2', 'duration-200')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className={cn('text-[10px]', 'font-bold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Certification Name</Label>
                      <div className="relative">
                        <Award className={cn('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'text-zinc-400')} size={16} />
                        <Input
                          className={cn('pl-10', 'h-11', 'border-zinc-200', 'rounded-lg', 'focus:border-zinc-900', 'focus:ring-0', 'transition-all', 'font-medium')}
                          value={item.name}
                          onChange={(e) => updateItem(iIdx, { name: e.target.value })}
                          placeholder="e.g. AWS Solutions Architect"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={cn('text-[10px]', 'font-bold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Issuer</Label>
                      <Input
                        className={cn('h-11', 'border-zinc-200', 'rounded-lg', 'focus:border-zinc-900', 'focus:ring-0', 'transition-all')}
                        value={item.issuer || ""}
                        onChange={(e) => updateItem(iIdx, { issuer: e.target.value })}
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className={cn('text-[10px]', 'font-bold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Issue Date</Label>
                      <div className="relative">
                        <Calendar className={cn('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'text-zinc-400')} size={16} />
                        <Input
                          type="month"
                          className={cn('pl-10', 'h-11', 'border-zinc-200', 'rounded-lg', 'focus:border-zinc-900', 'focus:ring-0', 'transition-all')}
                          value={item.year || ""}
                          onChange={(e) => updateItem(iIdx, { year: e.target.value })}
                        />
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
        label="Add Certification"
        onClick={addItem}
      />
    </div>
  );
}
