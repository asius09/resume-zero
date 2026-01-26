"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";
import {
  ATSMinimalist,
  ModernProfessional,
  InternationalFormat,
  ExecutiveSerif,
} from "@resume/ui";
import type { ResumeData } from "@resume/types";

interface ResumePreviewProps {
  data: ResumeData;
  activeLayout: "minimalist" | "professional" | "international" | "executive";
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, activeLayout }, ref) => {
    const [numPages, setNumPages] = React.useState(1);

    React.useEffect(() => {
      const el = document.getElementById("resume-canvas");
      if (!el) return;

      const observer = new ResizeObserver(() => {
        const heightPx = el.getBoundingClientRect().height;
        const pageHeightPx = 297 * 3.7795275591; // mm to px approx
        const calculatedPages = Math.max(1, Math.ceil(heightPx / pageHeightPx));
        setNumPages(calculatedPages);
      });

      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <div className={cn(
        "w-full relative flex flex-col items-center bg-zinc-100/50",
        "py-4 md:py-12 px-0 md:px-4 overflow-x-hidden select-none"
      )}>
        {/* Absolute Scaling Engine */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --actual-a4-w: 210mm;
            --actual-a4-h: 297mm;
            --view-padding: 32px;
            --viewport-w: calc(100vw - var(--view-padding));
          }
          @media (min-width: 1024px) {
            :root {
              --viewport-w: calc(50vw - 100px); 
            }
          }
          .scaling-layer {
            --scale-factor: min(1, calc(var(--viewport-w) / var(--actual-a4-w)));
            transform: scale(var(--scale-factor));
            transform-origin: top center;
            width: var(--actual-a4-w);
          }
          .centering-box {
            width: calc(var(--actual-a4-w) * var(--scale-factor));
          }
          @media print {
            .centering-box { width: 210mm !important; }
            .scaling-layer { 
              transform: none !important; 
              width: 210mm !important;
            }
          }
        `}} />

        <div className="centering-box">
          <div className="scaling-layer relative transition-all duration-200">
            {/* The Document Sheet */}
            <div className={cn(
              "bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)]",
              "relative min-h-[297mm]"
            )}>
              {/* Layout Injection */}
              <div id="resume-canvas" className="contents">
                {activeLayout === "minimalist" && <ATSMinimalist data={data} ref={ref} />}
                {activeLayout === "professional" && <ModernProfessional data={data} ref={ref} />}
                {activeLayout === "international" && <InternationalFormat data={data} ref={ref} />}
                {activeLayout === "executive" && <ExecutiveSerif data={data} ref={ref} />}
              </div>

              {/* Precise Page Terminators */}
              <div className="absolute inset-0 pointer-events-none no-print">
                {Array.from({ length: Math.max(0, numPages - 1) }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <div 
                      key={p}
                      className="absolute w-full border-t border-dashed border-red-200"
                      style={{ top: `${p * 297}mm` }}
                    >
                      <div className="absolute right-0 -translate-y-full px-2 py-0.5 bg-white text-red-400/60 text-[8px] font-semibold uppercase tracking-widest">
                          Page {p} Cut
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Padding for Scaled View */}
            <div className="h-20" />
          </div>
        </div>
      </div>
    );
  },
);

ResumePreview.displayName = "ResumePreview";
