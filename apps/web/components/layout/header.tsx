"use client";

import NextImage from "next/image";
import {
  Download,
  Trash2,
  ChevronDown,
  Cloud,
  Plus,
  ChevronUp,
  Loader,
  Loader2,
} from "lucide-react";
import { IoDuplicate } from "react-icons/io5";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import type { ResumeData } from "@resume/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import {format} from "date-fns"

interface HeaderProps {
  resumeName: string;
  onResumeNameChange: (name: string) => void;
  activeLayout: "minimalist" | "professional" | "international" | "executive";
  onLayoutChange: (
    layout: "minimalist" | "professional" | "international" | "executive",
  ) => void;
  onExportPDF: () => void;
  resumes: Record<string, ResumeData>;
  activeId: string | null;
  onSelectVersion: (id: string) => void;
  onCreateNewVersion: () => void;
  onDeleteVersion: (id: string) => void;
  isSaving?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

import { Undo2, Redo2 } from "lucide-react";

export function Header({
  resumeName,
  onResumeNameChange,
  activeLayout,
  onLayoutChange,
  onExportPDF,
  resumes,
  activeId,
  onSelectVersion,
  onCreateNewVersion,
  onDeleteVersion,
  isSaving,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: HeaderProps) {
  return (
    <header
        className={cn(
          "no-print",
          "sticky",
          "top-0",
          "z-50",
          "bg-white/90",
          "backdrop-blur-xl",
          "border-b",
          "border-zinc-100",
          "px-6 sm:px-8",
          "py-3",
          "flex",
          "items-center",
          "justify-between",
          "gap-2 sm:gap-4",
        )}
      >
        <div className={cn("flex", "items-center", "gap-2 sm:gap-4", "min-w-0")}>
          <div className={cn("relative", "hidden sm:block")}>
            <NextImage
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className={cn("relative", "rounded", "border", "border-zinc-200")}
            />
          </div>
          
          <div className={cn("flex", "flex-col", "min-w-0")}>
              <input
                className={cn(
                  "text-xs sm:text-sm",
                  "font-medium",
                  "text-zinc-600",
                  "bg-transparent",
                  "border-none",
                  "p-1",
                  "focus:ring-0",
                  "focus:text-zinc-900",
                  "transition-colors",
                  "truncate",
                )}
                maxLength={20}
                style={{ width: `${Math.max((resumeName || "").length, 4) + 1}ch`, maxWidth: "120px" }}
                value={resumeName || ""}
                onChange={(e) => onResumeNameChange(e.target.value)}
                placeholder="Untitled"
              />
          </div>

          <div className={cn('flex', 'items-center', 'gap-1.5', 'sm:gap-3')}>
            <div className={cn('h-4', 'w-px', 'bg-zinc-100', 'hidden', 'sm:block')} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "group",
                    "h-7 sm:h-8",
                    "gap-1.5",
                    "px-2 sm:px-3",
                    "rounded-full",
                    "border border-zinc-200 cursor-pointer focus:border-0 focus:ring-0",
                    "bg-zinc-50 hover:bg-zinc-100",
                    "text-zinc-600",
                    "transition-all",
                  )}
                >
                  <IoDuplicate
                    size={14}
                    className={cn("group-hover:scale-110", "transition-transform")}
                  />
                  <span
                    className={cn(
                      "text-xs",
                      "font-medium",
                      "tracking-tight",
                      "hidden sm:inline",
                    )}
                  >
                    Versions
                  </span>
                  <ChevronDown
                    size={10}
                    className={cn("opacity-50", "group-data-[state=open]:hidden")}
                  />
                  <ChevronUp
                    size={10}
                    className={cn("opacity-50", "group-data-[state=open]:block", "hidden")}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={cn('w-56', 'p-1')}>
                <DropdownMenuLabel className={cn('text-[9px]', 'uppercase', 'tracking-widest', 'text-zinc-400', 'px-3', 'py-2', 'font-medium')}>
                  Resumes
                </DropdownMenuLabel>
                <div className={cn('max-h-[300px]', 'overflow-y-auto')}>
                  {Object.values(resumes).map((r) => (
                    <DropdownMenuItem
                      key={r.id}
                      className={cn(
                        "flex items-center justify-between cursor-pointer rounded-md px-3 py-2",
                        activeId === r.id ? "bg-zinc-100" : "hover:bg-zinc-50"
                      )}
                      onClick={() => onSelectVersion(r.id)}
                    >
                      <div className={cn('flex', 'flex-col', 'gap-0.5', 'min-w-0')}>
                        <span className={cn(
                          "text-xs font-medium truncate",
                          activeId === r.id ? "text-zinc-900" : "text-zinc-600"
                        )}>
                          {r.metadata.name || "Untitled"}
                        </span>
                        <span className={cn('text-[9px]', 'text-zinc-400')}>
                          {format(r.metadata.lastModified, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={cn('gap-2', 'cursor-pointer', 'py-2', 'rounded-md', 'text-zinc-600', 'text-xs')}
                  onClick={onCreateNewVersion}
                >
                  <Plus size={12} />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn('gap-2', 'cursor-pointer', 'py-2', 'rounded-md', 'text-red-500', 'hover:bg-red-50', 'text-xs')}
                  onClick={() => activeId && onDeleteVersion(activeId)}
                >
                  <Trash2 size={12} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className={cn('flex', 'items-center', 'text-zinc-400')}>
              {isSaving ? (
                <div className={cn('flex', 'items-center', 'gap-1')}>
                  <Loader2 size={22} className={cn('text-zinc-400', 'animate-spin')} strokeWidth={1.5} />
                  <span className={cn('text-[9px]', 'font-medium', 'uppercase', 'tracking-tight', 'text-zinc-500', 'hidden', 'sm:inline', 'animate-pulse')}>
                    Saving...
                  </span>
                </div>
              ) : (
                <div className={cn('flex', 'items-center', 'gap-1')}>
                  <Cloud size={24} className="text-zinc-300" strokeWidth={1.5} />
                  <span className={cn('text-[9px]', 'font-medium', 'uppercase', 'tracking-tight', 'text-zinc-300', 'hidden', 'sm:inline')}>
                    Saved
                  </span>
                </div>
              )}  
            </div>
          </div>
        </div>

        <div className={cn("flex", "items-center", "gap-2 sm:gap-6", "shrink-0")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn('h-7', 'sm:h-8', 'gap-1.5', 'px-2', 'sm:px-3', 'rounded-full', 'border', 'border-zinc-200', 'bg-zinc-50', 'text-xs', 'font-medium', 'tracking-tight', 'text-zinc-600')}
              >
                <span className={cn('truncate', 'max-w-[80px]', 'capitalize')}>{activeLayout}</span>
                <ChevronDown size={10} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn('w-40', 'p-1')}>
              {(["minimalist", "professional", "international", "executive"] as const).map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => onLayoutChange(t)}
                  className={cn(
                    "text-xs capitalize py-2",
                    activeLayout === t ? "bg-zinc-100 font-medium" : ""
                  )}
                >
                  {t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className={cn('flex', 'items-center', 'gap-1', 'mr-2')}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className={cn('h-8', 'w-8', 'rounded-full', 'text-zinc-500', 'hover:bg-zinc-100', 'disabled:opacity-30', 'transition-all')}
                >
                  <Undo2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className={cn('flex', 'items-center', 'gap-2')}>
                <span className={cn('text-[10px]', 'font-medium')}>Undo</span>
                <Kbd keys={["mod", "Z"]} />
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className={cn('h-8', 'w-8', 'rounded-full', 'text-zinc-500', 'hover:bg-zinc-100', 'disabled:opacity-30', 'transition-all')}
                >
                  <Redo2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className={cn('flex', 'items-center', 'gap-2')}>
                <span className={cn('text-[10px]', 'font-medium')}>Redo</span>
                <Kbd keys={["mod", "shift", "Z"]} />
              </TooltipContent>
            </Tooltip>
          </div>

         

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={onExportPDF}
                className={cn("h-7 w-7 sm:h-8 sm:w-auto gap-1.5 rounded-full text-xs font-medium p-0 sm:px-4")}
              >
                <Download size={13} strokeWidth={2} />
                <span className={cn('hidden', 'sm:inline')}>Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className={cn('flex', 'items-center', 'gap-2')}>
              <span className={cn('text-[10px]', 'font-medium')}>Export PDF</span>
              <Kbd keys={["mod", "E"]} />
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
  );
}
