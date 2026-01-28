"use client";

import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { cn } from "@/lib/cn";
import { useResumeData } from "@/hooks/use-resume-data";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Header } from "@/components/layout/header";
import { ResumeEditor } from "@/components/resume-editor/resume-editor";
import { ResumePreview } from "@/components/resume-editor/resume-preview";
import { handleCopySection } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ResumeCleanerPage() {
  const { toast } = useToast();
  const {
    data,
    resumes,
    activeId,
    isSaving,
    isMounted,
    updateBlock,
    addBlock,
    removeBlock,
    setResumeName,
    setTheme,
    createNewVersion,
    selectVersion,
    deleteVersion,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResumeData();

  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: data.metadata.name || "My Resume",
    onAfterPrint: () => {
      toast({
        title: "Export Success",
        description: "Your resume is saved and ready.",
        variant: "success",
      });
    },
    onPrintError: (errorLocation, error) => {
      console.error("Print error:", errorLocation, error);
      toast({
        title: "Export Failed",
        description: "Something went wrong during PDF generation.",
        variant: "destructive",
      });
    },
  });

  const handleExportPDF = () => {
    if (componentRef.current) {
      toast({
        title: "Generating PDF",
        description: "Preparing your resume for export...",
        variant: "info",
      });
      handlePrint();
    }
  };

  const handleUndo = () => {
    if (undo()) {
      toast({
        title: "Undo Action",
        description: "Reverted to previous state.",
        variant: "default",
      });
    }
  };

  const handleRedo = () => {
    if (redo()) {
      toast({
        title: "Redo Action",
        description: "Restored the change.",
        variant: "default",
      });
    }
  };

  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onExport: handleExportPDF,
  });

  if (!isMounted) return null;

  return (
    <div className={cn("min-h-screen", "bg-white flex flex-col")}>
      <Header
        resumeName={data.metadata.name || ""}
        onResumeNameChange={setResumeName}
        activeLayout={
          data.metadata.theme as "minimalist" | "professional" | "international" | "executive"
        }
        onLayoutChange={setTheme}
        onExportPDF={handleExportPDF}
        resumes={resumes}
        activeId={activeId}
        onSelectVersion={selectVersion}
        onCreateNewVersion={createNewVersion}
        onDeleteVersion={deleteVersion}
        isSaving={isSaving}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <main
        className={cn(
          "flex-1 grid grid-cols-1 lg:grid-cols-2 lg:overflow-hidden",
        )}
      >
        {/* Mobile View Toggle */}
        <div
          className={cn(
            "lg:hidden",
            "fixed",
            "bottom-10",
            "left-1/2",
            "-translate-x-1/2",
            "z-50",
            "bg-zinc-900/95",
            "backdrop-blur-xl",
            "text-white",
            "rounded-full",
            "p-1",
            "shadow-2xl",
            "flex",
            "items-center",
            "border",
            "border-white/20",
          )}
        >
          <button
            onClick={() => setMobileView("edit")}
            className={cn(
              "px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
              mobileView === "edit" ? "bg-white text-black shadow-lg" : "text-white/60",
            )}
          >
            Edit
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={cn(
              "px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
              mobileView === "preview" ? "bg-white text-black shadow-lg" : "text-white/60",
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
            "bg-white border-r border-zinc-200",
            "lg:overflow-y-auto lg:h-[calc(100vh-80px)] custom-scrollbar relative z-10",
          )}
        >
          <div className="max-w-4xl mx-auto">
            <ResumeEditor
              data={data}
              updateBlock={updateBlock}
              addBlock={addBlock}
              removeBlock={removeBlock}
              handleCopySection={(index) => handleCopySection(data, index)}
            />
          </div>
        </div>

        {/* Preview Side */}
        <div
          className={cn(
            "preview-container transition-all duration-300",
            "bg-[#f4f4f5] lg:overflow-y-auto lg:h-[calc(100vh-80px)] custom-scrollbar flex justify-center pt-8 pb-32",
            mobileView === "preview" ? "block" : "hidden lg:block",
          )}
        >
          <ResumePreview
            ref={componentRef}
            data={data}
            activeLayout={
              data.metadata.theme as "minimalist" | "professional" | "international" | "executive"
            }
          />
        </div>
      </main>
    </div>
  );
}
