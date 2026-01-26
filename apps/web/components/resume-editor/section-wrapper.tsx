"use client";

import React from "react";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "../../lib/cn";

interface SectionWrapperProps {
  type: string;
  isMandatory?: boolean;
  onCopy?: () => void;
  onRemove?: () => void;
  children: React.ReactNode;
}

export function SectionWrapper({
  type,
  isMandatory,
  onCopy,
  onRemove,
  children,
}: SectionWrapperProps) {
  const title =
    type === "personal"
      ? "Personal Details"
      : type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className={cn('section-container', 'group', 'animate-in', 'fade-in', 'slide-in-from-top-4', 'duration-500')}>
      <div className={cn('flex', 'items-center', 'justify-between w-full', 'mb-4', 'px-2')}>
        <div className={cn('flex', 'items-center', 'justify-between', 'gap-2')}>
          <Label className={cn('text-sm', 'text-zinc-900', 'font-semibold', 'mb-0')}>
            {title}
          </Label>
          {isMandatory && (
            <span className={cn('text-[9px]', 'font-semibold', 'text-red-500', 'tracking-tighter', 'uppercase')}>
              Required
            </span>
          )}
        </div>
        <div className={cn('flex', 'items-center', 'gap-1', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className={cn('h-8', 'w-8')}
            title="Copy as text"
          >
            <Copy size={14} className="text-zinc-400" />
          </Button>
          {!isMandatory && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className={cn('h-8', 'w-8', 'hover:text-red-500', 'hover:bg-red-50')}
            >
              <Trash2 size={14} className="text-zinc-400" />
            </Button>
          )}
        </div>
      </div>
      <div className="bg-transparent">{children}</div>
    </div>
  );
}
