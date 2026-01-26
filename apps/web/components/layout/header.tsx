"use client";

import NextImage from "next/image";
import {
  Download,
  Trash2,
  ChevronDown,
  Cloud,
  Plus,
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

interface HeaderProps {
  resumeName: string;
  onResumeNameChange: (name: string) => void;
  activeLayout: string;
  onLayoutChange: (
    layout: "minimalist" | "professional" | "international",
  ) => void;
  onExportPDF: () => void;
  resumes: Record<string, ResumeData>;
  activeId: string | null;
  onSelectVersion: (id: string) => void;
  onCreateNewVersion: () => void;
  onDeleteVersion: (id: string) => void;
  isSaving?: boolean;
}

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
        "px-3 sm:px-6",
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
            width={24}
            height={24}
            className={cn("relative", "rounded", "border", "border-zinc-200")}
          />
        </div>
        
        <div className={cn("flex", "flex-col", "min-w-0")}>
          <div className={cn("flex", "items-center", "gap-1.5")}>
            <h1 className={cn('text-[10px]', 'font-semibold', 'tracking-tight', 'text-zinc-400', 'hidden', 'xs:block')}>
              ZERO
            </h1>
            <span className={cn('text-zinc-200', 'hidden', 'xs:block')}>/</span>
            <input
              className={cn(
                "text-xs sm:text-sm",
                "font-medium",
                "text-zinc-600",
                "bg-transparent",
                "border-none",
                "p-0",
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
        </div>

        <div className={cn('flex', 'items-center', 'gap-1.5', 'sm:gap-3')}>
          <div className={cn('h-4', 'w-px', 'bg-zinc-100', 'hidden', 'sm:block')} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn('h-7', 'sm:h-8', 'gap-1.5', 'px-2', 'sm:px-3', 'rounded-full', 'border', 'border-zinc-200', 'bg-zinc-50', 'hover:bg-zinc-100', 'text-zinc-600', 'transition-all')}
              >
                <IoDuplicate size={14} className={cn('group-hover:scale-110', 'transition-transform')} />
                <span className={cn('text-[10px]', 'font-medium', 'uppercase', 'tracking-tight', 'hidden', 'sm:inline')}>
                  Versions
                </span>
                <ChevronDown size={10} className="opacity-50" />
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
                        {new Date(r.metadata.lastModified).toLocaleDateString()}
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
              <div className={cn('flex', 'items-center', 'gap-1', 'animate-pulse')}>
                <Cloud size={13} className="text-zinc-400" strokeWidth={1.5} />
                <span className={cn('text-[9px]', 'font-medium', 'uppercase', 'tracking-tight', 'text-zinc-500', 'hidden', 'xs:inline')}>
                  Saving
                </span>
              </div>
            ) : (
              <div className={cn('flex', 'items-center', 'gap-1')}>
                <Cloud size={13} className="text-zinc-300" strokeWidth={1.5} />
                <span className={cn('text-[9px]', 'font-medium', 'uppercase', 'tracking-tight', 'text-zinc-300', 'hidden', 'xs:inline')}>
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
              className={cn('h-7', 'sm:h-8', 'gap-1.5', 'px-2', 'sm:px-3', 'rounded-full', 'border', 'border-zinc-200', 'bg-zinc-50', 'text-[10px]', 'font-medium', 'uppercase', 'tracking-tight', 'text-zinc-600', 'md:hidden')}
            >
              <span className={cn('truncate', 'max-w-[60px]')}>{activeLayout}</span>
              <ChevronDown size={10} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn('w-40', 'p-1')}>
            {(["minimalist", "professional", "international"] as const).map((t) => (
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

        <Tabs
          value={activeLayout}
          onValueChange={(v) =>
            onLayoutChange(
              v as "minimalist" | "professional" | "international",
            )
          }
          className={cn('hidden', 'md:block')}
        >
          <TabsList className={cn('bg-zinc-50', 'border', 'border-zinc-200', 'rounded-full', 'h-8', 'px-1')}>
            {(["minimalist", "professional", "international"] as const).map(
              (t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className={cn('rounded-full', 'px-3', 'py-1', 'text-[10px]', 'font-medium', 'uppercase', 'tracking-tight', 'data-[state=active]:bg-white', 'data-[state=active]:text-zinc-900', 'data-[state=active]:shadow-sm', 'transition-all')}
                >
                  {t}
                </TabsTrigger>
              ),
            )}
          </TabsList>
        </Tabs>

        <Button
          size="sm"
          onClick={onExportPDF}
          className={cn("h-7 w-7 sm:h-8 sm:w-auto gap-1.5 rounded-full text-xs font-medium p-0 sm:px-4")}
        >
          <Download size={13} strokeWidth={2} />
          <span className={cn('hidden', 'sm:inline')}>Export</span>
        </Button>
      </div>
    </header>
  );
}
