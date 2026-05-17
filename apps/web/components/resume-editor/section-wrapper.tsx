"use client";

import React from "react";
import { Copy, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "../../lib/cn";

interface SectionWrapperProps {
  id?: string;
  type: string;
  isMandatory?: boolean;
  onCopy?: () => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isDragged?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  type,
  isMandatory,
  onCopy,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isDragged,
  isDragOver,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDragOver,
  onDrop,
  children,
}: SectionWrapperProps) {
  const title =
    type === "personal"
      ? "Personal Details"
      : type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div 
      id={id}
      className={cn(
        'section-container group animate-in fade-in slide-in-from-top-4 duration-500 rounded-lg transition-all relative',
        isDragged && 'opacity-50 scale-95 border-dashed border-2 border-zinc-300',
        isDragOver && 'pt-2',
      )}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drop Indicator */}
      {isDragOver && (
        <div className="absolute -top-3 left-0 right-0 h-1 bg-blue-500 rounded-full z-50 pointer-events-none" />
      )}
      <div className={cn('flex', 'items-center', 'justify-between w-full', 'mb-4', 'px-2')}>
        <div className={cn('flex', 'items-center', 'justify-between', 'gap-2')}>
          <div className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600">
            <GripVertical size={16} />
          </div>
          <Label className={cn('text-sm', 'text-zinc-900', 'font-semibold', 'mb-0', 'cursor-default')}>
            {title}
          </Label>
          {isMandatory && (
            <span className={cn('text-[9px]', 'font-semibold', 'text-red-500', 'tracking-tighter', 'uppercase')}>
              Required
            </span>
          )}
        </div>
        <div className={cn('flex', 'items-center', 'gap-1', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity')}>
          {canMoveUp && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMoveUp}
                  className={cn('h-8', 'w-8')}
                >
                  <ChevronUp size={16} className="text-zinc-400 hover:text-zinc-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-[10px] font-medium">Move Up</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canMoveDown && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMoveDown}
                  className={cn('h-8', 'w-8')}
                >
                  <ChevronDown size={16} className="text-zinc-400 hover:text-zinc-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-[10px] font-medium">Move Down</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCopy}
                className={cn('h-8', 'w-8')}
              >
                <Copy size={14} className="text-zinc-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-[10px] font-medium">Copy Section text</p>
            </TooltipContent>
          </Tooltip>
          {!isMandatory && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                  className={cn('h-8', 'w-8', 'hover:text-red-500', 'hover:bg-red-50')}
                >
                  <Trash2 size={14} className="text-zinc-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-[10px] font-medium">Delete Section</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="bg-transparent">{children}</div>
    </div>
  );
}
