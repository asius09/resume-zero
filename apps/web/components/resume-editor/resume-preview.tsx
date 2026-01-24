"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";
import {
  ATSMinimalist,
  ModernProfessional,
  InternationalFormat,
} from "@resume/ui";
import type { ResumeData } from "@resume/types";

interface ResumePreviewProps {
  data: ResumeData;
  activeLayout: "minimalist" | "professional" | "international";
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, activeLayout }, ref) => {
    return (
      <div className={cn(
        "w-full relative flex flex-col items-center bg-[#121212] min-h-screen",
        "py-12 md:py-24 px-4 overflow-y-auto no-scrollbar select-none"
      )}>
        {/* Advanced Scaling Core */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --a4-width: 210mm;
            --a4-height: 297mm;
            --container-padding: 32px;
            --available-vw: calc(100vw - var(--container-padding));
          }
          @media (min-width: 1024px) {
            :root {
              --available-vw: calc(50vw - 80px); /* 50% screen minus editor gap */
            }
          }
          .paper-scaler {
            --scale: min(1, calc(var(--available-vw) / var(--a4-width)));
            transform: scale(var(--scale));
            transform-origin: top center;
            width: var(--a4-width);
          }
          .paper-wrapper {
            width: calc(var(--a4-width) * var(--scale));
            /* This effectively wraps the scaled content so the parent container knows its actual visible size */
          }
        `}} />

        <div className="paper-wrapper">
          <div className="paper-scaler relative transition-all duration-300 ease-in-out">
            {/* The Actual A4 Sheet */}
            <div className={cn(
              "bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]",
              "relative min-h-[297mm] transition-all duration-500",
              "before:absolute before:inset-0 before:pointer-events-none before:shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]"
            )}>
              {/* Dynamic Content */}
              <div id="resume-content-root" className="contents">
                {activeLayout === "minimalist" && <ATSMinimalist data={data} ref={ref} />}
                {activeLayout === "professional" && <ModernProfessional data={data} ref={ref} />}
                {activeLayout === "international" && <InternationalFormat data={data} ref={ref} />}
              </div>

              {/* Physical Page Separators */}
              <div className="absolute inset-0 pointer-events-none no-print">
                {[1, 2, 3, 4].map((page) => (
                  <div 
                    key={page}
                    className="absolute w-full flex flex-col items-center"
                    style={{ top: `${page * 297}mm` }}
                  >
                    {/* Visual Cut Line */}
                    <div className="w-full border-t-[2px] border-dashed border-zinc-200" />
                    
                    {/* Page Label */}
                    <div className="absolute -translate-y-1/2 right-4 flex items-center gap-2">
                       <div className="bg-zinc-800 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xl border border-zinc-700 uppercase tracking-tighter">
                          Page {page} End
                       </div>
                    </div>

                    {/* Simulation of a gap (Dark workspace showing through) */}
                    <div className="w-full h-[15mm] bg-[#121212] opacity-20" />
                    <div className="w-full border-t-[2px] border-dashed border-zinc-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Scale-safe bottom padding */}
            <div className="h-40" />
          </div>
        </div>

        {/* Floating Page Counter (Mobile-optimized) */}
        <div className="fixed bottom-24 right-6 pointer-events-none flex flex-col items-end gap-2 sm:hidden">
           <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Format: A4 Portrait</span>
           </div>
        </div>
      </div>
    );
  },
);

ResumePreview.displayName = "ResumePreview";

