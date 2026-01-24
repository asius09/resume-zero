"use client";

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

export function ResumePreview({
  data,
  activeLayout,
}: ResumePreviewProps) {
  return (
      <div className={cn('w-full', 'relative', 'flex', 'justify-center')}>
        <div
          id="resume-preview"
          className={cn(
            "transform-gpu origin-top transition-all duration-700 h-fit shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]",
            " sm:scale-[0.75] 2xl:scale-[1]",
          )}
        >
        
              {activeLayout === "minimalist" && <ATSMinimalist data={data} />}
              {activeLayout === "professional" && (
                <ModernProfessional data={data} />
              )}
              {activeLayout === "international" && (
                <InternationalFormat data={data} />
              )}
        </div>
      </div>
  );
}
