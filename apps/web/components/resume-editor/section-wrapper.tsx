"use client";

import React from "react";
import { clsx } from "clsx";
import { Copy, Trash2 } from "lucide-react";

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
  return (
    <div className="editor-section group">
      <div className={clsx("flex", "items-center", "justify-between", "mb-6")}>
        <div className={clsx("flex", "items-center", "gap-2", "text-zinc-400")}>
          <span className="editor-label">{type}</span>
          {isMandatory && (
            <span className="text-[10px] font-bold text-zinc-400/80 bg-zinc-100 px-1.5 py-0.5 rounded">
              REQUIRED
            </span>
          )}
        </div>
        <div className={clsx("flex", "items-center", "gap-2")}>
          <button
            onClick={onCopy}
            className={clsx(
              "opacity-0",
              "group-hover:opacity-100",
              "p-2",
              "text-zinc-400",
              "hover:text-zinc-900",
              "hover:bg-zinc-100",
              "rounded-md",
              "transition-all",
              "cursor-pointer",
            )}
            title="Copy Section Text"
          >
            <Copy size={14} />
          </button>
          {!isMandatory && (
            <button
              onClick={onRemove}
              className={clsx(
                "opacity-0",
                "group-hover:opacity-100",
                "p-2",
                "text-zinc-400",
                "hover:text-red-500",
                "hover:bg-red-50",
                "rounded-md",
                "transition-all",
                "cursor-pointer",
              )}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
