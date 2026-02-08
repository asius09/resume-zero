"use client";

import React from "react";
import { Plus } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";
import { HeaderEditor } from "./header-editor";
import { SummaryEditor } from "./summary-editor";
import { ExperienceEditor } from "./experience-editor";
import { ProjectsEditor } from "./projects-editor";
import { SkillsEditor } from "./skills-editor";
import { EducationEditor } from "./education-editor";
import { LanguagesEditor } from "./languages-editor";
import { CertificationsEditor } from "./certifications-editor";
import { PersonalEditor } from "./personal-editor";
import { CustomEditor } from "./custom-editor";
import { Button } from "@/components/ui/button";
import type {
  ResumeData,
  ResumeSectionType,
  ResumeBlock,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  EducationItem,
  LanguageItem,
  CertificationItem,
  PersonalDetailItem,
  CustomBlock,
} from "@resume/types";
import { useToast } from "@/hooks/use-toast";
import { MANDATORY_SECTIONS } from "@/lib/constants";
import { 
  safeGetBlock, 
  capitalizeSectionName,
  isValidArray 
} from "@/lib/validation";

interface ResumeEditorProps {
  data: ResumeData;
  updateBlock: (index: number, newData: ResumeBlock["data"]) => void;
  addBlock: (type: ResumeSectionType) => void;
  removeBlock: (index: number) => void;
  handleCopySection: (index: number) => void;
}

export function ResumeEditor({
  data,
  updateBlock,
  addBlock,
  removeBlock,
  handleCopySection,
}: ResumeEditorProps) {
  const { toast } = useToast();

  const onRemoveBlock = (index: number) => {
    try {
      // Validate index bounds
      if (!data?.blocks || index < 0 || index >= data.blocks.length) {
        toast({
          title: "Error",
          description: "Invalid section index. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      const block = safeGetBlock(data.blocks, index);
      if (!block) {
        toast({
          title: "Error",
          description: "Section not found.",
          variant: "destructive",
        });
        return;
      }

      const sectionName = capitalizeSectionName(block.type);
      
      removeBlock(index);
      toast({
        title: `${sectionName} Removed`,
        description: `The ${block.type} section has been removed from your resume.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error removing block:", error);
      toast({
        title: "Error",
        description: "Failed to remove section. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onAddBlock = (type: ResumeSectionType) => {
    try {
      const sectionName = capitalizeSectionName(type);
      addBlock(type);
      toast({
        title: `${sectionName} Added`,
        description: `A new ${type} section is now ready for editing.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding block:", error);
      toast({
        title: "Error",
        description: "Failed to add section. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onCopySection = (index: number) => {
    try {
      // Validate index bounds
      if (!data?.blocks || index < 0 || index >= data.blocks.length) {
        toast({
          title: "Error",
          description: "Invalid section index.",
          variant: "destructive",
        });
        return;
      }

      const block = safeGetBlock(data.blocks, index);
      if (!block) {
        toast({
          title: "Error",
          description: "Section not found.",
          variant: "destructive",
        });
        return;
      }

      const sectionName = capitalizeSectionName(block.type);
      
      handleCopySection(index);
      toast({
        title: `${sectionName} Copied`,
        description: "Section content is now in your clipboard.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error copying section:", error);
      toast({
        title: "Error",
        description: "Failed to copy section. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Validate data structure
  if (!data || !isValidArray(data.blocks)) {
    return (
      <div className="max-w-[720px] mx-auto pb-48 sm:pb-32 p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-sm text-yellow-800 font-medium">
            Invalid resume data. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto pb-48 sm:pb-32 space-y-12">
      <div className="flex flex-col gap-6 sticky top-0 bg-white/95 backdrop-blur-xl z-20 border-b border-zinc-100 px-8 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 uppercase">
            Editor
          </h2>
        </div>
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 custom-scrollbar scroll-smooth">
          {(
            [
              "experience",
              "skills",
              "education",
              "projects",
              "languages",
              "certifications",
              "personal",
              "custom",
            ] as const
          ).map((type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => onAddBlock(type)}
              className="rounded-full h-8 px-4 text-[10px] whitespace-nowrap bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-semibold uppercase tracking-wider"
            >
              <Plus size={12} className="mr-1.5" />{" "}
              {type === "personal"
                ? "Personal"
                : type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-8 px-6 lg:px-8 xl:px-10">
        {data.blocks.map((block, bIdx) => {
          const isMandatory = MANDATORY_SECTIONS.includes(block.type as typeof MANDATORY_SECTIONS[number]);

          return (
            <SectionWrapper
              key={bIdx}
              type={block.type}
              isMandatory={isMandatory}
              onCopy={() => onCopySection(bIdx)}
              onRemove={() => onRemoveBlock(bIdx)}
            >
              {block.type === "header" && (
                <HeaderEditor
                  data={block.data}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "summary" && (
                <SummaryEditor
                  data={block.data as string}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "experience" && (
                <ExperienceEditor
                  data={block.data as ExperienceItem[]}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "projects" && (
                <ProjectsEditor
                  data={block.data as ProjectItem[]}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "skills" && (
                <SkillsEditor
                  data={block.data as SkillGroup[]}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "education" && (
                <EducationEditor
                  data={block.data as EducationItem[]}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "languages" && (
                <LanguagesEditor
                  data={block.data as LanguageItem[]}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "certifications" && (
                <CertificationsEditor
                  data={block.data as CertificationItem[]}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "personal" && (
                <PersonalEditor
                  data={block.data as PersonalDetailItem[]}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
              {block.type === "custom" && (
                <CustomEditor
                  data={block.data as CustomBlock}
                  onUpdate={(newData) => updateBlock(bIdx, newData)}
                />
              )}
            </SectionWrapper>
          );
        })}
      </div>
    </div>
  );
}
