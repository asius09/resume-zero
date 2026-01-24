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
      <div className={cn("w-full", "relative", "flex", "justify-center", "bg-zinc-50/50", "py-20", "min-h-screen")}>
        <div
          id="resume-preview"
          className={cn(
            "transform-gpu origin-top transition-all duration-700 h-fit shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]",
            " sm:scale-[0.75] 2xl:scale-[1]",
          )}
        >
          {activeLayout === "minimalist" && <ATSMinimalist data={data} ref={ref} />}
          {activeLayout === "professional" && (
            <ModernProfessional data={data} ref={ref} />
          )}
          {activeLayout === "international" && (
            <InternationalFormat data={data} ref={ref} />
          )}
        </div>
      </div>
    );
  },
);

ResumePreview.displayName = "ResumePreview";

