import React, { useState } from "react";
import { Calendar, MapPin, Briefcase, Check, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import type { ExperienceItem } from "@resume/types";
import { cn } from "@/lib/cn";
import { EditorAddButton } from "./editor-add-button";
import { useToast } from "@/hooks/use-toast";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { DateSelector } from "@/components/ui/date-selector";
import { parseDate, formatDate } from "@/lib/date-utils";

interface ExperienceEditorProps {
  data: ExperienceItem[];
  onUpdate: (newData: ExperienceItem[]) => void;
}

export function ExperienceEditor({ data, onUpdate }: ExperienceEditorProps) {
  const { toast } = useToast();
  const items = data || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateItem = (index: number, updates: Partial<ExperienceItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemToRemove = items[index];
    const jobTitle = itemToRemove.jobTitle || "Experience item";
    
    onUpdate(items.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);

    toast({
      title: "Position Removed",
      description: `Removed ${jobTitle} from your experience.`,
      variant: "destructive",
    });
  };

  const addItem = () => {
    const newItem: ExperienceItem = {
      jobTitle: "",
      companyName: "",
      location: "",
      startDate: "",
      isCurrent: false,
      bullets: [""],
    };
    onUpdate([...items, newItem]);
    setExpandedIndex(items.length);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className={cn('flex', 'flex-col', 'items-center', 'justify-center', 'p-8', 'border-2', 'border-dashed', 'border-zinc-100', 'rounded-xl', 'bg-zinc-50/30', 'text-center', 'space-y-3')}>
          <div className={cn('h-12', 'w-12', 'rounded-full', 'bg-zinc-100', 'flex', 'items-center', 'justify-center')}>
            <Briefcase size={20} className="text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h4 className={cn('text-sm', 'font-medium', 'text-zinc-900')}>No experience yet?</h4>
            <p className={cn('text-xs', 'text-zinc-500', 'max-w-[320px]')}>
              If you&apos;re a fresher, you can focus on projects, education, and skills. Or add internships and volunteer work here.
            </p>
          </div>
        </div>
      )}

      {items.map((item, iIdx) => {
        const isExpanded = expandedIndex === iIdx;
        const startDate = parseDate(item.startDate);
        const endDate = parseDate(item.isCurrent ? "" : item.endDate || "");
        
        return (
          <CollapsibleCard
            key={iIdx}
            isExpanded={isExpanded}
            onToggle={() => toggleExpand(iIdx)}
            onRemove={(e) => removeItem(iIdx, e)}
            title={item.jobTitle || "Job Title"}
            subtitle={item.companyName}
            metadata={
              <>
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="shrink-0" />
                  {startDate.month || startDate.year ? `${formatDate(startDate.month, startDate.year)}` : "Start"} — {item.isCurrent ? "Present" : (endDate.month || endDate.year ? `${formatDate(endDate.month, endDate.year)}` : "End")}
                </div>
                {item.location && (
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                )}
              </>
            }
          >
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <Input
                      className="pl-10 h-11 border-zinc-200 focus:border-zinc-900 focus:ring-0 transition-all rounded-lg"
                      value={item.jobTitle}
                      onChange={(e) => updateItem(iIdx, { jobTitle: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Company Name</Label>
                  <Input
                    className="h-11 border-zinc-200 rounded-lg"
                    value={item.companyName}
                    onChange={(e) => updateItem(iIdx, { companyName: e.target.value })}
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <Input
                      className="pl-10 h-11 border-zinc-200 rounded-lg"
                      value={item.location}
                      onChange={(e) => updateItem(iIdx, { location: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Start Date Selection */}
                  <DateSelector 
                    label="Start Date"
                    value={startDate}
                    onChange={(field, val) => {
                      const newDate = { ...startDate, [field]: val };
                      updateItem(iIdx, { startDate: formatDate(newDate.month, newDate.year) });
                    }}
                  />

                  {/* End Date Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">End Date</Label>
                      <button 
                        type="button"
                        onClick={() => updateItem(iIdx, { 
                          isCurrent: !item.isCurrent,
                          endDate: !item.isCurrent ? "" : item.endDate 
                        })}
                        className={cn(
                          "text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all font-medium",
                          item.isCurrent 
                            ? "bg-zinc-900 border-zinc-900 text-white" 
                            : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400"
                        )}
                      >
                        {item.isCurrent && <Check size={10} strokeWidth={3} />}
                        Currently Work Here
                      </button>
                    </div>
                    {!item.isCurrent && (
                      <div className="animate-in fade-in duration-200">
                        <DateSelector 
                          value={endDate}
                          onChange={(field, val) => {
                            const newDate = { ...endDate, [field]: val };
                            updateItem(iIdx, { endDate: formatDate(newDate.month, newDate.year) });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Accomplishments Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Key Accomplishments</Label>
                <span className="text-[10px] text-zinc-400 italic hidden sm:inline">One point per line. Focus on metrics and impact</span>
              </div>
              
              <div className="space-y-3">
                <RichTextEditor
                  value={
                    item.content !== undefined
                      ? item.content
                      : (item.bullets && item.bullets.length > 0)
                        ? `<ul>${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
                        : ""
                  }
                  onChange={(val) => updateItem(iIdx, { content: val })}
                  placeholder="Led a team of 5 to redesign the core API, reducing latency by 40%..."
                  minHeight="120px"
                />
              </div>
            </div>
          </CollapsibleCard>
        );
      })}

      <EditorAddButton
        label="Add Professional Position"
        onClick={addItem}
        toastTitle="Position Added"
        toastDescription="A new professional experience entry has been created."
      />
    </div>
  );
}
