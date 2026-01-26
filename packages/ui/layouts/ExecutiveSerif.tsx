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
  <div className="mt-8 mb-4 border-b border-zinc-950 pb-1 first:mt-0">
    <h2 className="text-[11pt] font-black uppercase tracking-[0.25em] text-zinc-950">
      {title}
    </h2>
  </div>
);

// --- 1-Column Executive Serif Layout ---
export const ExecutiveSerif = forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => {
    const renderBlock = (block: any, idx: number) => {
      switch (block.type) {
        case "header":
          return (
            <div key={idx} className="mb-12 flex flex-col items-center text-center">
              <h1 className="text-[22pt] font-bold uppercase tracking-[0.15em] text-zinc-950 mb-3">
                {block.data.fullName}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-[10pt] text-zinc-600 font-medium italic">
                {block.data.location && <span>{block.data.location}</span>}
                {(block.data.contacts as Contact[]).map((c, i) => (
                  <React.Fragment key={i}>
                    {(block.data.location || i > 0) && <span className="opacity-30 select-none not-italic">|</span>}
                    <a href={formatContactLink(c)} className="hover:text-zinc-950 transition-colors underline decoration-zinc-100 underline-offset-4">
                      {displayContactValue(c)}
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );

        case "summary":
          return (
            <div key={idx} className="mb-10">
              <SectionTitle title="Executive Summary" />
              <p className="text-[10.5pt] leading-relaxed text-zinc-800 text-justify">
                {block.data as string}
              </p>
            </div>
          );

        case "experience":
          return (
            <div key={idx} className="mb-10">
              <SectionTitle title="Professional Experience" />
              <div className="space-y-8">
                {(block.data as ExperienceItem[]).map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[11pt] font-bold text-zinc-950 uppercase tracking-tight">{item.jobTitle}</h3>
                      <span className="text-[10pt] font-bold text-zinc-950 tabular-nums">
                        {item.startDate} – {item.endDate || "Present"}
                      </span>
                    </div>
                    <div className="text-[10.5pt] font-bold italic text-zinc-500 mb-3">
                      {item.companyName} {item.location && <span className="mx-1 opacity-50 not-italic">•</span>} {item.location}
                    </div>
                    <ul className="space-y-2 ml-5">
                      {item.bullets.map((bullet, b) => (
                        <li key={b} className="list-disc text-[10.5pt] text-zinc-800 leading-relaxed pl-1">
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
            <div key={idx} className="mb-10">
              <SectionTitle title="Selected Projects" />
              <div className="space-y-8">
                {(block.data as ProjectItem[]).map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[11pt] font-bold text-zinc-950 uppercase tracking-tight">{proj.name}</h3>
                      <span className="text-[10pt] font-bold text-zinc-950 tabular-nums">{proj.dates}</span>
                    </div>
                    {proj.description && (
                      <p className="text-[10pt] italic text-zinc-500 mb-2 leading-relaxed">{proj.description}</p>
                    )}
                    <ul className="space-y-1.5 ml-5">
                      {proj.bullets.map((bullet, b) => (
                        <li key={b} className="list-disc text-[10pt] text-zinc-800 leading-relaxed pl-1">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );

        case "skills":
          return (
            <div key={idx} className="mb-10">
              <SectionTitle title="Core Strengths" />
              <div className="space-y-2">
                {(block.data as SkillGroup[]).map((group, i) => (
                  <div key={i} className="text-[10.5pt] leading-relaxed text-zinc-800">
                    <span className="font-bold uppercase tracking-widest text-[9pt] text-zinc-950 w-32 inline-block">{group.category}:</span>{" "}
                    <span className="text-zinc-700">{group.skills.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "education":
          return (
            <div key={idx} className="mb-10">
              <SectionTitle title="Academic Background" />
              <div className="space-y-6">
                {(block.data as EducationItem[]).map((edu, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="text-[11pt]">
                      <h3 className="font-bold text-zinc-950 uppercase tracking-tight">{edu.degree}</h3>
                      <p className="text-zinc-500 italic font-bold mt-1 uppercase tracking-wide text-[10pt]">{edu.institution}</p>
                      {edu.gpa && <p className="text-[9pt] text-zinc-400 mt-1">Grade Point Average: {edu.gpa}</p>}
                    </div>
                    <span className="text-[10pt] font-bold text-zinc-950 tabular-nums uppercase">{edu.graduationYear}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "languages":
          return (
            <div key={idx} className="mb-10">
              <SectionTitle title="Languages" />
              <div className="flex flex-wrap gap-x-10 gap-y-2 text-[10.5pt] text-zinc-800">
                {(block.data as LanguageItem[]).map((lang, l) => (
                  <div key={l} className="flex flex-col">
                    <span className="font-bold uppercase tracking-tight italic text-zinc-950">{lang.language}</span>
                    <span className="text-zinc-400 uppercase tracking-widest text-[8pt] font-bold">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "certifications":
          return (
            <div key={idx} className="mb-10">
              <SectionTitle title="Certifications" />
              <div className="space-y-3">
                {(block.data as CertificationItem[]).map((cert, i) => (
                  <div key={i} className="text-[10.5pt] text-zinc-800 flex justify-between items-center bg-zinc-50/50 p-2 border-l-2 border-zinc-200">
                    <div>
                      <span className="font-bold text-zinc-950 uppercase tracking-tight">{cert.name}</span>
                      <span className="text-zinc-400 block text-[9pt] uppercase tracking-wide font-bold mt-0.5">{cert.issuer}</span>
                    </div>
                    <span className="text-zinc-500 font-bold tabular-nums text-[10pt]">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "personal":
          return (
            <div key={idx} className="mb-10">
              <SectionTitle title="Personal Details" />
              <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[10.5pt] text-zinc-800">
                {(block.data as any[]).map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-zinc-50 pb-1">
                    <span className="font-bold uppercase tracking-[0.2em] text-[8pt] text-zinc-400 w-32 shrink-0">{item.label}</span>
                    <span className="text-zinc-950 font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "custom":
          return (
            <div key={idx} className="mb-10">
              <SectionTitle title={(block.data as CustomBlock).title} />
              <div className="text-[10.5pt] leading-relaxed text-zinc-800 whitespace-pre-wrap">
                {(block.data as CustomBlock).content}
              </div>
            </div>
          );

        default: return null;
      }
    };

    return (
      <div
        ref={ref}
        className="resume-container w-[210mm] min-h-[297mm] mx-auto bg-white text-zinc-950 shadow-2xl relative"
        style={{
          padding: "20mm 20mm",
          boxSizing: "border-box",
          fontFamily: "'Times New Roman', Times, serif", // Classic Executive Serif
        }}
      >
        {data.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }
);

ExecutiveSerif.displayName = "ExecutiveSerif";
