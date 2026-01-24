"use client";

import React, { forwardRef } from "react";
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

export const InternationalFormat = forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => {
    const headerBlock = data.blocks.find((b) => b.type === "header");
    const summaryBlock = data.blocks.find((b) => b.type === "summary");
    const experienceBlock = data.blocks.find((b) => b.type === "experience");
    const skillsBlock = data.blocks.find((b) => b.type === "skills");
    const educationBlock = data.blocks.find((b) => b.type === "education");
    const languagesBlock = data.blocks.find((b) => b.type === "languages");
    const personalBlock = data.blocks.find((b) => b.type === "personal");

    // Additional sections
    const projectsBlock = data.blocks.find((b) => b.type === "projects");
    const certsBlock = data.blocks.find((b) => b.type === "certifications");
    const customBlocks = data.blocks.filter((b) => b.type === "custom");

    return (
      <div
        ref={ref}
        className="resume-container w-[210mm] min-h-[296mm] mx-auto bg-white text-[#111] print:p-0 print:m-0"
        style={{
          padding: "20mm",
          boxSizing: "border-box",
          fontFamily: "var(--font-inter), 'Helvetica', Arial, sans-serif",
        }}
      >
        {/* 1. Header */}
        {headerBlock && headerBlock.type === "header" && (
          <div className="mb-6 border-b border-[#111] pb-6">
            <h1 className="text-[28px] font-bold uppercase tracking-tight mb-3">
              {headerBlock.data.fullName}
            </h1>
            <div className="text-[14px] font-medium text-[#111]">
              {headerBlock.data.location && (
                <div className="mb-1">{headerBlock.data.location}</div>
              )}
              <div className="flex flex-wrap gap-x-4">
                {(headerBlock.data.contacts as Contact[]).map((c, i) => (
                  <span key={i}>
                    <a
                      href={formatContactLink(c)}
                      className="hover:underline text-inherit no-underline"
                    >
                      {c.value}
                    </a>
                    {i < (headerBlock.data.contacts as Contact[]).length - 1 && (
                      <span className="ml-4 opacity-30">|</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Summary */}
        {summaryBlock && summaryBlock.type === "summary" && summaryBlock.data && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-3 border-l-4 border-[#111] pl-3">
              SUMMARY
            </h2>
            <p className="text-[14px] leading-relaxed text-[#111]">
              {summaryBlock.data as string}
            </p>
          </div>
        )}

        {/* 3. Experience */}
        {experienceBlock && experienceBlock.type === "experience" && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-4 border-l-4 border-[#111] pl-3">
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {(experienceBlock.data as ExperienceItem[]).map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="text-[15px] font-bold">{item.jobTitle}</div>
                    <div className="text-[14px] font-bold text-[#444] whitespace-nowrap ml-4">
                      {item.startDate} – {item.endDate || "Present"}
                    </div>
                  </div>
                  <div className="text-[14px] font-medium mb-2 text-[#444]">
                    {item.companyName} {item.location && `| ${item.location}`}
                  </div>
                  <ul className="list-disc list-outside ml-5 text-[14px] space-y-2 text-[#111]">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-1 leading-normal">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Skills */}
        {skillsBlock && skillsBlock.type === "skills" && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-4 border-l-4 border-[#111] pl-3">
              SKILLS
            </h2>
            <div className="space-y-4">
              {(skillsBlock.data as SkillGroup[]).map((item, idx) => (
                <div key={idx} className="text-[14px] leading-normal">
                  <span className="font-bold">{item.category}:</span>
                  <ul className="list-disc list-outside ml-5 mt-1">
                    {item.skills.map((skill, sIdx) => (
                      <li key={sIdx}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Education */}
        {educationBlock && educationBlock.type === "education" && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-4 border-l-4 border-[#111] pl-3">
              EDUCATION
            </h2>
            <div className="space-y-4">
              {(educationBlock.data as EducationItem[]).map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-baseline text-[14px]"
                >
                  <div>
                    <div className="font-bold">{item.degree}</div>
                    <div className="text-[#444]">
                      {item.institution} {item.gpa && `| GPA: ${item.gpa}`}
                    </div>
                  </div>
                  <div className="font-bold text-[#444] whitespace-nowrap ml-4">
                    {item.graduationYear}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Languages */}
        {languagesBlock && languagesBlock.type === "languages" && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-4 border-l-4 border-[#111] pl-3">
              LANGUAGES
            </h2>
            <ul className="list-disc list-outside ml-5 text-[14px] space-y-1">
              {(languagesBlock.data as LanguageItem[]).map((item, idx) => (
                <li key={idx}>
                  <span className="font-bold">{item.language}</span>
                  {item.proficiency && ` — ${item.proficiency}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 7. Projects */}
        {projectsBlock && projectsBlock.type === "projects" && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-4 border-l-4 border-[#111] pl-3">
              PROJECTS
            </h2>
            <div className="space-y-6">
              {(projectsBlock.data as ProjectItem[]).map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="text-[15px] font-bold">
                      {item.link ? (
                        <a
                          href={item.link}
                          className="hover:underline text-inherit no-underline"
                        >
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                    </div>
                    {item.dates && (
                      <div className="text-[14px] font-bold text-[#444] whitespace-nowrap ml-4">
                        {item.dates}
                      </div>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-[14px] mb-2 italic text-[#444] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <ul className="list-disc list-outside ml-5 text-[14px] space-y-1.5 text-[#111]">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-1 leading-normal">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Certifications */}
        {certsBlock && certsBlock.type === "certifications" && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-4 border-l-4 border-[#111] pl-3">
              CERTIFICATIONS
            </h2>
            <ul className="list-disc list-outside ml-5 text-[14px] space-y-1.5 text-[#111]">
              {(certsBlock.data as CertificationItem[]).map((item, idx) => (
                <li key={idx}>
                  <span className="font-bold">{item.name}</span> — {item.issuer} (
                  {item.year})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 9. Custom Sections */}
        {customBlocks.map((block, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-[16px] font-bold mb-4 border-l-4 border-[#111] pl-3">
              {(block.data as CustomBlock).title}
            </h2>
            <div className="text-[14px] whitespace-pre-wrap leading-relaxed">
              {(block.data as CustomBlock).content}
            </div>
          </div>
        ))}

        {/* 10. Personal Details (Last only) */}
        {personalBlock && personalBlock.type === "personal" && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-4 border-l-4 border-[#111] pl-3">
              PERSONAL DETAILS
            </h2>
            <div className="grid grid-cols-2 gap-y-2 text-[14px]">
              {Array.isArray(personalBlock.data) &&
                personalBlock.data.map((item: any, idx: number) => (
                  <div key={idx}>
                    <span className="font-bold">{item.label}:</span> {item.value}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

InternationalFormat.displayName = "InternationalFormat";

