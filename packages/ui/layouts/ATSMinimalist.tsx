import React from "react";
import clsx from "clsx";
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
  <div className={clsx('mt-5', 'mb-2', 'border-b', 'border-zinc-900', 'pb-0.5', 'first:mt-0')}>
    <h2
      className={clsx('font-bold', 'uppercase', 'tracking-[0.15em]', 'text-zinc-900')}
      style={{ fontSize: "10pt" }}
    >
      {title}
    </h2>
  </div>
);

const BulletItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className={clsx('flex', 'items-start', 'gap-1.5', 'leading-[1.3]', 'text-zinc-800', 'mb-0.5')}
    style={{ fontSize: "9.5pt" }}
  >
    <span className={clsx('shrink-0', 'text-zinc-900', 'font-bold', 'mt-[0.5px]')}>•</span>
    <span className={clsx('flex-1', 'text-left')}>{children}</span>
  </div>
);

const ItemHeader: React.FC<{ 
  title: string | React.ReactNode; 
  subtitle?: string | React.ReactNode; 
  rightLabel?: string; 
}> = ({ title, subtitle, rightLabel }) => (
  <div className={clsx('mb-1', 'text-left')}>
    <div className={clsx('flex', 'justify-between', 'items-baseline')}>
      <div className={clsx('font-bold', 'text-zinc-900')} style={{ fontSize: "10pt" }}>
        {title}
      </div>
      {rightLabel && (
        <div className={clsx('font-bold', 'text-zinc-700', 'tabular-nums')} style={{ fontSize: "9.5pt" }}>
          {rightLabel}
        </div>
      )}
    </div>
    {subtitle && (
      <div className={clsx('font-medium', 'italic', 'text-zinc-800')} style={{ fontSize: "9.5pt" }}>
        {subtitle}
      </div>
    )}
  </div>
);

interface HeaderItem extends Omit<Partial<Contact>, "type"> {
  isContact?: boolean;
  type?: Contact["type"] | "location";
  value: string;
}

// --- Main Template Component ---

export const ATSMinimalist: React.FC<{ data: ResumeData }> = ({ data }) => {
  const renderBlock = (block: any, idx: number) => {
    switch (block.type) {
      case "header":
        return (
          <div key={idx} className={clsx('mb-6', 'text-center')}>
            <h1
              className={clsx('font-bold', 'uppercase', 'tracking-[0.05em]', 'text-zinc-900', 'mb-2')}
              style={{ fontSize: "18pt", lineHeight: "1.2" }}
            >
              {block.data.fullName}
            </h1>
            <div
              className={clsx('text-zinc-700', 'leading-snug', 'flex', 'justify-center', 'flex-wrap', 'gap-x-3', 'gap-y-1', 'mx-auto', 'max-w-[90%]')}
              style={{ fontSize: "9pt" }}
            >
              {[
                block.data.location &&
                  ({ type: "location", value: block.data.location } as HeaderItem),
                ...(block.data.contacts as Contact[]).map(
                  (c) => ({ ...c, isContact: true } as HeaderItem)
                ),
              ]
                .filter((item): item is HeaderItem => Boolean(item))
                .map((item, index, array) => (
                  <React.Fragment key={index}>
                    <span className="whitespace-nowrap">
                      {item.isContact ? (
                        <a
                          href={formatContactLink(item as Contact)}
                          className={clsx('hover:text-zinc-900', 'transition-colors', 'no-underline')}
                        >
                          {["linkedin", "github", "website"].includes(item.type!)
                            ? item.value.replace(/^https?:\/\/(www\.)?/, "")
                            : item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </span>
                    {index < array.length - 1 && (
                      <span className={clsx('text-zinc-400', 'font-light')}>|</span>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        );

      case "summary":
        if (!block.data) return null;
        return (
          <div key={idx} className={clsx('text-left', 'w-full', 'mb-4')}>
            <SectionHeader title="Professional Summary" />
            <p className={clsx('leading-normal', 'text-zinc-800', 'text-left')} style={{ fontSize: "9.5pt" }}>
              {block.data as string}
            </p>
          </div>
        );

      case "experience":
        return (
          <div key={idx} className={clsx('text-left', 'w-full', 'mb-4')}>
            <SectionHeader title="Experience" />
            <div className="space-y-4">
              {(block.data as ExperienceItem[]).map((item, i) => (
                <div key={i} className="text-left">
                  <ItemHeader 
                    title={item.jobTitle}
                    subtitle={item.companyName}
                    rightLabel={`${item.startDate} \u2013 ${item.endDate || "Present"}`}
                  />
                  <div className={clsx('space-y-0.5', 'text-left', 'pl-1')}>
                    {item.bullets.map((bullet, b) => (
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
          <div key={idx} className="mb-4">
            <SectionHeader title="Skills & Expertise" />
            <div className={clsx('space-y-0.5', 'pl-1')}>
              {(block.data as SkillGroup[]).map((group, i) => (
                <BulletItem key={i}>
                  <span className={clsx('font-bold', 'text-zinc-900')}>{group.category}:</span>{" "}
                  <span className="text-zinc-700">{group.skills.join(", ")}</span>
                </BulletItem>
              ))}
            </div>
          </div>
        );

      case "education":
        return (
          <div key={idx} className="mb-4">
            <SectionHeader title="Education" />
            <div className="space-y-3">
              {(block.data as EducationItem[]).map((edu, i) => (
                <div key={i}>
                  <ItemHeader 
                    title={edu.degree}
                    subtitle={
                      <>
                        {edu.institution}
                        {edu.gpa && <span className={clsx('font-semibold', 'text-zinc-600')}> — GPA: {edu.gpa}</span>}
                      </>
                    }
                    rightLabel={edu.graduationYear}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "languages":
        return (
          <div key={idx} className="mb-4">
            <SectionHeader title="Languages" />
            <div className={clsx('space-y-0.5', 'pl-1')}>
              {(block.data as LanguageItem[]).map((lang, l) => (
                <BulletItem key={l}>
                  <span className={clsx('font-bold', 'text-zinc-900')}>{lang.language}</span>
                  {lang.proficiency && (
                    <span className={clsx('text-zinc-600', 'italic', 'ml-1')}>({lang.proficiency})</span>
                  )}
                </BulletItem>
              ))}
            </div>
          </div>
        );

      case "projects":
        return (
          <div key={idx} className="mb-4">
            <SectionHeader title="Projects" />
            <div className="space-y-4">
              {(block.data as ProjectItem[]).map((proj, i) => (
                <div key={i}>
                  <ItemHeader 
                    title={proj.link ? (
                      <a href={proj.link} className={clsx('hover:text-zinc-900', 'border-b', 'border-transparent', 'hover:border-zinc-900', 'transition-all')}>
                        {proj.name}
                      </a>
                    ) : proj.name}
                    rightLabel={proj.dates}
                  />
                  {proj.description && (
                    <p className={clsx('mb-1.5', 'text-zinc-600', 'leading-snug')} style={{ fontSize: "9.5pt" }}>
                      {proj.description}
                    </p>
                  )}
                  <div className={clsx("space-y-1", "pl-1")}>
                    {proj.bullets.map((bullet, b) => (
                      <BulletItem key={b}>{bullet}</BulletItem>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "certifications":
        return (
          <div key={idx} className="mb-4">
            <SectionHeader title="Certifications" />
            <div className={clsx("space-y-1.5 pl-1")}>
              {(block.data as CertificationItem[]).map((cert, c) => (
                <BulletItem key={c}>
                  <span className={clsx('font-bold', 'text-zinc-900')}>{cert.name}</span>
                  <span className="text-zinc-500"> — {cert.issuer} ({cert.year})</span>
                </BulletItem>
              ))}
            </div>
          </div>
        );

      case "custom":
        const custom = block.data as CustomBlock;
        if (!custom.title) return null;
        return (
          <div key={idx} className="mb-4">
            <SectionHeader title={custom.title} />
            <div className={clsx('whitespace-pre-wrap', 'leading-normal', 'text-zinc-700')} style={{ fontSize: "9.5pt" }}>
              {custom.content}
            </div>
          </div>
        );

      case "personal":
        return (
          <div key={idx} className="mb-4">
            <SectionHeader title="Personal Details" />
            <div className={clsx('space-y-1', 'pl-1')}>
              {Array.isArray(block.data) && (block.data as any[]).map((item, i) => (
                <div key={i} className={clsx('flex', 'gap-2', 'text-left')} style={{ fontSize: "9.5pt" }}>
                  <span className={clsx('font-bold', 'text-zinc-900', 'min-w-[100px]')}>{item.label}:</span>
                  <span className="text-zinc-700">{formatPersonalValue(item.label, item.value)}</span>
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
      className={clsx('resume-container', 'w-[210mm]', 'min-h-[296mm]', 'mx-auto', 'bg-white', 'text-zinc-900', 'print:p-0', 'flex', 'flex-col')}
      style={{
        padding: "12mm 15mm",
        boxSizing: "border-box",
        fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};
