"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useResumeData } from "@/hooks/use-resume-data";
import { Header } from "@/components/layout/header";
import { ResumeEditor } from "@/components/resume-editor/resume-editor";
import { ResumePreview } from "@/components/resume-editor/resume-preview";
import { handleCopySection } from "@/lib/utils";

export default function ResumeCleanerPage() {
  const {
    data,
    isMounted,
    updateBlock,
    addBlock,
    removeBlock,
    setResumeName,
    setTheme,
  } = useResumeData();

  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  const handleExportPDF = () => {
    const originalTitle = document.title;
    document.title = data.metadata.name || "My Resume";
    window.print();
    document.title = originalTitle;
  };

  if (!isMounted) return null;

  return (
    <div className={cn('min-h-screen', 'bg-white')}>
      <Header
        resumeName={data.metadata.name || ""}
        onResumeNameChange={setResumeName}
        activeLayout={
          data.metadata.theme as "minimalist" | "professional" | "international"
        }
        onLayoutChange={setTheme}
        onExportPDF={handleExportPDF}
      />

      <main className={cn('grid', 'grid-cols-1', 'lg:grid-cols-2', 'min-h-[calc(100vh-80px)]')}>
        {/* Mobile View Toggle */}
        <div className={cn('lg:hidden', 'fixed', 'bottom-10', 'left-1/2', '-translate-x-1/2', 'z-50', 'bg-zinc-900/90', 'backdrop-blur-md', 'text-white', 'rounded-full', 'p-1.5', 'shadow-2xl', 'flex', 'items-center', 'border', 'border-white/10')}>
          <button
            onClick={() => setMobileView("edit")}
            className={cn(
              "px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
              mobileView === "edit" ? "bg-white text-black" : "text-white/60",
            )}
          >
            Edit
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={cn(
              "px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
              mobileView === "preview"
                ? "bg-white text-black"
                : "text-white/60",
            )}
          >
            Preview
          </button>
        </div>

        {/* Editor Side */}
        <div
          className={cn(
            "editor-side no-print transition-all duration-300",
            mobileView === "edit" ? "block" : "hidden lg:block",
            "bg-[#fafafa]/50 border-r border-zinc-100",
            "overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar",
          )}
        >
          <ResumeEditor
            data={data}
            updateBlock={updateBlock}
            addBlock={addBlock}
            removeBlock={removeBlock}
            handleCopySection={(index) => handleCopySection(data, index)}
          />
        </div>

        {/* Preview Side */}
        <div
          className={cn(
            "preview-container",
            "bg-zinc-100/30 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar flex justify-center pt-4 lg:pt-8",
            mobileView === "preview" ? "block" : "hidden lg:block",
          )}
        >
          <ResumePreview
            data={data}
            activeLayout={
              data.metadata.theme as
                | "minimalist"
                | "professional"
                  | "international"
              }
            />
        </div>
      </main>
    </div>
  );
}
