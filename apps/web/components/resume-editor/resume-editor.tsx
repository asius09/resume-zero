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
import { cn } from "@/lib/cn";
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
  const mandatory = ["header", "summary", 'mb-12', 'pb-32']

  const onRemoveBlock = (index: number) => {
    const blockType = data.blocks[index].type;
    removeBlock(index);
    toast({
      title: "Section removed",
      description: `Removed the ${blockType} section. You can re-add it from the toolbar above.`,
      variant: "destructive",
    });
  };

  return (
    <div className={cn('max-w-[720px]', 'mx-auto', 'pb-48 sm:pb-32', 'space-y-12')}>
      <div className={cn('flex', 'flex-col', 'gap-6', 'sticky', 'top-0', 'bg-white/95', 'backdrop-blur-xl', 'z-20', 'border-b', 'border-zinc-100', 'px-8 py-4')}>
        <div>
          <h2 className={cn('text-lg', 'font-semibold', 'tracking-tight', 'text-zinc-900', 'uppercase')}>
            Editor
          </h2>
        </div>
        <div className={cn('flex', 'flex-nowrap', 'overflow-x-auto', 'gap-2', 'pb-2', 'custom-scrollbar', 'scroll-smooth')}>
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
              onClick={() => addBlock(type)}
              className={cn('rounded-full', 'h-8', 'px-4', 'text-[10px]', 'whitespace-nowrap', 'bg-white', 'border-zinc-200', 'hover:bg-zinc-50', 'text-zinc-600', 'font-semibold', 'uppercase', 'tracking-wider')}
            >
              <Plus size={12} className="mr-1.5" />{" "}
              {type === "personal"
                ? "Personal"
                : type}
            </Button>
          ))}
        </div>
      </div>

      <div className={cn("space-y-8 px-6 lg:px-8 xl:px-10")}>
        {data.blocks.map((block, bIdx) => {
          const isMandatory = mandatory.includes(block.type);

          return (
            <SectionWrapper
              key={bIdx}
              type={block.type}
              isMandatory={isMandatory}
              onCopy={() => handleCopySection(bIdx)}
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
