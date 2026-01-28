"use client";

import React from "react";
import { Trash2, Languages, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { LanguageItem } from "@resume/types";
import { EditorAddButton } from "./editor-add-button";
import { useToast } from "@/hooks/use-toast";

interface LanguagesEditorProps {
  data: LanguageItem[];
  onUpdate: (newData: LanguageItem[]) => void;
}

const COMMON_LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "German", 
  "Arabic", "Chinese (Mandarin)", "Japanese", "Korean", "Russian",
  "Portuguese", "Italian", "Bengali", "Urdu", "Punjabi",
  "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada"
].sort();

export function LanguagesEditor({ data, onUpdate }: LanguagesEditorProps) {
  const { toast } = useToast();
  const items = data || [];

  const updateItem = (index: number, updates: Partial<LanguageItem>) => {
    const newData = [...items];
    newData[index] = { ...newData[index], ...updates };
    onUpdate(newData);
  };

  const removeItem = (index: number) => {
    const lang = items[index].language || "Language";
    onUpdate(items.filter((_, i) => i !== index));
    toast({
      title: "Language Removed",
      description: `Removed ${lang} from your profile.`,
      variant: "destructive",
    });
  };

  const addItem = () => {
    onUpdate([...items, { language: "", proficiency: "Basic" }]);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, iIdx) => {
          const isCommonLanguage = COMMON_LANGUAGES.includes(item.language) || item.language === "";
          
          return (
            <Card
              key={iIdx}
              className="group/item border-zinc-200 shadow-sm hover:border-zinc-300 transition-all duration-200 overflow-hidden"
            >
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 px-1">
                        <Languages size={12} className="text-zinc-400" />
                        <Label className="text-[10px] font-semibold uppercase text-zinc-400">Language</Label>
                      </div>
                      <Select
                        value={isCommonLanguage ? item.language : "other"}
                        onValueChange={(val) => {
                          if (val === "other") {
                            updateItem(iIdx, { language: " " }); // Space to trigger "Other" mode
                          } else {
                            updateItem(iIdx, { language: val });
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 text-xs font-medium border-zinc-200">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_LANGUAGES.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                          <SelectItem value="other">Other (Type manually)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(!isCommonLanguage || item.language === " ") && (
                      <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                        <Input
                          className="h-9 text-xs border-zinc-200 focus:border-zinc-900 focus:ring-0 transition-all"
                          value={item.language === " " ? "" : item.language}
                          onChange={(e) => updateItem(iIdx, { language: e.target.value })}
                          placeholder="Type language name..."
                          autoFocus
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(iIdx)}
                    className="h-7 w-7 text-zinc-300 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover/item:opacity-100 transition-all mt-1"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                     <Star size={12} className="text-zinc-400" />
                     <Label className="text-[10px] font-semibold uppercase text-zinc-400">Proficiency Level</Label>
                  </div>
                  <Select
                    value={item.proficiency}
                    onValueChange={(val) =>
                      updateItem(iIdx, { proficiency: val })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs border-zinc-200">
                      <SelectValue placeholder="Select Proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Native">Native</SelectItem>
                      <SelectItem value="Fluent">Fluent</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EditorAddButton
        label="Add Language"
        onClick={addItem}
        toastTitle="Language Added"
        toastDescription="A new language entry has been created."
      />
    </div>
  );
}
