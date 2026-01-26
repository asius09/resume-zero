"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";
import type {
  ResumeData,
  Contact,
  ExperienceItem,
  SkillGroup,
  EducationItem,
  ProjectItem,
  LanguageItem,
  CertificationItem,
  CustomBlock,
} from "@resume/types";

// --- Helpers ---
function formatContactLink(contact: Contact): string {
  switch (contact.type) {
    case "email": return `mailto:${contact.value}`;
    case "phone": return `tel:${contact.value.replace(/\s+/g, "")}`;
    default: return contact.value.startsWith("http") ? contact.value : `https://${contact.value}`;
  }
}

function displayContactValue(contact: Contact): string {
  return contact.value
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");
}

const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4 mb-4 mt-8 first:mt-0">
    <h2 className="text-[12pt] font-extrabold uppercase tracking-tight text-zinc-900 shrink-0">
      {title}
    </h2>
    <div className="h-px w-full bg-zinc-200" />
  </div>
);

// --- 1-Column Modern Professional (Executive / High-Income Format) ---
export const ModernProfessional = forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => {
    const renderBlock = (block: any, idx: number) => {
      switch (block.type) {
        case "header":
          return (
            <div key={idx} className="mb-10">
              <h1 className="text-[24pt] font-black text-zinc-900 tracking-tight mb-3 uppercase">
                {block.data.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-500 font-medium text-[9.5pt]">
                {block.data.location && (
                  <span className="text-zinc-900">{block.data.location}</span>
                )}
                {(block.data.contacts as Contact[]).map((c, i) => (
                  <React.Fragment key={i}>
                    <span className="opacity-30 select-none">•</span>
                    <a href={formatContactLink(c)} className="hover:text-zinc-900 transition-colors underline decoration-zinc-100 underline-offset-4">
                      {displayContactValue(c)}
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );

        case "summary":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title="Executive Summary" />
              <p className="text-[10pt] leading-relaxed text-zinc-800 text-justify font-medium">
                {block.data as string}
              </p>
            </div>
          );

        case "skills":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title="Core Strengths" />
              <div className="grid grid-cols-1 gap-2">
                {(block.data as SkillGroup[]).map((group, i) => (
                  <div key={i} className="text-[9.5pt] text-zinc-800">
                    <span className="font-bold text-zinc-900 uppercase tracking-tight text-[8.5pt]">{group.category}:</span> {group.skills.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          );

        case "experience":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title="Professional Experience" />
              <div className="space-y-6">
                {(block.data as ExperienceItem[]).map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[11pt] font-bold text-zinc-950">{item.jobTitle} | {item.companyName}</h3>
                      <span className="text-[9.5pt] font-bold text-zinc-400 tabular-nums">
                        {item.startDate} – {item.endDate || "Present"}
                      </span>
                    </div>
                    {item.location && (
                       <p className="text-[9pt] text-zinc-400 font-bold uppercase tracking-widest mb-3">
                         {item.location}
                       </p>
                    )}
                    <ul className="space-y-1.5 ml-4">
                      {item.bullets.map((bullet, b) => (
                        <li key={b} className="list-disc text-[9.5pt] text-zinc-800 leading-normal pl-1">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );

        case "projects":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title="Major Projects" />
              <div className="space-y-6">
                {(block.data as ProjectItem[]).map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[11pt] font-bold text-zinc-900 uppercase tracking-tight">{item.name}</h3>
                      <span className="text-[9.5pt] font-bold text-zinc-400 tabular-nums">{item.dates}</span>
                    </div>
                    {item.description && (
                      <p className="text-[10pt] text-zinc-600 mb-2 font-medium italic">{item.description}</p>
                    )}
                    <ul className="space-y-1 ml-4">
                      {item.bullets.map((bullet, b) => (
                        <li key={b} className="list-disc text-[9.5pt] text-zinc-800 leading-normal pl-1">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );

        case "education":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title="Education" />
              <div className="space-y-5">
                {(block.data as EducationItem[]).map((edu, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[11pt] font-bold text-zinc-900 uppercase tracking-tight">{edu.degree}</h3>
                      <p className="text-[10pt] text-zinc-500 font-bold mt-1 uppercase tracking-wide">
                        {edu.institution}
                      </p>
                      {edu.gpa && <span className="text-[9pt] text-zinc-400 font-medium italic mt-1 block">GPA: {edu.gpa}</span>}
                    </div>
                    <span className="text-[10pt] font-bold text-zinc-400 tabular-nums uppercase">
                      {edu.graduationYear}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "certifications":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title="Certifications" />
              <div className="space-y-2">
                {(block.data as CertificationItem[]).map((cert, i) => (
                  <div key={i} className="text-[10pt] text-zinc-800 flex justify-between">
                    <span>
                      <span className="font-bold text-zinc-900 uppercase tracking-tight">{cert.name}</span> | {cert.issuer}
                    </span>
                    <span className="font-bold text-zinc-400">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "custom":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title={(block.data as CustomBlock).title} />
              <div className="text-[10pt] text-zinc-800 whitespace-pre-wrap leading-relaxed font-medium">
                {(block.data as CustomBlock).content}
              </div>
            </div>
          );

        case "languages":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title="Languages" />
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10pt] text-zinc-700">
                {(block.data as LanguageItem[]).map((lang, l) => (
                  <div key={l}>
                    <span className="font-bold text-zinc-900 uppercase tracking-tight italic">{lang.language}</span> 
                    <span className="text-zinc-400 font-bold uppercase text-[8pt] ml-2 tracking-widest">({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "personal":
          return (
            <div key={idx} className="mb-8">
              <SectionTitle title="Personal Details" />
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[9.5pt]">
                {(block.data as any[]).map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-zinc-50 pb-1">
                    <span className="font-bold text-zinc-400 uppercase tracking-tighter text-[8pt]">{item.label}</span>
                    <span className="text-zinc-700 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        default: return null;
      }
    };

    return (
      <div
        ref={ref}
        className="resume-container w-[210mm] min-h-[297mm] mx-auto bg-white text-zinc-900 shadow-xl relative"
        style={{
          padding: "20mm 20mm",
          boxSizing: "border-box",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {data.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }
);

ModernProfessional.displayName = "ModernProfessional";
