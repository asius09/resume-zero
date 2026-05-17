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
import { ErrorBoundary } from "@/components/error-boundary";
import type { ResumeData } from "@resume/types";
import { extractTextFromPDF, parseResumeTextToData } from "@/lib/pdf-parser";
import { INITIAL_DATA } from "@/lib/constants";

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
    importResume,
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

  const handleExportJSON = () => {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.metadata.name || "resume"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Success",
        description: "Resume data exported as JSON.",
        variant: "success",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export resume data.",
        variant: "destructive",
      });
    }
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let importedData: ResumeData;

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Handle PDF import
        toast({
          title: "Processing PDF",
          description: "Extracting data from PDF...",
          variant: "info",
        });

        const text = await extractTextFromPDF(file);
        const parsedData = parseResumeTextToData(text);
        
        importedData = {
          ...INITIAL_DATA,
          ...parsedData,
          id: crypto.randomUUID(),
          metadata: {
            ...INITIAL_DATA.metadata,
            ...parsedData.metadata,
            name: file.name.replace('.pdf', ''),
            lastModified: new Date().toISOString(),
          },
        } as ResumeData;
      } else {
        // Handle JSON import
        const reader = new FileReader();
        const data = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });

        const jsonData = JSON.parse(data);
        
        // Validate basic structure
        if (!jsonData.blocks || !Array.isArray(jsonData.blocks)) {
          throw new Error("Invalid resume data structure");
        }

        importedData = {
          ...jsonData,
          id: crypto.randomUUID(),
          metadata: {
            ...jsonData.metadata,
            name: jsonData.metadata?.name || "Imported Resume",
            lastModified: new Date().toISOString(),
          },
        } as ResumeData;
      }

      importResume(importedData);
      
      toast({
        title: "Import Success",
        description: "Resume data imported successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import file. Please check the file format.",
        variant: "destructive",
      });
    }
    
    // Reset input
    event.target.value = "";
  };

  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onExport: handleExportPDF,
  });

  if (!isMounted) return null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white flex flex-col">
        <Header
          resumeName={data.metadata.name || ""}
          onResumeNameChange={setResumeName}
          activeLayout={
            data.metadata.theme as "minimalist" | "professional" | "international" | "executive"
          }
          onLayoutChange={setTheme}
          onExportPDF={handleExportPDF}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
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

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 lg:overflow-hidden">
          {/* Mobile View Toggle */}
          <div className="lg:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 backdrop-blur-xl text-white rounded-full p-1 shadow-2xl flex items-center border border-white/20">
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
              "editor-side no-print transition-all duration-300 bg-white border-r border-zinc-200 lg:overflow-y-auto lg:h-[calc(100vh-80px)] custom-scrollbar relative z-10",
              mobileView === "edit" ? "block" : "hidden lg:block"
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
              "preview-container transition-all duration-300 bg-[#f4f4f5] lg:overflow-y-auto lg:h-[calc(100vh-80px)] custom-scrollbar flex justify-center pt-8 pb-32",
              mobileView === "preview" ? "block" : "hidden lg:block"
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
    </ErrorBoundary>
  );
}
