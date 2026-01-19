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
  const mandatory = ["header", "summary", "experience", "skills", "education"];

  return (
    <div className="max-w-[700px] mx-auto space-y-6 pb-20">
      <div className="border-b border-zinc-200 pb-6 mb-2">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Editor
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Focus on your experience. We handle the rest.
          </p>
        </div>
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 custom-scrollbar-hide">
          {(
            [
              "languages",
              "projects",
              "certifications",
              "personal",
              "custom",
            ] as const
          ).map((type) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-100 rounded-lg text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 hover:border-zinc-200 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus size={12} />{" "}
              {type === "personal"
                ? "Personal Details"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {data.blocks.map((block, bIdx) => {
        const isMandatory = mandatory.includes(block.type);

        return (
          <SectionWrapper
            key={bIdx}
            type={block.type}
            isMandatory={isMandatory}
            onCopy={() => handleCopySection(bIdx)}
            onRemove={() => removeBlock(bIdx)}
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
  );
}
