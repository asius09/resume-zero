"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";
import type {
  ResumeData,
  Contact,
  ExperienceItem,
  SkillGroup,
  EducationItem,
  LanguageItem,
  ProjectItem,
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
  <div className="mb-3 mt-8 first:mt-0 border-b border-zinc-200 pb-1">
    <h2 className="text-[11pt] font-bold uppercase tracking-tight text-zinc-950">
      {title}
    </h2>
  </div>
);

// --- 1-Column International Standard CV ---
export const InternationalFormat = forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => {
    const renderBlock = (block: any, idx: number) => {
      switch (block.type) {
        case "header":
          return (
            <div key={idx} className="mb-8 text-center">
              <h1 className="text-[18pt] font-bold text-zinc-950 uppercase tracking-tight mb-2">
                {block.data.fullName}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-zinc-600 text-[9pt]">
                {block.data.location && (
                  <>
                    <span>{block.data.location}</span>
                    <span className="text-zinc-300">|</span>
                  </>
                )}
                {(block.data.contacts as Contact[]).map((c, i) => (
                  <React.Fragment key={i}>
                    <a href={formatContactLink(c)} className="hover:text-zinc-950 transition-colors underline-offset-4 decoration-zinc-200">
                      {displayContactValue(c)}
                    </a>
                    {i < (block.data.contacts as Contact[]).length - 1 && (
                      <span className="text-zinc-300">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );

        case "summary":
          return (
            <div key={idx} className="mb-6">
              <SectionTitle title="Summary" />
              <p className="text-[10pt] leading-normal text-zinc-800 text-justify">
                {block.data as string}
              </p>
            </div>
          );

        case "experience":
          return (
            <div key={idx} className="mb-6">
              <SectionTitle title="Experience" />
              <div className="space-y-5">
                {(block.data as ExperienceItem[]).map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-0.5">
                       <h3 className="text-[10pt] font-bold text-zinc-950">{item.jobTitle} | {item.companyName}</h3>
                       <span className="text-[9.5pt] font-medium text-zinc-500 tabular-nums">
                        {item.startDate} – {item.endDate || "Present"}
                       </span>
                    </div>
                    <p className="text-[9.5pt] text-zinc-500 mb-2">
                      {item.location}
                    </p>
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

        case "projects":
          return (
            <div key={idx} className="mb-6">
              <SectionTitle title="Projects" />
              <div className="space-y-5">
                {(block.data as ProjectItem[]).map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-0.5">
                       <h3 className="text-[10pt] font-bold text-zinc-950">{item.name}</h3>
                       <span className="text-[9pt] font-medium text-zinc-500 tabular-nums">
                        {item.dates}
                       </span>
                    </div>
                    {item.link && (
                       <a href={item.link} className="text-[9pt] text-zinc-500 block mb-1 hover:underline">
                         Link: {item.link.replace(/^https?:\/\/(www\.)?/, "")}
                       </a>
                    )}
                    {item.description && (
                      <p className="text-[9.5pt] text-zinc-700 mb-1.5">{item.description}</p>
                    )}
                    <ul className="space-y-0.5 ml-4">
                      {item.bullets.map((bullet, b) => (
                        <li key={b} className="list-disc text-[9pt] text-zinc-800 leading-normal pl-1">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );

        case "skills":
          return (
            <div key={idx} className="mb-6">
              <SectionTitle title="Skills" />
              <div className="space-y-1">
                {(block.data as SkillGroup[]).map((group, i) => (
                  <div key={i} className="text-[9.5pt] text-zinc-800">
                    <span className="font-bold">{group.category}:</span> {group.skills.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          );

        case "education":
          return (
            <div key={idx} className="mb-6">
              <SectionTitle title="Education" />
              <div className="space-y-4">
                {(block.data as EducationItem[]).map((edu, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[10pt] font-bold text-zinc-950 uppercase">{edu.degree}</h3>
                      <p className="text-[9.5pt] text-zinc-600">{edu.institution} | {edu.graduationYear}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case "languages":
          return (
            <div key={idx} className="mb-6">
              <SectionTitle title="Languages" />
              <p className="text-[9.5pt] text-zinc-800">
                {(block.data as LanguageItem[]).map((lang, l) => (
                   <span key={l}>
                     <span className="font-bold">{lang.language}</span> ({lang.proficiency})
                     {l < (block.data as LanguageItem[]).length - 1 ? ", " : ""}
                   </span>
                ))}
              </p>
            </div>
          );

        case "certifications":
          return (
            <div key={idx} className="mb-6">
              <SectionTitle title="Certifications" />
              <div className="space-y-1">
                {(block.data as CertificationItem[]).map((cert, i) => (
                  <div key={i} className="text-[9.5pt] text-zinc-800">
                    <span className="font-bold">{cert.name}</span> | {cert.issuer} | {cert.year}
                  </div>
                ))}
              </div>
            </div>
          );

        case "custom":
          return (
            <div key={idx} className="mb-6">
              <SectionTitle title={(block.data as CustomBlock).title} />
              <p className="text-[9.5pt] leading-normal text-zinc-800 whitespace-pre-wrap">
                {(block.data as CustomBlock).content}
              </p>
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
          padding: "15mm 20mm",
          boxSizing: "border-box",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {data.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }
);

InternationalFormat.displayName = "InternationalFormat";
