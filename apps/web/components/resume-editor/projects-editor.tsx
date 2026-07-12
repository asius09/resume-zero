"use client";

import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, GripVertical, Calendar, FolderGit2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import type { ProjectItem } from "@resume/types";
import { cn } from "@/lib/cn";
import { EditorAddButton } from "./editor-add-button";
import { useToast } from "@/hooks/use-toast";

interface ProjectsEditorProps {
  data: ProjectItem[];
  onUpdate: (newData: ProjectItem[]) => void;
}

export function ProjectsEditor({ data, onUpdate }: ProjectsEditorProps) {
  const { toast } = useToast();
  const items = data || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateItem = (index: number, updates: Partial<ProjectItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const name = items[index].name || "Project";
    onUpdate(items.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);

    toast({
      title: "Project Removed",
      description: `Removed ${name} from your projects.`,
      variant: "destructive",
    });
  };

  const addItem = () => {
    const newItem: ProjectItem = {
      name: "",
      description: "",
      bullets: [""],
      dates: "",
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
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Projects</h3>
        <span className="text-xs text-zinc-400 hidden sm:inline">{items.length} projects</span>
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
              <div className="text-zinc-300 group-hover/item:text-zinc-500 transition-colors hidden sm:block">
                <GripVertical size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className={cn(
                    "font-semibold truncate text-sm sm:text-base",
                    !item.name && "text-zinc-400 italic"
                  )}>
                    {item.name || "Project Name"}
                  </span>
                </div>
                {!isExpanded && (
                  <div className="flex items-center gap-4 mt-1 text-[10px] sm:text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="shrink-0" />
                      {item.dates || "Date"}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => removeItem(iIdx, e)}
                  className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity"
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
              <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Project Name</Label>
                      <div className="relative">
                        <FolderGit2 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                          className="pl-10 h-11 border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 transition-all font-medium"
                          value={item.name}
                          onChange={(e) => updateItem(iIdx, { name: e.target.value })}
                          placeholder="e.g. Portfolio Website"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Project Link</Label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                          className="pl-10 h-11 border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 transition-all font-medium"
                          value={item.link || ""}
                          onChange={(e) => updateItem(iIdx, { link: e.target.value })}
                          placeholder="e.g. https://github.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Date / Period</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                          className="pl-10 h-11 border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 transition-all"
                          value={item.dates || ""}
                          onChange={(e) => updateItem(iIdx, { dates: e.target.value })}
                          placeholder="e.g. 2023 or Jan 2023 - Present"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Highlights Section */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Project Description & Highlights</Label>
                  </div>
                  
                  <div className="space-y-3">
                    <RichTextEditor
                      value={
                        item.content !== undefined
                          ? item.content
                          : (item.description ? `<p>${item.description}</p>` : "") +
                            ((item.bullets && item.bullets.length > 0)
                              ? `<ul>${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
                              : "")
                      }
                      onChange={(val) => updateItem(iIdx, { content: val })}
                      placeholder="Briefly describe the project's purpose and detail specific technical achievements."
                      minHeight="120px"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      <EditorAddButton
        label="Add Project"
        onClick={addItem}
        toastTitle="Project Added"
        toastDescription="A new project entry has been created."
      />
    </div>
  );
}
