import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, GripVertical, Calendar, MapPin, Briefcase, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExperienceItem } from "@resume/types";
import { cn } from "@/lib/cn";
import { EditorAddButton } from "./editor-add-button";
import { useToast } from "@/hooks/use-toast";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 60 }, (_, i) => (new Date().getFullYear() - i).toString());

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

  const addBullet = (itemIdx: number) => {
    const newData = [...items];
    newData[itemIdx].bullets = [...(newData[itemIdx].bullets || []), ""];
    onUpdate(newData);
  };

  const updateBullet = (itemIdx: number, bulletIdx: number, value: string) => {
    const newData = [...items];
    newData[itemIdx].bullets[bulletIdx] = value;
    onUpdate(newData);
  };

  const removeBullet = (itemIdx: number, bulletIdx: number) => {
    const newData = [...items];
    newData[itemIdx].bullets = newData[itemIdx].bullets.filter(
      (_, i) => i !== bulletIdx,
    );
    onUpdate(newData);
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr) return { month: "", year: "" };
    const [year, month] = dateStr.split("-");
    const monthName = MONTHS[parseInt(month) - 1] || "";
    return { month: monthName, year };
  };

  const formatDate = (month: string, year: string) => {
    if (!month || !year) return "";
    const monthIdx = (MONTHS.indexOf(month) + 1).toString().padStart(2, "0");
    return `${year}-${monthIdx}`;
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-100 rounded-xl bg-zinc-50/30 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center">
            <Briefcase size={20} className="text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-900">No experience yet?</h4>
            <p className="text-xs text-zinc-500 max-w-[280px]">
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
          <Card
            key={iIdx}
            className={cn(
              "group/item border-zinc-200 shadow-sm transition-all duration-200 overflow-hidden",
              isExpanded ? "ring-1 ring-zinc-900 border-zinc-900" : "hover:border-zinc-300"
            )}
          >
            {/* Header / Summary View */}
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
                    !item.jobTitle && "text-zinc-400 italic"
                  )}>
                    {item.jobTitle || "Job Title"}
                  </span>
                  {item.companyName && (
                    <div className={cn('flex', 'items-center', 'gap-1', 'sm:gap-2')}>
                      <span className={cn('text-zinc-300', 'hidden', 'sm:inline')}>•</span>
                      <span className={cn('text-zinc-600', 'truncate', 'text-xs', 'sm:text-sm')}>{item.companyName}</span>
                    </div>
                  )}
                </div>
                {!isExpanded && (
                  <div className={cn('flex', 'flex-wrap', 'items-center', 'gap-3', 'sm:gap-4', 'mt-1', 'text-[10px]', 'sm:text-xs', 'text-zinc-500')}>
                    <div className={cn('flex', 'items-center', 'gap-1')}>
                      <Calendar size={12} className="shrink-0" />
                      {startDate.month && startDate.year ? `${startDate.month.slice(0,3)} ${startDate.year}` : "Start"} — {item.isCurrent ? "Present" : (endDate.month && endDate.year ? `${endDate.month.slice(0,3)} ${endDate.year}` : "End")}
                    </div>
                    {item.location && (
                      <div className={cn('flex', 'items-center', 'gap-1', 'min-w-0')}>
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
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
                {/* Basic Info Grid */}
                <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-x-8', 'gap-y-6', 'text-sm', 'sm:text-base')}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Job Title</Label>
                      <div className="relative">
                        <Briefcase className={cn('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'text-zinc-400')} size={16} />
                        <Input
                          className={cn('pl-10', 'h-11', 'border-zinc-200', 'focus:border-zinc-900', 'focus:ring-0', 'transition-all', 'rounded-lg')}
                          value={item.jobTitle}
                          onChange={(e) => updateItem(iIdx, { jobTitle: e.target.value })}
                          placeholder="e.g. Senior Software Engineer"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Company Name</Label>
                        <Input
                          className={cn('h-11', 'border-zinc-200', 'rounded-lg')}
                          value={item.companyName}
                          onChange={(e) => updateItem(iIdx, { companyName: e.target.value })}
                          placeholder="e.g. Google"
                        />
                      </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Location</Label>
                      <div className="relative">
                        <MapPin className={cn('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'text-zinc-400')} size={16} />
                        <Input
                          className={cn('pl-10', 'h-11', 'border-zinc-200', 'rounded-lg')}
                          value={item.location}
                          onChange={(e) => updateItem(iIdx, { location: e.target.value })}
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Start Date Selection */}
                      <div className="space-y-2">
                        <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Start Date</Label>
                        <div className={cn('grid', 'grid-cols-2', 'gap-2')}>
                          <Select 
                            value={startDate.month} 
                            onValueChange={(val) => updateItem(iIdx, { startDate: formatDate(val, startDate.year) })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {MONTHS.map(m => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select 
                            value={startDate.year} 
                            onValueChange={(val) => updateItem(iIdx, { startDate: formatDate(startDate.month, val) })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {YEARS.map(y => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* End Date Selection */}
                      <div className="space-y-2">
                        <div className={cn('flex', 'items-center', 'justify-between')}>
                          <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>End Date</Label>
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
                          <div className={cn('grid', 'grid-cols-2', 'gap-2', 'animate-in', 'fade-in', 'duration-200')}>
                             <Select 
                              value={endDate.month} 
                              onValueChange={(val) => updateItem(iIdx, { endDate: formatDate(val, endDate.year) })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {MONTHS.map(m => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select 
                              value={endDate.year} 
                              onValueChange={(val) => updateItem(iIdx, { endDate: formatDate(endDate.month, val) })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {YEARS.map(y => (
                                  <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accomplishments Section */}
                <div className={cn('space-y-4', 'pt-4', 'border-t', 'border-zinc-100')}>
                  <div className={cn('flex', 'items-center', 'justify-between')}>
                    <Label className={cn('text-[10px]', 'font-semibold', 'uppercase', 'text-zinc-500', 'tracking-wider')}>Key Accomplishments</Label>
                    <span className={cn('text-[10px]', 'text-zinc-400', 'italic', 'hidden', 'sm:inline')}>Focus on metrics and impact</span>
                  </div>
                  
                  <div className="space-y-3">
                    {(item.bullets || []).map((bullet, bulIdx) => (
                      <div key={bulIdx} className={cn('flex', 'gap-3', 'items-start', 'group/bullet', 'transition-all', 'duration-200')}>
                        <div className={cn('shrink-0', 'mt-3', 'h-1.5', 'w-1.5', 'rounded-full', 'bg-zinc-300', 'group-focus-within/bullet:bg-zinc-900', 'transition-colors')} />
                        <div className={cn('flex-1', 'relative')}>
                          <Textarea
                            className={cn('min-h-[80px]', 'w-full', 'resize-none', 'py-2', 'px-3', 'border-zinc-200', 'focus:border-zinc-900', 'focus:ring-0', 'transition-all', 'pr-10', 'rounded-lg', 'text-sm')}
                            value={bullet}
                            onChange={(e) => updateBullet(iIdx, bulIdx, e.target.value)}
                            placeholder="e.g. Led a team of 5 to redesign the core API, reducing latency by 40%."
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBullet(iIdx, bulIdx)}
                            className={cn('absolute', 'top-1', 'right-1', 'h-7', 'w-7', 'text-zinc-300', 'hover:text-red-500', 'sm:opacity-0', 'sm:group-hover/bullet:opacity-100', 'transition-opacity')}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <EditorAddButton
                      label="Add Bullet Point"
                      variant="secondary"
                      onClick={() => addBullet(iIdx)}
                      toastTitle="Bullet Added"
                      toastDescription="A new accomplishment point has been created."
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
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
