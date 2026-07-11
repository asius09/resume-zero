"use client";

import React, { forwardRef } from "react";
import { cn } from "../lib/cn";
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

// --- Helper Functions ---

function formatContactLink(contact: Contact): string {
  switch (contact.type) {
    case "email":
      return `mailto:${contact.value}`;
    case "phone":
      return `tel:${contact.value.replace(/\s+/g, "")}`;
    case "linkedin":
    case "github":
    case "website":
      return contact.value.startsWith("http")
        ? contact.value
        : `https://${contact.value}`;
    default:
      return contact.value;
  }
}

function displayContactValue(contact: Contact): string {
  return contact.value
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");
}

function formatPersonalValue(label: string, value: string): string {
  if (label.toLowerCase().includes("date") || label.toLowerCase().includes("birth")) {
    const date = new Date(value);
    if (!isNaN(date.getTime()) && value.includes("-")) {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
  }
  return value;
}

// --- Internal UI Components ---

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className={cn('mt-4', 'mb-2.5', 'border-b-[1.5px]', 'border-zinc-900', 'pb-1', 'first:mt-0')}>
    <h2
      className={cn('font-bold', 'uppercase', 'tracking-widest', 'text-zinc-900')}
      style={{ fontSize: "10pt" }}
    >
      {title}
    </h2>
  </div>
);

const BulletItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className={cn('flex', 'items-start', 'gap-1.5', 'leading-[1.4]', 'text-zinc-800', 'mb-1')}
    style={{ fontSize: "9.5pt" }}
  >
    <span className={cn('shrink-0', 'text-zinc-900', 'font-bold', 'mt-[0.5px]')}>•</span>
    <span className={cn('flex-1', 'text-left')}>{children}</span>
  </div>
);

const ItemHeader: React.FC<{ 
  title: string | React.ReactNode; 
  subtitle?: string | React.ReactNode; 
  rightLabel?: string; 
}> = ({ title, subtitle, rightLabel }) => (
  <div className={cn('mb-1.5', 'text-left')}>
    <div className={cn('flex', 'justify-between', 'items-baseline')}>
      <div className={cn('font-bold', 'text-zinc-900')} style={{ fontSize: "10.5pt" }}>
        {title}
      </div>
      {rightLabel && (
        <div className={cn('font-bold', 'text-zinc-800', 'tabular-nums')} style={{ fontSize: "9.5pt" }}>
          {rightLabel}
        </div>
      )}
    </div>
    {subtitle && (
      <div className={cn('font-medium', 'italic', 'text-zinc-700')} style={{ fontSize: "9.5pt" }}>
        {subtitle}
      </div>
    )}
  </div>
);

// --- Main Template Component ---

export const ModernProfessional = forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => {
    const renderBlock = (block: any, idx: number) => {
      switch (block.type) {
        case "header":
          return (
            <div 
              key={idx} 
              className={cn('w-full', 'flex', 'flex-col', 'items-center')}
              style={{ marginBottom: "1.5rem" }}
            >
              <h1
                className={cn("font-bold uppercase tracking-tight text-zinc-900")}
                style={{ 
                  fontSize: "20pt", 
                  lineHeight: "1.1",
                  textAlign: "center",
                  width: "100%",
                  marginBottom: "4pt"
                }}
              >
                {block.data.fullName}
              </h1>
              <div
                className={cn(
                  "text-zinc-700 flex flex-wrap justify-center items-center gap-y-1 font-medium"
                )}
                style={{ 
                  fontSize: "9.5pt",
                  textAlign: "center",
                  width: "100%"
                }}
              >
                {[
                  block.data.location && (
                    <span key="loc" className={cn('whitespace-nowrap', 'px-1')}>
                      {block.data.location}
                    </span>
                  ),
                  ...(block.data.contacts as Contact[]).map((c, i) => (
                    <React.Fragment key={`contact-${i}`}>
                      {(i > 0 || block.data.location) && c.value && (
                        <span className={cn('text-zinc-400', 'px-2', 'select-none')} aria-hidden="true">
                          •
                        </span>
                      )}
                      {c.value && <span className={cn('whitespace-nowrap', 'px-1')}>
                        <a
                          href={formatContactLink(c)}
                          className={cn("hover:text-zinc-900 transition-colors no-underline text-zinc-700")}
                        >
                          {displayContactValue(c)}
                        </a>
                      </span>}
                    </React.Fragment>
                  )),
                ]}
              </div>
            </div>
          );

        case "summary":
          if (!block.data) return null;
          return (
            <div key={idx} className={cn('text-left', 'w-full', 'mb-5')}>
              <SectionHeader title="Summary" />
              <p className={cn('leading-relaxed', 'text-zinc-800', 'text-justify')} style={{ fontSize: "9.5pt" }}>
                {block.data as string}
              </p>
            </div>
          );

        case "experience":
          return (
            <div key={idx} className={cn('text-left', 'w-full', 'mb-5')}>
              <SectionHeader title="Experience" />
              <div className="space-y-4">
                {(block.data as ExperienceItem[]).map((item, i) => (
                  <div key={i} className="text-left">
                    <ItemHeader 
                      title={item.jobTitle}
                      subtitle={
                        <>
                          {item.companyName}
                          {item.location && <span className="text-zinc-500 font-normal"> — {item.location}</span>}
                        </>
                      }
                      rightLabel={`${item.startDate} \u2013 ${item.endDate || "Present"}`}
                    />
                    <div className={cn('space-y-0.5', 'text-left', 'pl-3.5')}>
                      {item.bullets.map((bullet, b) => (
                        <BulletItem key={b}>{bullet}</BulletItem>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case "projects":
          return (
            <div key={idx} className="mb-5">
              <SectionHeader title="Projects" />
              <div className="space-y-4">
                {(block.data as ProjectItem[]).map((proj, i) => (
                  <div key={i}>
                    <ItemHeader 
                      title={proj.link ? (
                        <a href={proj.link} className={cn('hover:text-zinc-900', 'border-b', 'border-transparent', 'hover:border-zinc-900', 'transition-all')}>
                          {proj.name}
                        </a>
                      ) : proj.name}
                      rightLabel={proj.dates}
                    />
                    {proj.description && (
                      <p className={cn('mb-1.5', 'text-zinc-700', 'leading-relaxed', 'italic')} style={{ fontSize: "9.5pt" }}>
                        {proj.description}
                      </p>
                    )}
                    <div className={cn("space-y-0.5", "pl-3.5")}>
                      {proj.bullets.map((bullet, b) => (
                        <BulletItem key={b}>{bullet}</BulletItem>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case "skills":
          return (
            <div key={idx} className={cn('text-left', 'w-full', 'mb-5')}>
              <SectionHeader title="Skills" />
              <div className={cn('grid', 'grid-cols-[120px_1fr]', 'gap-y-2')} style={{ fontSize: "9.5pt" }}>
                {(block.data as SkillGroup[]).map((group, i) => (
                  <React.Fragment key={i}>
                    <span className={cn('font-bold', 'text-zinc-900')}>
                      {group.category}
                    </span>
                    <span className="text-zinc-800">
                      {group.skills.join(", ")}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );

        case "education":
          return (
            <div key={idx} className="mb-5">
              <SectionHeader title="Education" />
              <div className="space-y-3">
                {(block.data as EducationItem[]).map((edu, i) => (
                  <div key={i}>
                    <ItemHeader 
                      title={edu.degree}
                      subtitle={
                        <>
                          {edu.institution}
                          {edu.gpa && <span className={cn('font-semibold', 'text-zinc-600')}> — GPA: {edu.gpa}</span>}
                        </>
                      }
                      rightLabel={edu.isPursuing ? `${edu.graduationYear} (Pursuing)` : edu.graduationYear}
                    />
                  </div>
                ))}
              </div>
            </div>
          );

        case "languages":
          return (
            <div key={idx} className="mb-5">
              <SectionHeader title="Languages" />
              <div className={cn('space-y-1', 'pl-1')}>
                {(block.data as LanguageItem[]).map((lang, l) => (
                  <BulletItem key={l}>
                    <span className={cn('font-bold', 'text-zinc-900')}>{lang.language}</span>
                    {lang.proficiency && (
                      <span className={cn('text-zinc-700', 'italic', 'ml-1')}>({lang.proficiency})</span>
                    )}
                  </BulletItem>
                ))}
              </div>
            </div>
          );

        case "certifications":
          return (
            <div key={idx} className="mb-5">
              <SectionHeader title="Certifications" />
              <div className={cn("space-y-1.5 pl-1")}>
                {(block.data as CertificationItem[]).map((cert, c) => (
                  <BulletItem key={c}>
                    <span className={cn('font-bold', 'text-zinc-900')}>{cert.name}</span>
                    <span className="text-zinc-600"> — {cert.issuer} ({cert.year})</span>
                  </BulletItem>
                ))}
              </div>
            </div>
          );

        case "custom":
          const custom = block.data as CustomBlock;
          if (!custom.title) return null;
          return (
            <div key={idx} className="mb-5">
              <SectionHeader title={custom.title} />
              <div className={cn('whitespace-pre-wrap', 'leading-relaxed', 'text-zinc-800')} style={{ fontSize: "9.5pt" }}>
                {custom.content}
              </div>
            </div>
          );

        case "personal":
          return (
            <div key={idx} className="mb-5">
              <SectionHeader title="Personal Details" />
              <div className={cn('flex', 'flex-wrap', 'gap-x-8', 'gap-y-2')} style={{ fontSize: "9.5pt" }}>
                {Array.isArray(block.data) && (block.data as any[]).map((item, i) => (
                  <div key={i} className={cn('flex', 'gap-2', 'text-left')}>
                    <span className={cn('font-bold', 'text-zinc-900')}>{item.label}:</span>
                    <span className="text-zinc-800">{formatPersonalValue(item.label, item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'resume-container', 
          'w-[210mm]', 
          'min-h-[297mm]', 
          'print:min-h-[297mm]', 
          'mx-auto', 
          'bg-white', 
          'text-zinc-900', 
          'flex', 
          'flex-col',
          'shadow-2xl',
          'relative'
        )}
        style={{
          padding: "15mm 18mm",
          boxSizing: "border-box",
          fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
        }}
      >
        {data.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }
);

ModernProfessional.displayName = "ModernProfessional";
