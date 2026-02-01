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

// Compact, high-contrast section title
const SectionTitle = ({ title }: { title: string }) => (
  <div className={cn('border-b-[1.5px]', 'border-zinc-900', 'mb-3', 'mt-5', 'first:mt-0', 'pb-1')}>
    <h2 className={cn('text-[12px]', 'font-bold', 'uppercase', 'tracking-wider', 'text-zinc-900')}>
      {title}
    </h2>
  </div>
);

// --- 1-Column Modern Professional ---
// High contrast, tight spacing, clear hierarchy
export const ModernProfessional = forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => {
    const renderBlock = (block: any, idx: number) => {
      switch (block.type) {
        case "header":
          return (
            <div key={idx} className={cn('mb-8', 'text-center')}>
              <h1 className={cn( 'font-bold', 'text-zinc-900', 'uppercase', 'tracking-tight', 'mb-1')} style={{ fontSize: "14px" }}>
                {block.data.fullName}
              </h1>
              <div className={cn('flex', 'flex-wrap', 'justify-center', 'items-center', 'gap-x-3', 'text-zinc-900', 'font-medium')}>
                {block.data.location && (
                  <>
                    <span>{block.data.location}</span>
                    <span className={cn('text-zinc-900', 'mx-3')}>•</span>
                  </>
                )}
                {(block.data.contacts as Contact[]).map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && c.value && <span className={cn('text-zinc-900', 'mx-3')}>•</span>}
                    <a 
                      href={formatContactLink(c)} 
                      className={cn('hover:underline', 'text-zinc-900')}
                    >
                      {displayContactValue(c)}
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );

        case "summary":
          return (
            <div key={idx} className="mb-4">
              <SectionTitle title="Summary" />
              <p className={cn('text-[11px]', 'leading-relaxed', 'text-zinc-900', 'text-justify')}>
                {block.data as string}
              </p>
            </div>
          );

        case "experience":
          return (
            <div key={idx} className="mb-4">
              <SectionTitle title="Experience" />
              <div className="space-y-4">
                {(block.data as ExperienceItem[]).map((item, i) => (
                  <div key={i}>
                    <div className={cn('flex', 'justify-between', 'items-baseline', 'mb-0.5')}>
                      <h3 className={cn('text-[12px]', 'font-bold', 'text-zinc-900')}>
                        {item.jobTitle}
                      </h3>
                      <span className={cn('text-[11px]', 'font-semibold', 'text-zinc-900', 'shrink-0', 'whitespace-nowrap', 'ml-4')}>
                        {item.startDate} – {item.endDate || "Present"}
                      </span>
                    </div>
                    
                    <div className={cn('flex', 'justify-between', 'items-center', 'mb-1.5')}>
                      <span className={cn('text-[11px]', 'font-medium', 'text-zinc-600', 'italic')}>
                        {item.companyName}
                      </span>
                      {item.location && (
                         <span className={cn('text-[10px]', 'text-zinc-600', 'font-medium')}>
                           {item.location}
                         </span>
                      )}
                    </div>

                    <ul className={cn('space-y-1', 'ml-3.5')}>
                      {item.bullets.map((bullet, b) => (
                        <li key={b} className={cn('list-decimal', 'text-[11px]', 'text-zinc-900', 'leading-snug', 'pl-0.5', 'marker:text-zinc-900')}>
                          <span className={cn('shrink-0', 'text-zinc-900', 'font-bold', 'mt-[0.5px]', 'mr-2 ml-2')}>•</span>
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
            <div key={idx} className="mb-4">
              <SectionTitle title="Projects" />
              <div className="space-y-3">
                {(block.data as ProjectItem[]).map((item, i) => (
                  <div key={i}>
                    <div className={cn('flex', 'justify-between', 'items-baseline', 'mb-0.5')}>
                      <h3 className={cn('text-[12px]', 'font-bold', 'text-zinc-900')}>{item.name}</h3>
                      <span className={cn('text-[11px]', 'font-semibold', 'text-zinc-900', 'shrink-0')}>{item.dates}</span>
                    </div>
                    {item.description && (
                      <p className={cn('text-[11px]', 'text-zinc-800', 'mb-1', 'italic')}>
                        {item.description}
                      </p>
                    )}
                    <ul className={cn('space-y-1', 'ml-3.5')}>
                      {item.bullets.map((bullet, b) => (
                        <li key={b} className={cn('list-disc', 'text-[11px]', 'text-zinc-900', 'leading-snug', 'pl-0.5', 'marker:text-zinc-900')}>
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
            <div key={idx} className="mb-4">
              <SectionTitle title="Skills" />
              <div className={cn('grid', 'grid-cols-[120px_1fr]', 'gap-y-1.5', 'text-[11px]')}>
                {(block.data as SkillGroup[]).map((group, i) => (
                  <React.Fragment key={i}>
                    <span className={cn('font-bold', 'text-zinc-900', i !== 0 && 'mt-1')}>
                      {group.category}
                    </span>
                    <span className="text-zinc-900">
                      {group.skills.join(", ")}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );

        case "education":
          return (
            <div key={idx} className="mb-4">
              <SectionTitle title="Education" />
              <div className="space-y-3">
                {(block.data as EducationItem[]).map((edu, i) => (
                  <div key={i} className={cn('flex', 'justify-between', 'items-start')}>
                    <div>
                      <h3 className={cn('text-[12px]', 'font-bold', 'text-zinc-900')}>
                        {edu.degree}
                      </h3>
                      <div className={cn('text-[11px]', 'text-zinc-600')}>
                        <span className={cn('italic', 'font-semibold')}>{edu.institution}</span>
                        {edu.gpa && <span className={cn('ml-2', 'font-medium')}>GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                    <span className={cn('text-[11px]', 'font-bold', 'text-zinc-900', 'whitespace-nowrap')}>
                      {edu.graduationYear} {edu.isPursuing && '(Pursuing)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "certifications":
          return (
            <div key={idx} className="mb-4">
              <SectionTitle title="Certifications" />
              <div className="space-y-1">
                {(block.data as CertificationItem[]).map((cert, i) => (
                  <div key={i} className={cn('flex', 'justify-between', 'items-baseline', 'text-[11px]')}>
                    <span className={cn('text-zinc-900', 'font-semibold')}>
                      {cert.name} <span className={cn('font-normal', 'mx-1')}>|</span> {cert.issuer}
                    </span>
                    <span className={cn('font-bold', 'text-zinc-900')}>{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "languages":
          return (
            <div key={idx} className="mb-4">
              <SectionTitle title="Languages" />
              <div className={cn('flex', 'flex-col', 'gap-y-1', 'text-[11px]')}>
                {(block.data as LanguageItem[]).map((lang, l) => (
                  <div key={l} className={cn('flex', 'flex-row', 'gap-x-2')}>
                    <span className={cn('font-bold', 'text-zinc-900', 'mt-[0.5px]', 'mr-2')}>•</span> 
                   <span className={cn('font-bold', 'text-zinc-900')}>
                    {lang.language}
                     <span className={cn('text-zinc-700', 'ml-1')}>({lang.proficiency})</span>
                   </span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "custom":
          return (
            <div key={idx} className="mb-4">
              <SectionTitle title={(block.data as CustomBlock).title} />
              <div className={cn('text-[11px]', 'text-zinc-900', 'whitespace-pre-wrap', 'leading-relaxed')}>
                {(block.data as CustomBlock).content}
              </div>
            </div>
          );

        case "personal":
          return (
            <div key={idx} className="mb-4">
              <SectionTitle title="Personal Details" />
              <div className={cn('flex', 'flex-wrap', 'gap-x-8', 'gap-y-2', 'text-[11px]', 'flex-col')}>
                {(block.data as any[]).map((item, i) => (
                  <div key={i} className={cn('flex', 'gap-1.5')}>
                    <span className={cn('font-bold', 'text-zinc-900')}>{item.label}:</span>
                    <span className="text-zinc-900">{item.value}</span>
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
        className={cn('resume-container', 'w-[210mm]', 'min-h-[297mm]', 'mx-auto', 'bg-white', 'text-zinc-900', 'shadow-sm', 'relative', 'selection:bg-zinc-100')}
        style={{
          padding: "16mm 20mm",
          boxSizing: "border-box",
          fontFamily: "'Inter', sans-serif",
          fontSize: "11px",
        }}
      >
        {data.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }
);

ModernProfessional.displayName = "ModernProfessional";
