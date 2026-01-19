"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { clsx } from "clsx";
import {
  ATSMinimalist,
  ModernProfessional,
  InternationalFormat,
} from "@resume/ui";
import type { ResumeData } from "@resume/types";

interface ResumePreviewProps {
  data: ResumeData;
  activeLayout: "minimalist" | "professional" | "international";
  renderPlainText: () => string;
}

export function ResumePreview({
  data,
  activeLayout,
  renderPlainText,
}: ResumePreviewProps) {
  const [previewMode, setPreviewMode] = useState<"styled" | "plain">("styled");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const el = document.getElementById("resume-preview");
    if (el) {
      const text = el.innerText;
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div
      className={clsx(
        "preview-side",
        "relative",
        "flex",
        "flex-col",
        "bg-zinc-100",
        "min-h-[calc(100vh-80px)]",
        "overflow-hidden",
      )}
    >
      <div
        className={clsx(
          "no-print",
          "sticky",
          "top-0",
          "z-40",
          "bg-white/80",
          "backdrop-blur-md",
          "border-b",
          "border-zinc-200",
          "px-8",
          "py-4",
          "flex",
          "items-center",
          "justify-between",
          "gap-4",
          "shadow-sm",
        )}
      >
        <div className={clsx("flex", "items-center", "gap-6")}>
          <div className="flex bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => setPreviewMode("styled")}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer uppercase tracking-wider ${
                previewMode === "styled"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-800"
              }`}
            >
              Styled PDF
            </button>
            <button
              onClick={() => setPreviewMode("plain")}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer uppercase tracking-wider ${
                previewMode === "plain"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-800"
              }`}
            >
              Plain Text
            </button>
          </div>
          <div className={clsx("h-6", "w-px", "bg-zinc-200")} />
          <span
            className={clsx(
              "text-emerald-700",
              "flex",
              "items-center",
              "gap-1.5",
              "text-[10px]",
              "font-bold",
              "uppercase",
              "tracking-widest",
              "whitespace-nowrap",
            )}
          >
            <Check size={12} strokeWidth={3} /> ATS Optimized
          </span>
        </div>

        <div className={clsx("flex", "items-center", "gap-4")}>
          <button
            onClick={handleCopy}
            className={clsx(
              "group",
              "flex",
              "items-center",
              "gap-2",
              "px-6",
              "py-2",
              "bg-zinc-900",
              "text-white",
              "rounded-lg",
              "text-[10px]",
              "font-black",
              "uppercase",
              "tracking-widest",
              "hover:bg-black",
              "active:scale-95",
              "transition-all",
              "shadow-md",
              "cursor-pointer",
              "whitespace-nowrap",
            )}
          >
            {isCopied ? (
              <Check size={12} strokeWidth={3} />
            ) : (
              <Copy size={12} />
            )}
            <span>{isCopied ? "Copied!" : "Quick Copy Full"}</span>
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "flex-1",
          "w-full",
          "overflow-y-auto",
          "p-4",
          "lg:p-12",
          "custom-scrollbar",
          "flex",
          "flex-col",
          "items-center",
          "pt-12",
          "bg-zinc-100",
        )}
      >
        <div
          id="resume-preview"
          className={`transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.85] xl:scale-[0.9] 2xl:scale-[1] print:scale-100 print:transform-none origin-top transition-all duration-500 h-fit mb-40 shadow-[0_0_80px_-15px_rgba(0,0,0,0.15)] ${
            previewMode === "plain"
              ? "bg-white p-12 w-[210mm] min-h-[297mm] shadow-none rounded-none text-left"
              : ""
          }`}
        >
          {previewMode === "plain" ? (
            <pre
              className={clsx(
                "whitespace-pre-wrap",
                "font-mono",
                "text-sm",
                "text-[#334155]",
              )}
            >
              {renderPlainText()}
            </pre>
          ) : (
            <>
              {activeLayout === "minimalist" && <ATSMinimalist data={data} />}
              {activeLayout === "professional" && (
                <ModernProfessional data={data} />
              )}
              {activeLayout === "international" && (
                <InternationalFormat data={data} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
