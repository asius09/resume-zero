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

interface HeaderItem extends Omit<Partial<Contact>, "type"> {
  isContact?: boolean;
  type?: Contact["type"] | "location";
  value: string;
}

export const ATSMinimalist: React.FC<{ data: ResumeData }> = ({ data }) => {
  const headerBlock = data.blocks.find((b) => b.type === "header");
  const summaryBlock = data.blocks.find((b) => b.type === "summary");
  const experienceBlock = data.blocks.find((b) => b.type === "experience");
  const skillsBlock = data.blocks.find((b) => b.type === "skills");
  const educationBlock = data.blocks.find((b) => b.type === "education");
  const languagesBlock = data.blocks.find((b) => b.type === "languages");
  const personalBlock = data.blocks.find((b) => b.type === "personal");

  // Non-core but supported sections
  const projectsBlock = data.blocks.find((b) => b.type === "projects");
  const certsBlock = data.blocks.find((b) => b.type === "certifications");
  const customBlocks = data.blocks.filter((b) => b.type === "custom");

  return (
    <div
      className={clsx(
        "resume-container",
        "w-[210mm]",
        "min-h-[297mm]",
        "mx-auto",
        "bg-white",
        "text-[#111]",
        "print:shadow-none",
      )}
      style={{
        padding: "20mm",
        fontFamily: "var(--font-inter), 'Helvetica', Arial, sans-serif",
      }}
    >
      {/* 1. Header (Identity) */}
      {headerBlock && headerBlock.type === "header" && (
        <div
          className={clsx("mb-6", "text-center")}
          style={{ textAlign: "center" }}
        >
          <h1
            className={clsx(
              "font-bold",
              "uppercase",
              "tracking-tight",
              "mb-2",
              "w-full",
            )}
            style={{ textAlign: "center", fontSize: "12pt" }}
          >
            {headerBlock.data.fullName}
          </h1>
          <div
            className={clsx(
              "text-[#222]",
              "mt-1",
              "leading-snug",
              "text-center",
            )}
            style={{ fontSize: "10pt" }}
          >
            {/* Row 1: Location, Email, Phone */}
            <div
              className={clsx(
                "flex",
                "flex-wrap",
                "justify-center",
                "items-center",
                "gap-x-2",
              )}
            >
              {[
                headerBlock.data.location &&
                  ({
                    type: "location",
                    value: headerBlock.data.location,
                  } as HeaderItem),
                ...(headerBlock.data.contacts as Contact[])
                  .filter((c) => ["email", "phone"].includes(c.type))
                  .map((c) => ({ ...c, isContact: true }) as HeaderItem),
              ]
                .filter((item): item is HeaderItem => Boolean(item))
                .map((item, index, array) => (
                  <div key={index} className={clsx("flex", "items-center")}>
                    <span className="whitespace-nowrap">
                      {item.isContact ? (
                        <a
                          href={formatContactLink(item as Contact)}
                          className={clsx(
                            "hover:underline",
                            "text-inherit",
                            "no-underline",
                          )}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </span>
                    {index < array.length - 1 && (
                      <span className={clsx("mx-2", "text-slate-400")}>|</span>
                    )}
                  </div>
                ))}
            </div>

            {/* Row 2: Links (LinkedIn, Website, etc.) */}
            <div
              className={clsx(
                "flex",
                "flex-wrap",
                "justify-center",
                "items-center",
                "gap-x-2",
                "mt-0.5",
              )}
            >
              {(headerBlock.data.contacts as Contact[])
                .filter((c) => !["email", "phone"].includes(c.type))
                .map((item, index, array) => (
                  <div key={index} className={clsx("flex", "items-center")}>
                    <span className="whitespace-nowrap">
                      <a
                        href={formatContactLink(item)}
                        className={clsx(
                          "hover:underline",
                          "text-inherit",
                          "no-underline",
                        )}
                      >
                        {item.value.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    </span>
                    {index < array.length - 1 && (
                      <span className={clsx("mx-2", "text-slate-400")}>|</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Professional Summary */}
      {summaryBlock && summaryBlock.type === "summary" && summaryBlock.data && (
        <div className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "uppercase",
              "border-b",
              "border-[#ddd]",
              "mb-3",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            SUMMARY
          </h2>
          <p className={clsx("leading-relaxed")} style={{ fontSize: "10pt" }}>
            {summaryBlock.data as string}
          </p>
        </div>
      )}

      {/* 3. Work Experience */}
      {experienceBlock && experienceBlock.type === "experience" && (
        <div className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "uppercase",
              "border-b",
              "border-[#ddd]",
              "mb-4",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            EXPERIENCE
          </h2>
          <div className="space-y-5">
            {(experienceBlock.data as ExperienceItem[]).map((item, idx) => (
              <div key={idx}>
                <div
                  className={clsx(
                    "flex",
                    "justify-between",
                    "items-baseline",
                    "mb-1",
                  )}
                >
                  <div
                    className={clsx("font-bold")}
                    style={{ fontSize: "10pt" }}
                  >
                    {item.jobTitle}
                  </div>
                  <div
                    className={clsx(
                      "font-bold",
                      "text-[#444]",
                      "whitespace-nowrap",
                      "ml-4",
                    )}
                    style={{ fontSize: "10pt" }}
                  >
                    {item.startDate} – {item.endDate || "Present"}
                  </div>
                </div>
                <div
                  className={clsx("font-medium", "text-[#111]", "mb-1")}
                  style={{ fontSize: "10pt" }}
                >
                  {item.companyName}
                </div>
                <div className={clsx("space-y-1", "text-[#111]", "pl-2")}>
                  {item.bullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      className={clsx(
                        "flex",
                        "items-start",
                        "gap-2",
                        "leading-normal",
                      )}
                      style={{ fontSize: "10pt" }}
                    >
                      <span className={clsx("shrink-0", "text-black", "mr-2")}>
                        •
                      </span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Skills */}
      {skillsBlock && skillsBlock.type === "skills" && (
        <div className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "uppercase",
              "border-b",
              "border-[#ddd]",
              "mb-3",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            SKILLS
          </h2>
          <div className="space-y-2">
            {(skillsBlock.data as SkillGroup[]).map((item, idx) => (
              <div
                key={idx}
                className={clsx("leading-normal")}
                style={{ fontSize: "10pt" }}
              >
                <span className="font-bold">{item.category}:</span>
                <div className={clsx("mt-1", "space-y-1", "pl-2")}>
                  {item.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className={clsx(
                        "flex",
                        "items-start",
                        "gap-2",
                        "leading-normal",
                      )}
                      style={{ fontSize: "10pt" }}
                    >
                      <span className={clsx("shrink-0", "text-black", "mr-2")}>
                        •
                      </span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Education */}
      {educationBlock && educationBlock.type === "education" && (
        <div className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "uppercase",
              "border-b",
              "border-[#ddd]",
              "mb-3",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            EDUCATION
          </h2>
          <div className="space-y-3">
            {(educationBlock.data as EducationItem[]).map((item, idx) => (
              <div key={idx} className="mb-2">
                <div
                  className={clsx("flex", "justify-between", "items-baseline")}
                  style={{ fontSize: "10pt" }}
                >
                  <span className={clsx("font-bold")}>{item.degree}</span>
                  <span
                    className={clsx(
                      "font-bold",
                      "text-[#444]",
                      "whitespace-nowrap",
                      "ml-4",
                    )}
                  >
                    {item.graduationYear}
                  </span>
                </div>
                <div
                  className={clsx("text-[#111]")}
                  style={{ fontSize: "10pt" }}
                >
                  {item.institution}
                  {item.gpa && <span> (GPA: {item.gpa})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Languages */}
      {languagesBlock && languagesBlock.type === "languages" && (
        <div className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "uppercase",
              "border-b",
              "border-[#ddd]",
              "mb-3",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            LANGUAGES
          </h2>
          <div
            className={clsx("space-y-1", "leading-normal", "pl-2")}
            style={{ fontSize: "10pt" }}
          >
            {(languagesBlock.data as LanguageItem[]).map((item, idx) => (
              <div key={idx} className={clsx("flex", "items-start", "gap-2")}>
                <span className={clsx("shrink-0", "text-black", "mr-2")}>
                  •
                </span>
                <span>
                  <span className="font-bold">{item.language}</span>
                  {item.proficiency && ` (${item.proficiency})`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Projects */}
      {projectsBlock && projectsBlock.type === "projects" && (
        <div className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "uppercase",
              "border-b",
              "border-[#ddd]",
              "mb-4",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            PROJECTS
          </h2>
          <div className="space-y-4">
            {(projectsBlock.data as ProjectItem[]).map((item, idx) => (
              <div key={idx}>
                <div
                  className={clsx(
                    "flex",
                    "justify-between",
                    "items-baseline",
                    "mb-1",
                  )}
                >
                  <div
                    className={clsx("font-bold")}
                    style={{ fontSize: "10pt" }}
                  >
                    {item.link ? (
                      <a
                        href={item.link}
                        className={clsx(
                          "hover:underline",
                          "text-inherit",
                          "no-underline",
                        )}
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </div>
                  {item.dates && (
                    <div
                      className={clsx(
                        "font-bold",
                        "text-[#444]",
                        "whitespace-nowrap",
                        "ml-4",
                      )}
                      style={{ fontSize: "10pt" }}
                    >
                      {item.dates}
                    </div>
                  )}
                </div>
                {item.description && (
                  <p
                    className={clsx(
                      "mb-2",
                      "italic",
                      "text-[#334155]",
                      "leading-normal",
                    )}
                    style={{ fontSize: "10pt" }}
                  >
                    {item.description}
                  </p>
                )}
                <div className={clsx("space-y-1", "text-[#111]", "pl-2")}>
                  {item.bullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      className={clsx(
                        "flex",
                        "items-start",
                        "gap-2",
                        "leading-normal",
                      )}
                      style={{ fontSize: "10pt" }}
                    >
                      <span className={clsx("shrink-0", "text-black", "mr-2")}>
                        •
                      </span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Certifications */}
      {certsBlock && certsBlock.type === "certifications" && (
        <div className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "uppercase",
              "border-b",
              "border-[#ddd]",
              "mb-3",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            CERTIFICATIONS
          </h2>
          <div
            className={clsx("space-y-1", "leading-normal", "pl-2")}
            style={{ fontSize: "10pt" }}
          >
            {(certsBlock.data as CertificationItem[]).map((item, idx) => (
              <div key={idx} className={clsx("flex", "items-start", "gap-2")}>
                <span className={clsx("shrink-0", "text-black", "mr-2")}>
                  •
                </span>
                <span>
                  <span className="font-bold">{item.name}</span> — {item.issuer}{" "}
                  ({item.year})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Custom */}
      {customBlocks.map((block, idx) => (
        <div key={idx} className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "border-b",
              "border-[#ddd]",
              "mb-2",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            {(block.data as CustomBlock).title}
          </h2>
          <div
            className={clsx("whitespace-pre-wrap", "leading-normal")}
            style={{ fontSize: "10pt" }}
          >
            {(block.data as CustomBlock).content}
          </div>
        </div>
      ))}

      {/* 10. Personal Details (Last only) */}
      {personalBlock && personalBlock.type === "personal" && (
        <div className="mb-6">
          <h2
            className={clsx(
              "font-bold",
              "uppercase",
              "border-b",
              "border-[#ddd]",
              "mb-3",
              "pb-1",
              "tracking-widest",
            )}
            style={{ fontSize: "12pt" }}
          >
            PERSONAL DETAILS
          </h2>
          <div className={clsx("space-y-1")} style={{ fontSize: "10pt" }}>
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
};
