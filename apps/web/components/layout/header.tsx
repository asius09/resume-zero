"use client";

import Image from "next/image";
import { Download, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import type { ResumeData } from "@resume/types";

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
}: HeaderProps) {
  return (
    <header
      className={cn(
        "no-print",
        "sticky",
        "top-0",
        "z-50",
        "bg-white/80",
        "backdrop-blur-xl",
        "border-b",
        "border-zinc-100",
        "px-6",
        "py-4",
        "flex",
        "items-center",
        "justify-between",
      )}
    >
      <div className={cn("flex", "items-center", "gap-4")}>
        <div className={cn("relative", "group")}>
          <div
            className={cn(
              "absolute",
              "-inset-1",
              "bg-linear-to-r",
              "from-zinc-200",
              "to-zinc-100",
              "rounded-lg",
              "blur",
              "opacity-25",
              "group-hover:opacity-100",
              "transition",
              "duration-1000",
              "group-hover:duration-200",
            )}
          ></div>
          <Image
            src="/logo.svg"
            alt="Resume: Zero Logo"
            width={32}
            height={32}
            className={cn(
              "relative",
              "rounded-lg",
              "border",
              "border-zinc-200",
              "shadow-sm",
            )}
          />
        </div>
        <div
          className={cn(
            "h-6",
            "w-px",
            "bg-zinc-200",
            "mx-1",
            "hidden",
            "sm:block",
          )}
        />
        <div className={cn("flex", "flex-col")}>
          <div className={cn("flex", "items-center", "gap-2")}>
            <h1
              className={cn(
                "text-sm",
                "font-bold",
                "tracking-tighter",
                "text-zinc-900",
                "leading-none",
              )}
            >
              RESUME:ZERO
            </h1>
            <span className={cn("text-zinc-200", "font-light")}>/</span>
            <input
              className={cn(
                "text-sm",
                "font-medium",
                "text-zinc-600",
                "bg-transparent",
                "border-none",
                "p-0",
                "focus:ring-0",
                "w-32",
                "focus:text-zinc-900",
                "transition-colors",
                "truncate",
              )}
              value={resumeName || ""}
              onChange={(e) => onResumeNameChange(e.target.value)}
              placeholder="Untitled"
            />
          </div>
        </div>

        <div className={cn("h-6", "w-px", "bg-zinc-200", "mx-1", "hidden", "md:block")} />

        <div className={cn("hidden", "md:flex", "items-center", "gap-2")}>
          <select
            className={cn(
              "text-[10px]",
              "font-bold",
              "uppercase",
              "tracking-wider",
              "bg-zinc-50",
              "border",
              "border-zinc-200",
              "rounded-full",
              "px-3",
              "py-1",
              "focus:ring-0",
              "cursor-pointer",
            )}
            value={activeId || ""}
            onChange={(e) => onSelectVersion(e.target.value)}
          >
            {Object.values(resumes).map((r) => (
              <option key={r.id} value={r.id}>
                {r.metadata.name || "Untitled"}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={onCreateNewVersion}
            title="Create Copy"
          >
            <Copy size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => activeId && onDeleteVersion(activeId)}
            title="Delete Version"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <div className={cn("flex", "items-center", "gap-6")}>
        <div
          className={cn(
            "hidden",
            "md:flex",
            "items-center",
            "bg-zinc-50",
            "border",
            "border-zinc-200",
            "p-1",
            "rounded-full",
            "px-2",
          )}
        >
          {(["minimalist", "professional", "international"] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => onLayoutChange(t)}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer",
                  activeLayout === t
                    ? "bg-white shadow-sm text-zinc-900 border border-zinc-100"
                    : "text-zinc-400 hover:text-zinc-600",
                )}
              >
                {t}
              </button>
            ),
          )}
        </div>

        <div className={cn("flex", "items-center", "gap-2")}>
          <Button
            size="sm"
            onClick={onExportPDF}
            className={cn("gap-2", "rounded-full font-medium")}
          >
            <Download size={14} />
            <span className={cn("md:block", "hidden")}>Export PDF</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
