"use client";

import { useState } from "react";
import { Copy, Check,  Printer } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import {
  ATSMinimalist,
  ATSMinimalistPDF,
  ModernProfessional,
  InternationalFormat,
} from "@resume/ui";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { useEffect } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
    <div className={cn('w-full', 'flex', 'flex-col', 'items-center')}>
      <div className={cn('no-print', 'bg-white/80', 'backdrop-blur-md', 'border', 'border-zinc-200', 'rounded-full', 'px-4', 'py-2', 'mb-4', 'flex', 'items-center', 'gap-4', 'shadow-sm')}>
        <div className={cn('flex', 'bg-zinc-100', 'p-0.5', 'rounded-full')}>
          <button
            onClick={() => setPreviewMode("styled")}
            className={cn(
              "px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer",
              previewMode === "styled"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-400 hover:text-zinc-600",
            )}
          >
            Styled
          </button>
          <button
            onClick={() => setPreviewMode("plain")}
            className={cn(
              "px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer",
              previewMode === "plain"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-400 hover:text-zinc-600",
            )}
          >
            Plain
          </button>
        </div>

        <div className={cn('w-px', 'h-4', 'bg-zinc-200')} />

        <div className={cn('flex', 'items-center', 'gap-1')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn('h-8', 'w-8', 'rounded-full')}
            title="Copy as text"
          >
            {isCopied ? (
              <Check size={14} className="text-emerald-500" />
            ) : (
              <Copy size={14} className="text-zinc-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.print()}
            className={cn('h-8', 'w-8', 'rounded-full')}
            title="Print"
          >
            <Printer size={14} className="text-zinc-400" />
          </Button>

          {isMounted && (
            <PDFDownloadLink
              document={<ATSMinimalistPDF data={data} />}
              fileName={`${data.metadata.name || "resume"}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('h-8', 'w-8', 'rounded-full')}
                  title={loading ? "Generating PDF..." : "Download PDF"}
                  disabled={loading}
                >
                  <Download size={14} className={cn(loading ? "animate-pulse text-zinc-300" : "text-zinc-400")} />
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <div className={cn('w-full', 'relative', 'flex', 'justify-center')}>
        <div
          id="resume-preview"
          className={cn(
            "transform-gpu origin-top transition-all duration-700 h-fit shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] bg-white",
            "scale-[0.4] sm:scale-[0.55] md:scale-[0.75] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-[1]",
            previewMode === "plain"
              ? "p-16 w-[210mm] min-h-[296mm] shadow-none rounded-none text-left"
              : "",
          )}
        >
          {previewMode === "plain" ? (
            <pre className={cn('whitespace-pre-wrap', 'font-mono', 'text-xs', 'text-zinc-600', 'leading-relaxed', 'font-medium')}>
              {renderPlainText()}
            </pre>
          ) : (
            <div className="bg-white">
              {activeLayout === "minimalist" && <ATSMinimalist data={data} />}
              {activeLayout === "professional" && (
                <ModernProfessional data={data} />
              )}
              {activeLayout === "international" && (
                <InternationalFormat data={data} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
