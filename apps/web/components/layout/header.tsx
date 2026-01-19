"use client";

import React from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { clsx } from "clsx";

interface HeaderProps {
  resumeName: string;
  onResumeNameChange: (name: string) => void;
  activeLayout: string;
  onLayoutChange: (
    layout: "minimalist" | "professional" | "international",
  ) => void;
  onCleanAll: () => void;
  onExportPDF: () => void;
}

export function Header({
  resumeName,
  onResumeNameChange,
  activeLayout,
  onLayoutChange,
  onCleanAll,
  onExportPDF,
}: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-dashed border-zinc-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.svg"
          alt="Resume: Zero Logo"
          width={32}
          height={32}
          className="rounded-lg shadow-sm border border-zinc-100"
        />
        <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block" />
        <div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <h1 className="text-[14px] font-semibold tracking-tight text-zinc-900 leading-none hidden xs:block">
              Resume: Zero
            </h1>
            <span className="text-zinc-300 hidden xs:block">/</span>
            <input
              className="text-[14px] font-medium text-zinc-700 bg-transparent border-none p-0 focus:ring-0 w-24 sm:w-32 focus:text-zinc-900 transition-colors truncate"
              value={resumeName || ""}
              onChange={(e) => onResumeNameChange(e.target.value)}
              placeholder="My Resume"
            />
          </div>
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">
            v1.0.0
          </p>
        </div>
      </div>

      <div className={clsx("flex", "items-center", "gap-3")}>
        <div
          className={clsx(
            "hidden",
            "md:flex",
            "bg-zinc-100/50 border border-zinc-200",
            "p-0.5",
            "rounded-lg",
          )}
        >
          {(["minimalist", "professional", "international"] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => onLayoutChange(t)}
                className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all capitalize cursor-pointer ${
                  activeLayout === t
                    ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-zinc-900"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {t}
              </button>
            ),
          )}
        </div>

        <div className={clsx("w-px", "h-6", "bg-zinc-200", "mx-1")} />

        <button
          onClick={onCleanAll}
          className={clsx(
            "flex",
            "items-center",
            "gap-2",
            "px-3",
            "sm:px-4",
            "py-2",
            "sm:py-1.5",
            "bg-black",
            "text-white",
            "rounded-lg",
            "text-[11px]",
            "font-bold",
            "sm:font-medium",
            "hover:bg-zinc-800",
            "active:scale-95",
            "transition-all",
            "cursor-pointer",
            "whitespace-nowrap",
          )}
        >
          Clean All
        </button>

        <button
          onClick={onExportPDF}
          className={clsx(
            "flex",
            "items-center",
            "gap-2",
            "px-3",
            "sm:px-4",
            "py-1.5",
            "border",
            "border-zinc-200",
            "bg-white",
            "text-zinc-900",
            "rounded-lg",
            "text-[11px]",
            "font-medium",
            "hover:bg-zinc-50",
            "transition-all",
            "cursor-pointer",
          )}
        >
          <Download size={12} />
          <span className="hidden xs:inline">Export PDF</span>
          <span className="xs:hidden">PDF</span>
        </button>
      </div>
    </header>
  );
}
