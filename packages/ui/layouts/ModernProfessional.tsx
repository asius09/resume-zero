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

export const ModernProfessional = forwardRef<HTMLDivElement, { data: ResumeData }>(
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
          <div className="mb-6 border-b-2 border-black pb-5">
            <h1 className="text-[26px] font-bold uppercase tracking-tight mb-2">
              {headerBlock.data.fullName}
            </h1>
            <div className="text-[14px] font-medium text-[#444]">
              {headerBlock.data.location && (
                <>
                  <span>{headerBlock.data.location}</span>
                  {(headerBlock.data.contacts as Contact[]).length > 0 && (
                    <span> • </span>
                  )}
                </>
              )}
              {(headerBlock.data.contacts as Contact[]).map((c, i) => (
                <React.Fragment key={i}>
                  <a
                    href={formatContactLink(c)}
                    className="hover:underline text-inherit no-underline"
                  >
                    {c.value}
                  </a>
                  {i < (headerBlock.data.contacts as Contact[]).length - 1 && (
                    <span> • </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* 2. Professional Summary */}
        {summaryBlock && summaryBlock.type === "summary" && summaryBlock.data && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase mb-3 tracking-wider">
              SUMMARY
            </h2>
            <p className="text-[14px] leading-relaxed text-black">
              {summaryBlock.data as string}
            </p>
          </div>
        )}

        {/* 3. Experience */}
        {experienceBlock && experienceBlock.type === "experience" && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold uppercase border-b border-[#ddd] mb-5 pb-1 tracking-wider">
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {(experienceBlock.data as ExperienceItem[]).map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="text-[15px] font-bold text-black">
                      {item.companyName}
                    </div>
                    <div className="text-[14px] font-bold text-[#444] whitespace-nowrap ml-4">
                      {item.startDate} – {item.endDate || "Present"}
                    </div>
                  </div>
                  <div className="text-[14px] font-bold italic mb-2 text-[#222]">
                    {item.jobTitle}
                  </div>
                  <ul className="list-disc list-outside ml-5 text-[14px] space-y-2 text-black">
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
            <h2 className="text-[16px] font-bold uppercase border-b border-[#ddd] mb-4 pb-1 tracking-wider">
              SKILLS
            </h2>
            <div className="space-y-2">
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
            <h2 className="text-[16px] font-bold uppercase border-b border-[#ddd] mb-4 pb-1 tracking-wider">
              EDUCATION
            </h2>
            <div className="space-y-4">
              {(educationBlock.data as EducationItem[]).map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-baseline text-[14px]"
                >
                  <div>
                    <div className="font-bold">{item.institution}</div>
                    <div className="italic">
                      {item.degree} {item.gpa && `(GPA: ${item.gpa})`}
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
            <h2 className="text-[16px] font-bold uppercase border-b border-[#ddd] mb-4 pb-1 tracking-wider">
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
            <h2 className="text-[16px] font-bold uppercase border-b border-[#ddd] mb-5 pb-1 tracking-wider">
              PROJECTS
            </h2>
            <div className="space-y-6">
              {(projectsBlock.data as ProjectItem[]).map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="text-[15px] font-bold text-black">
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
                    <p className="text-[14px] mb-2 italic text-[#334155] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <ul className="list-disc list-outside ml-5 text-[14px] space-y-1.5 text-black">
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
            <h2 className="text-[16px] font-bold uppercase border-b border-[#ddd] mb-4 pb-1 tracking-wider">
              CERTIFICATIONS
            </h2>
            <ul className="list-disc list-outside ml-5 text-[14px] space-y-1.5 text-black">
              {(certsBlock.data as CertificationItem[]).map((item, idx) => (
                <li key={idx} className="pl-1 leading-normal">
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
            <h2 className="text-[16px] font-bold border-b border-[#ddd] mb-4 pb-1 tracking-wider">
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
            <h2 className="text-[16px] font-bold uppercase border-b border-[#ddd] mb-4 pb-1 tracking-wider">
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

ModernProfessional.displayName = "ModernProfessional";

