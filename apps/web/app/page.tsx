"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { useResumeData } from "@/hooks/use-resume-data";
import { Header } from "@/components/layout/header";
import { ResumeEditor } from "@/components/resume-editor/resume-editor";
import { ResumePreview } from "@/components/resume-editor/resume-preview";
import { handleCopySection, renderPlainText } from "@/lib/utils";

export default function ResumeCleanerPage() {
  const {
    data,
    isMounted,
    updateBlock,
    addBlock,
    removeBlock,
    autoClean,
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
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 selection:text-black">
      <Header
        resumeName={data.metadata.name || ""}
        onResumeNameChange={setResumeName}
        activeLayout={data.metadata.theme as "minimalist" | "professional" | "international"}
        onLayoutChange={setTheme}
        onCleanAll={autoClean}
        onExportPDF={handleExportPDF}
      />

      <main
        className={clsx(
          "max-w-[1600px]",
          "mx-auto",
          "grid",
          "grid-cols-1",
          "lg:grid-cols-2",
          "gap-0",
          "min-h-[calc(100vh-80px)]",
          "relative",
        )}
      >
        {/* Mobile View Toggle */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-lg p-1 shadow-2xl flex items-center border border-white/10">
          <button
            onClick={() => setMobileView("edit")}
            className={clsx(
              "px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
              mobileView === "edit" ? "bg-white text-black" : "text-white/60",
            )}
          >
            Edit
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={clsx(
              "px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
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
          className={clsx(
            "no-print",
            "editor-side",
            "p-6",
            "lg:p-12",
            mobileView === "edit" ? "block" : "hidden lg:block",
            "bg-[#fafafa]",
            "border-r",
            "border-zinc-200",
            "overflow-y-auto",
            "max-h-[calc(100vh-80px)]",
            "custom-scrollbar",
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
          className={clsx(
            "preview-side",
            mobileView === "preview" ? "block" : "hidden lg:block",
          )}
        >
          <ResumePreview
            data={data}
            activeLayout={data.metadata.theme as "minimalist" | "professional" | "international"}
            renderPlainText={() => renderPlainText(data)}
          />
        </div>
      </main>
    </div>
  );
}
