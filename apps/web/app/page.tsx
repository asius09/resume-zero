"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";

import {
  Plus,
  Trash2,
  Check,
  Info,
  AlertTriangle,
  Download,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Copy,
} from "lucide-react";
import {
  ATSMinimalist,
  ModernProfessional,
  InternationalFormat,
} from "@resume/ui";
import { normalizeBullet, analyzeBullet, cleanText } from "@resume/cleaner";
import type {
  ResumeData,
  ResumeBlock,
  ResumeSectionType,
  Contact,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  EducationItem,
} from "@resume/types";

const INITIAL_DATA: ResumeData = {
  id: crypto.randomUUID(),
  version: 1,
  metadata: {
    theme: "minimalist",
    region: "US",
    lastModified: new Date().toISOString(),
  },
  blocks: [
    {
      type: "header",
      data: {
        fullName: "New Candidate",
        location: "City, Country",
        contacts: [
          { type: "email", value: "email@example.com" },
          { type: "phone", value: "+1 000 000 0000" },
          { type: "linkedin", value: "linkedin.com/in/username" },
        ],
      },
    },
    {
      type: "summary",
      data: "Optional Professional Summary. Role + years of experience + key value proposition. (2-3 lines)",
    },
    {
      type: "experience",
      data: [
        {
          jobTitle: "Your Role",
          companyName: "Company Name",
          startDate: "Jan 20XX",
          endDate: "Present",
          isCurrent: true,
          bullets: [
            "Start with an action verb (e.g. Led, Optimized, Built)",
            "Quantify impact with numbers where possible",
            "Focus on outcomes, not just responsibilities",
          ],
        },
      ],
    },
    {
      type: "skills",
      data: [
        {
          category: "Technical Skills",
          skills: ["Example Skill 1", "Example Skill 2"],
        },
      ],
    },
    {
      type: "education",
      data: [
        {
          degree: "Degree / Qualification",
          institution: "University / Institution",
          graduationYear: "20XX",
        },
      ],
    },
  ],
};

const STORAGE_KEY = "resume_creator_v1_data";

export default function ResumeCleanerPage() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isCopied, setIsCopied] = useState(false);
  const [activeLayout, setActiveLayout] = useState<
    "minimalist" | "professional" | "international"
  >("minimalist");
  const [isMounted, setIsMounted] = useState(false);

  // Load from LocalStorage once on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id) {
          setData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isMounted]);

  const handleCopy = async () => {
    const el = document.getElementById("resume-preview");
    if (el) {
      const text = el.innerText;
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExportPDF = async () => {
    if (typeof window === "undefined") return;

    const element = document.getElementById("resume-preview");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const headerBlock = data.blocks.find((b) => b.type === "header");
    const fullName =
      headerBlock?.type === "header"
        ? (headerBlock.data as { fullName: string }).fullName
        : "Resume";

    const opt = {
      margin: 0,
      filename: `${fullName.replace(/\s+/g, "_")}_Resume.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        logging: false,
        windowWidth: 1200, // Fixed width for consistent rendering
      },
      jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
      },
    };

    // Wait slightly for fonts to stabilize
    setTimeout(async () => {
      await html2pdf().set(opt).from(element).save();
    }, 500);
  };

  const updateBlock = (index: number, newData: ResumeBlock["data"]) => {
    const newBlocks = [...data.blocks];
    newBlocks[index] = { ...newBlocks[index], data: newData } as ResumeBlock;
    setData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, lastModified: new Date().toISOString() },
      blocks: newBlocks,
    }));
  };

  const addBlock = (type: ResumeSectionType) => {
    let newBlock: ResumeBlock;
    switch (type) {
      case "projects":
        newBlock = {
          type: "projects",
          data: [
            {
              name: "New Project",
              description: "Project summary",
              bullets: ["Key achievement"],
            },
          ],
        };
        break;
      case "certifications":
        newBlock = {
          type: "certifications",
          data: [{ name: "Certificate", issuer: "Issuer", year: "20XX" }],
        };
        break;
      case "custom":
        newBlock = {
          type: "custom",
          data: { title: "New Section", content: "" },
        };
        break;
      default:
        return;
    }
    setData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, lastModified: new Date().toISOString() },
      blocks: [...prev.blocks, newBlock],
    }));
  };

  const removeBlock = (index: number) => {
    const block = data.blocks[index];
    const mandatory = [
      "header",
      "summary",
      "experience",
      "skills",
      "education",
    ];
    if (mandatory.includes(block.type)) {
      alert(`The ${block.type} section is required for a professional resume.`);
      return;
    }

    const newBlocks = data.blocks.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, blocks: newBlocks }));
  };

  const autoClean = () => {
    const cleanedBlocks = data.blocks.map((block: ResumeBlock) => {
      if (block.type === "experience") {
        const items = block.data.map((item: ExperienceItem) => ({
          ...item,
          bullets: item.bullets.map((b: string) => normalizeBullet(b)),
        }));
        return { ...block, data: items } as ResumeBlock;
      }
      if (block.type === "projects") {
        const items = block.data.map((item: ProjectItem) => ({
          ...item,
          bullets: item.bullets.map((b: string) => normalizeBullet(b)),
        }));
        return { ...block, data: items } as ResumeBlock;
      }
      if (block.type === "summary") {
        return {
          ...block,
          data: cleanText(block.data as string),
        } as ResumeBlock;
      }
      return block;
    });
    setData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, lastModified: new Date().toISOString() },
      blocks: cleanedBlocks,
    }));
  };

  const [previewMode, setPreviewMode] = useState<"styled" | "plain">("styled");

  const handleCopySection = async (index: number) => {
    const block = data.blocks[index];
    let text = "";
    if (block.type === "header") {
      text = `${block.data.fullName}\n${block.data.location}\n${(
        block.data.contacts as Contact[]
      )
        .map((c) => c.value)
        .join(" | ")}`;
    } else if (block.type === "summary") {
      text = block.data as string;
    } else if (block.type === "experience") {
      text = (block.data as ExperienceItem[])
        .map(
          (item) =>
            `${item.jobTitle} | ${item.companyName}\n${
              item.startDate
            } - ${item.endDate || "Present"}\n${item.bullets.map((b: string) => `• ${b}`).join("\n")}`
        )
        .join("\n\n");
    } else if (block.type === "projects") {
      text = (block.data as ProjectItem[])
        .map(
          (item) =>
            `${item.name} | ${item.description}\n${
              item.dates
            }\n${item.bullets.map((b: string) => `• ${b}`).join("\n")}`
        )
        .join("\n\n");
    } else if (block.type === "skills") {
      text = (block.data as SkillGroup[])
        .map((s) => `${s.category}: ${s.skills.join(", ")}`)
        .join("\n");
    } else if (block.type === "education") {
      text = (block.data as EducationItem[])
        .map((e) => `${e.degree} | ${e.institution} (${e.graduationYear})`)
        .join("\n");
    }
    await navigator.clipboard.writeText(text);
    alert("Section copied to clipboard!");
  };

  const renderPlainText = () => {
    return data.blocks
      .map((block) => {
        if (block.type === "header") {
          return `${block.data.fullName.toUpperCase()}\n${
            block.data.location
          } | ${(block.data.contacts as Contact[]).map((c) => c.value).join(" | ")}\n\n`;
        }
        if (block.type === "summary") {
          return `SUMMARY\n${block.data}\n\n`;
        }
        if (block.type === "experience") {
          return `EXPERIENCE\n${(block.data as ExperienceItem[])
            .map(
              (item) =>
                `${item.jobTitle.toUpperCase()}\n${item.companyName} | ${item.startDate} - ${
                  item.endDate
                }\n${item.bullets.map((b) => `- ${b}`).join("\n")}`
            )
            .join("\n\n")}\n\n`;
        }
        if (block.type === "projects") {
          return `PROJECTS\n${(block.data as ProjectItem[])
            .map(
              (item) =>
                `${item.name.toUpperCase()}\n${item.description}\n${item.bullets
                  .map((b) => `- ${b}`)
                  .join("\n")}`
            )
            .join("\n\n")}\n\n`;
        }
        if (block.type === "skills") {
          return `SKILLS\n${(block.data as SkillGroup[])
            .map((s) => `${s.category}: ${s.skills.join(", ")}`)
            .join("\n")}\n\n`;
        }
        if (block.type === "education") {
          return `EDUCATION\n${(block.data as EducationItem[])
            .map((e) => `${e.degree} | ${e.institution} (${e.graduationYear})`)
            .join("\n")}\n\n`;
        }
        return "";
      })
      .join("");
  };

  if (!isMounted) return null;

  return (
    <div
      className={clsx(
        "min-h-screen",
        "bg-slate-50",
        "text-slate-900",
        "font-sans",
        "selection:bg-blue-100",
        "selection:text-blue-900"
      )}
    >
      <header
        className={clsx(
          "no-print",
          "sticky",
          "top-0",
          "z-50",
          "bg-white/80",
          "backdrop-blur-xl",
          "border-b",
          "border-zinc-200",
          "px-6",
          "py-4",
          "flex",
          "items-center",
          "justify-between"
        )}
      >
        <div className={clsx("flex", "items-center", "gap-4")}>
          <div
            className={clsx(
              "w-10",
              "h-10",
              "bg-slate-900",
              "rounded-xl",
              "flex",
              "items-center",
              "justify-center",
              "text-white",
              "font-black",
              "shadow-lg",
              "shadow-slate-200"
            )}
          >
            R
          </div>
          <div>
            <h1
              className={clsx(
                "text-base",
                "font-bold",
                "tracking-tight",
                "text-slate-900"
              )}
            >
              Resume Creator
            </h1>
            <p
              className={clsx(
                "text-[10px]",
                "text-slate-500",
                "font-bold",
                "uppercase",
                "tracking-[0.2em]"
              )}
            >
              Beginner First • Version 1.0.0
            </p>
          </div>
        </div>

        <div className={clsx("flex", "items-center", "gap-3")}>
          <div
            className={clsx(
              "hidden",
              "md:flex",
              "bg-slate-100",
              "p-1",
              "rounded-xl",
              "border",
              "border-slate-200"
            )}
          >
            {(["minimalist", "professional", "international"] as const).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveLayout(t);
                    setData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, theme: t },
                    }));
                  }}
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all capitalize cursor-pointer ${
                    activeLayout === t
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              )
            )}
          </div>

          <div className={clsx("w-px", "h-6", "bg-slate-200", "mx-1")} />

          <button
            onClick={autoClean}
            className={clsx(
              "group",
              "relative",
              "flex",
              "items-center",
              "gap-2",
              "px-5",
              "py-2.5",
              "bg-slate-900",
              "text-white",
              "rounded-full",
              "text-xs",
              "font-bold",
              "hover:bg-slate-800",
              "active:scale-95",
              "transition-all",
              "shadow-md",
              "shadow-slate-100",
              "cursor-pointer"
            )}
          >
            Clean All
          </button>

          <button
            onClick={handleExportPDF}
            className={clsx(
              "flex",
              "items-center",
              "gap-2",
              "px-5",
              "py-2.5",
              "border",
              "border-zinc-200",
              "bg-white",
              "text-slate-900",
              "rounded-full",
              "text-xs",
              "font-bold",
              "hover:bg-slate-50",
              "active:scale-95",
              "transition-all",
              "shadow-sm",
              "cursor-pointer"
            )}
          >
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </header>

      <main
        className={clsx(
          "max-w-[1600px]",
          "mx-auto",
          "grid",
          "grid-cols-1",
          "lg:grid-cols-2",
          "gap-0",
          "min-h-[calc(100vh-80px)]"
        )}
      >
        {/* Editor Side */}
        <div
          className={clsx(
            "no-print",
            "p-8",
            "lg:p-12",
            "bg-[#F8F9FA]/50",
            "border-r",
            "border-zinc-200",
            "overflow-y-auto",
            "max-h-[calc(100vh-80px)]",
            "custom-scrollbar"
          )}
        >
          <div
            className={clsx("max-w-[700px]", "mx-auto", "space-y-10", "pb-20")}
          >
            <div
              className={clsx(
                "flex",
                "items-end",
                "justify-between",
                "border-b",
                "border-zinc-200",
                "pb-4",
                "mb-2"
              )}
            >
              <div>
                <h2
                  className={clsx(
                    "text-3xl",
                    "font-black",
                    "tracking-tight",
                    "text-slate-900",
                    "mb-1"
                  )}
                >
                  Editor
                </h2>
                <p className={clsx("text-sm", "text-slate-500", "font-medium")}>
                  Structure is set. Focus on your story.
                </p>
              </div>
              <div className={clsx("flex", "gap-2")}>
                {(["projects", "certifications", "custom"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className={clsx(
                        "text-[11px]",
                        "font-bold",
                        "text-slate-700",
                        "bg-white",
                        "border",
                        "border-zinc-200",
                        "px-3",
                        "py-1.5",
                        "rounded-lg",
                        "hover:border-slate-400",
                        "flex",
                        "items-center",
                        "gap-1.5",
                        "transition-all",
                        "active:scale-95"
                      )}
                    >
                      <Plus size={12} />{" "}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {data.blocks.map((block, bIdx) => {
              const mandatory = [
                "header",
                "summary",
                "experience",
                "skills",
                "education",
              ];
              const isMandatory = mandatory.includes(block.type);

              return (
                <div
                  key={bIdx}
                  className={clsx(
                    "bg-white",
                    "rounded-[24px]",
                    "border",
                    "border-zinc-200",
                    "shadow-sm",
                    "p-8",
                    "group",
                    "relative",
                    "hover:border-slate-300",
                    "transition-all"
                  )}
                >
                  <div
                    className={clsx(
                      "flex",
                      "items-center",
                      "justify-between",
                      "mb-6"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex",
                        "items-center",
                        "gap-2",
                        "text-slate-400"
                      )}
                    >
                      <span
                        className={clsx(
                          "text-[10px]",
                          "font-black",
                          "uppercase",
                          "tracking-[0.2em]"
                        )}
                      >
                        {block.type}
                      </span>
                      {isMandatory && (
                        <span
                          className={clsx(
                            "bg-slate-100",
                            "text-slate-500",
                            "text-[9px]",
                            "px-2",
                            "py-0.5",
                            "rounded-full",
                            "font-bold"
                          )}
                        >
                          REQUIRED
                        </span>
                      )}
                    </div>
                    <div className={clsx("flex", "items-center", "gap-2")}>
                      <button
                        onClick={() => handleCopySection(bIdx)}
                        className={clsx(
                          "opacity-0",
                          "group-hover:opacity-100",
                          "p-2",
                          "text-slate-400",
                          "hover:text-slate-900",
                          "hover:bg-slate-100",
                          "rounded-full",
                          "transition-all",
                          "cursor-pointer"
                        )}
                        title="Copy Section Text"
                      >
                        <Copy size={14} />
                      </button>
                      {!isMandatory && (
                        <button
                          onClick={() => removeBlock(bIdx)}
                          className={clsx(
                            "opacity-0",
                            "group-hover:opacity-100",
                            "p-2",
                            "text-slate-400",
                            "hover:text-red-500",
                            "hover:bg-red-50",
                            "rounded-full",
                            "transition-all",
                            "cursor-pointer"
                          )}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {block.type === "header" && (
                    <div className="space-y-6">
                      <input
                        className={clsx(
                          "w-full",
                          "text-3xl",
                          "font-black",
                          "border-none",
                          "p-0",
                          "focus:ring-0",
                          "placeholder-slate-200",
                          "text-slate-900"
                        )}
                        value={block.data.fullName}
                        onChange={(e) =>
                          updateBlock(bIdx, {
                            ...block.data,
                            fullName: e.target.value,
                          })
                        }
                        placeholder="Full Name"
                      />
                      <div
                        className={clsx(
                          "grid",
                          "grid-cols-1",
                          "md:grid-cols-2",
                          "gap-6"
                        )}
                      >
                        <div
                          className={clsx(
                            "flex",
                            "items-center",
                            "gap-3",
                            "text-slate-500",
                            "focus-within:text-slate-900",
                            "transition-colors"
                          )}
                        >
                          <Mail size={16} />
                          <input
                            className={clsx(
                              "flex-1",
                              "text-sm",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "placeholder-slate-200"
                            )}
                            value={
                              block.data.contacts.find(
                                (c: Contact) => c.type === "email"
                              )?.value || ""
                            }
                            onChange={(e) => {
                              const newContacts = [...block.data.contacts];
                              const idx = newContacts.findIndex(
                                (c: Contact) => c.type === "email"
                              );
                              if (idx > -1)
                                newContacts[idx].value = e.target.value;
                              else
                                newContacts.push({
                                  type: "email",
                                  value: e.target.value,
                                });
                              updateBlock(bIdx, {
                                ...block.data,
                                contacts: newContacts,
                              });
                            }}
                            placeholder="Email Address"
                          />
                        </div>
                        <div
                          className={clsx(
                            "flex",
                            "items-center",
                            "gap-3",
                            "text-slate-500",
                            "focus-within:text-slate-900",
                            "transition-colors"
                          )}
                        >
                          <Phone size={16} />
                          <input
                            className={clsx(
                              "flex-1",
                              "text-sm",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "placeholder-slate-200"
                            )}
                            value={
                              block.data.contacts.find(
                                (c: Contact) => c.type === "phone"
                              )?.value || ""
                            }
                            onChange={(e) => {
                              const newContacts = [...block.data.contacts];
                              const idx = newContacts.findIndex(
                                (c: Contact) => c.type === "phone"
                              );
                              if (idx > -1)
                                newContacts[idx].value = e.target.value;
                              else
                                newContacts.push({
                                  type: "phone",
                                  value: e.target.value,
                                });
                              updateBlock(bIdx, {
                                ...block.data,
                                contacts: newContacts,
                              });
                            }}
                            placeholder="Phone Number"
                          />
                        </div>
                        <div
                          className={clsx(
                            "flex",
                            "items-center",
                            "gap-3",
                            "text-slate-500",
                            "focus-within:text-slate-900",
                            "transition-colors"
                          )}
                        >
                          <MapPin size={16} />
                          <input
                            className={clsx(
                              "flex-1",
                              "text-sm",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "placeholder-slate-200"
                            )}
                            value={block.data.location || ""}
                            onChange={(e) =>
                              updateBlock(bIdx, {
                                ...block.data,
                                location: e.target.value,
                              })
                            }
                            placeholder="City, Country"
                          />
                        </div>
                        <div
                          className={clsx(
                            "flex",
                            "items-center",
                            "gap-3",
                            "text-slate-500",
                            "focus-within:text-slate-900",
                            "transition-colors"
                          )}
                        >
                          <ExternalLink size={16} />
                          <input
                            className={clsx(
                              "flex-1",
                              "text-sm",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "placeholder-slate-200"
                            )}
                            value={
                              block.data.contacts.find((c: Contact) =>
                                [
                                  "linkedin",
                                  "github",
                                  "website",
                                  "other",
                                ].includes(c.type)
                              )?.value || ""
                            }
                            onChange={(e) => {
                              const newContacts = [...block.data.contacts];
                              const idx = newContacts.findIndex((c: Contact) =>
                                [
                                  "linkedin",
                                  "github",
                                  "website",
                                  "other",
                                ].includes(c.type)
                              );
                              if (idx > -1)
                                newContacts[idx].value = e.target.value;
                              else
                                newContacts.push({
                                  type: "linkedin",
                                  value: e.target.value,
                                });
                              updateBlock(bIdx, {
                                ...block.data,
                                contacts: newContacts,
                              });
                            }}
                            placeholder="LinkedIn / GitHub URL"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {block.type === "summary" && (
                    <div className="space-y-4">
                      <textarea
                        className={clsx(
                          "w-full",
                          "h-24",
                          "text-sm",
                          "leading-relaxed",
                          "border-none",
                          "p-0",
                          "focus:ring-0",
                          "resize-none",
                          "placeholder-slate-200",
                          "text-slate-700"
                        )}
                        value={block.data}
                        onChange={(e) => updateBlock(bIdx, e.target.value)}
                        placeholder="Craft your high-level pitch..."
                      />
                      <div
                        className={clsx(
                          "flex",
                          "items-center",
                          "gap-2",
                          "p-3",
                          "bg-blue-50/50",
                          "rounded-xl",
                          "text-[11px]",
                          "text-blue-600",
                          "font-bold",
                          "border",
                          "border-blue-100"
                        )}
                      >
                        <Info size={14} /> Note: Briefly touch on your role and
                        biggest value proposition.
                      </div>
                    </div>
                  )}

                  {block.type === "experience" && (
                    <div className="space-y-8">
                      {block.data.map((item: ExperienceItem, iIdx: number) => (
                        <div
                          key={iIdx}
                          className={clsx(
                            "space-y-6",
                            "relative",
                            "group/item"
                          )}
                        >
                          <div
                            className={clsx(
                              "grid",
                              "grid-cols-1",
                              "md:grid-cols-2",
                              "gap-4"
                            )}
                          >
                            <input
                              className={clsx(
                                "text-lg",
                                "font-bold",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "placeholder-slate-200",
                                "text-slate-900"
                              )}
                              value={item.jobTitle}
                              onChange={(e) => {
                                const newData = [...block.data];
                                newData[iIdx] = {
                                  ...item,
                                  jobTitle: e.target.value,
                                };
                                updateBlock(bIdx, newData);
                              }}
                              placeholder="Title"
                            />
                            <div className="md:text-right">
                              <input
                                className={clsx(
                                  "text-sm",
                                  "font-bold",
                                  "border-none",
                                  "p-0",
                                  "focus:ring-0",
                                  "placeholder-slate-200",
                                  "text-slate-500"
                                )}
                                value={item.startDate}
                                onChange={(e) => {
                                  const newData = [...block.data];
                                  newData[iIdx] = {
                                    ...item,
                                    startDate: e.target.value,
                                  };
                                  updateBlock(bIdx, newData);
                                }}
                                placeholder="Start Date"
                              />
                              <span className={clsx("mx-2", "text-slate-300")}>
                                —
                              </span>
                              <input
                                className={clsx(
                                  "text-sm",
                                  "font-bold",
                                  "border-none",
                                  "p-0",
                                  "focus:ring-0",
                                  "placeholder-slate-200",
                                  "text-slate-500"
                                )}
                                value={item.endDate || ""}
                                onChange={(e) => {
                                  const newData = [...block.data];
                                  newData[iIdx] = {
                                    ...item,
                                    endDate: e.target.value,
                                    isCurrent:
                                      e.target.value.toLowerCase() ===
                                      "present",
                                  };
                                  updateBlock(bIdx, newData);
                                }}
                                placeholder="End Date"
                              />
                            </div>
                          </div>
                          <input
                            className={clsx(
                              "w-full",
                              "text-xs",
                              "font-bold",
                              "uppercase",
                              "tracking-widest",
                              "text-slate-400",
                              "border-none",
                              "p-0",
                              "focus:ring-0"
                            )}
                            value={item.companyName}
                            onChange={(e) => {
                              const newData = [...block.data];
                              newData[iIdx] = {
                                ...item,
                                companyName: e.target.value,
                              };
                              updateBlock(bIdx, newData);
                            }}
                            placeholder="Company"
                          />

                          <div className="space-y-4">
                            {item.bullets.map((bullet, bulIdx) => {
                              const hints = analyzeBullet(bullet);
                              return (
                                <div key={bulIdx} className="space-y-2">
                                  <div
                                    className={clsx(
                                      "flex",
                                      "gap-3",
                                      "items-start",
                                      "group/bullet"
                                    )}
                                  >
                                    <div
                                      className={clsx(
                                        "mt-2.5",
                                        "w-1.5",
                                        "h-1.5",
                                        "bg-blue-500",
                                        "rounded-full",
                                        "shrink-0",
                                        "shadow-sm"
                                      )}
                                    />
                                    <textarea
                                      className={clsx(
                                        "flex-1",
                                        "text-sm",
                                        "border-none",
                                        "p-0",
                                        "focus:ring-0",
                                        "resize-none",
                                        "min-h-6",
                                        "bg-transparent",
                                        "text-slate-700"
                                      )}
                                      value={bullet}
                                      onChange={(e) => {
                                        const newData = [...block.data];
                                        newData[iIdx].bullets[bulIdx] =
                                          e.target.value;
                                        updateBlock(bIdx, newData);
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        const newData = [...block.data];
                                        newData[iIdx].bullets =
                                          item.bullets.filter(
                                            (_, k) => k !== bulIdx
                                          );
                                        updateBlock(bIdx, newData);
                                      }}
                                      className={clsx(
                                        "opacity-0",
                                        "group-hover/bullet:opacity-100",
                                        "p-1",
                                        "text-slate-300",
                                        "hover:text-red-500",
                                        "transition-all"
                                      )}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                  {hints.length > 0 && (
                                    <div
                                      className={clsx(
                                        "pl-[26px]",
                                        "flex",
                                        "flex-wrap",
                                        "gap-2"
                                      )}
                                    >
                                      {hints.map((hint, hIdx) => (
                                        <span
                                          key={hIdx}
                                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1.5 ${
                                            hint.type === "warning"
                                              ? "text-amber-600 bg-amber-50 border border-amber-100"
                                              : "text-indigo-600 bg-indigo-50 border border-indigo-100"
                                          }`}
                                        >
                                          {hint.type === "warning" ? (
                                            <AlertTriangle size={10} />
                                          ) : (
                                            <Info size={10} />
                                          )}
                                          {hint.message}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            <button
                              onClick={() => {
                                const newData = [...block.data];
                                newData[iIdx].bullets.push("");
                                updateBlock(bIdx, newData);
                              }}
                              className={clsx(
                                "ml-[26px]",
                                "text-[10px]",
                                "font-black",
                                "uppercase",
                                "tracking-widest",
                                "text-blue-600",
                                "hover:text-blue-800",
                                "transition-colors",
                                "flex",
                                "items-center",
                                "gap-1.5"
                              )}
                            >
                              <Plus size={10} /> Add Bullet
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const newData = block.data.filter(
                                (_, i) => i !== iIdx
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-4",
                              "top-0",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-slate-300",
                              "hover:text-red-400",
                              "transition-all"
                            )}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newItem: ExperienceItem = {
                            jobTitle: "New Role",
                            companyName: "Company",
                            startDate: "Date",
                            bullets: [],
                            isCurrent: false,
                          };
                          updateBlock(bIdx, [...block.data, newItem]);
                        }}
                        className={clsx(
                          "w-full",
                          "py-4",
                          "border-2",
                          "border-dashed",
                          "border-slate-100",
                          "rounded-2xl",
                          "text-[11px]",
                          "font-black",
                          "uppercase",
                          "tracking-widest",
                          "text-slate-400",
                          "hover:text-slate-600",
                          "hover:border-slate-200",
                          "hover:bg-slate-50",
                          "transition-all"
                        )}
                      >
                        + New Experience Item
                      </button>
                    </div>
                  )}

                  {block.type === "projects" && (
                    <div className="space-y-8">
                      {block.data.map((item: ProjectItem, iIdx: number) => (
                        <div
                          key={iIdx}
                          className={clsx(
                            "space-y-6",
                            "relative",
                            "group/item"
                          )}
                        >
                          <div
                            className={clsx(
                              "grid",
                              "grid-cols-1",
                              "md:grid-cols-2",
                              "gap-4"
                            )}
                          >
                            <input
                              className={clsx(
                                "text-lg",
                                "font-bold",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "placeholder-slate-200",
                                "text-slate-900"
                              )}
                              value={item.name}
                              onChange={(e) => {
                                const newData = [...block.data];
                                newData[iIdx] = {
                                  ...item,
                                  name: e.target.value,
                                };
                                updateBlock(bIdx, newData);
                              }}
                              placeholder="Project Name"
                            />
                            <div className="md:text-right">
                              <input
                                className={clsx(
                                  "text-sm",
                                  "font-bold",
                                  "border-none",
                                  "p-0",
                                  "focus:ring-0",
                                  "placeholder-slate-200",
                                  "text-slate-500"
                                )}
                                value={item.dates || ""}
                                onChange={(e) => {
                                  const newData = [...block.data];
                                  newData[iIdx] = {
                                    ...item,
                                    dates: e.target.value,
                                  };
                                  updateBlock(bIdx, newData);
                                }}
                                placeholder="Dates"
                              />
                            </div>
                          </div>
                          <input
                            className={clsx(
                              "w-full",
                              "text-xs",
                              "font-bold",
                              "uppercase",
                              "tracking-widest",
                              "text-slate-400",
                              "border-none",
                              "p-0",
                              "focus:ring-0"
                            )}
                            value={item.description || ""}
                            onChange={(e) => {
                              const newData = [...block.data];
                              newData[iIdx] = {
                                ...item,
                                description: e.target.value,
                              };
                              updateBlock(bIdx, newData);
                            }}
                            placeholder="Project Description"
                          />

                          <div className="space-y-4">
                            {item.bullets.map((bullet, bulIdx) => {
                              const hints = analyzeBullet(bullet);
                              return (
                                <div key={bulIdx} className="space-y-2">
                                  <div
                                    className={clsx(
                                      "flex",
                                      "gap-3",
                                      "items-start",
                                      "group/bullet"
                                    )}
                                  >
                                    <div
                                      className={clsx(
                                        "mt-2.5",
                                        "w-1.5",
                                        "h-1.5",
                                        "bg-blue-500",
                                        "rounded-full",
                                        "shrink-0",
                                        "shadow-sm"
                                      )}
                                    />
                                    <textarea
                                      className={clsx(
                                        "flex-1",
                                        "text-sm",
                                        "border-none",
                                        "p-0",
                                        "focus:ring-0",
                                        "resize-none",
                                        "min-h-6",
                                        "bg-transparent",
                                        "text-slate-700"
                                      )}
                                      value={bullet}
                                      onChange={(e) => {
                                        const newData = [...block.data];
                                        newData[iIdx].bullets[bulIdx] =
                                          e.target.value;
                                        updateBlock(bIdx, newData);
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        const newData = [...block.data];
                                        newData[iIdx].bullets =
                                          item.bullets.filter(
                                            (_, k) => k !== bulIdx
                                          );
                                        updateBlock(bIdx, newData);
                                      }}
                                      className={clsx(
                                        "opacity-0",
                                        "group-hover/bullet:opacity-100",
                                        "p-1",
                                        "text-slate-300",
                                        "hover:text-red-500",
                                        "transition-all"
                                      )}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                  {hints.length > 0 && (
                                    <div
                                      className={clsx(
                                        "pl-[26px]",
                                        "flex",
                                        "flex-wrap",
                                        "gap-2"
                                      )}
                                    >
                                      {hints.map((hint, hIdx) => (
                                        <span
                                          key={hIdx}
                                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1.5 ${
                                            hint.type === "warning"
                                              ? "text-amber-600 bg-amber-50 border border-amber-100"
                                              : "text-indigo-600 bg-indigo-50 border border-indigo-100"
                                          }`}
                                        >
                                          {hint.type === "warning" ? (
                                            <AlertTriangle size={10} />
                                          ) : (
                                            <Info size={10} />
                                          )}
                                          {hint.message}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            <button
                              onClick={() => {
                                const newData = [...block.data];
                                newData[iIdx].bullets.push("");
                                updateBlock(bIdx, newData);
                              }}
                              className={clsx(
                                "ml-[26px]",
                                "text-[10px]",
                                "font-black",
                                "uppercase",
                                "tracking-widest",
                                "text-blue-600",
                                "hover:text-blue-800",
                                "transition-colors",
                                "flex",
                                "items-center",
                                "gap-1.5"
                              )}
                            >
                              <Plus size={10} /> Add Bullet
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const newData = block.data.filter(
                                (_, i) => i !== iIdx
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-4",
                              "top-0",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-slate-300",
                              "hover:text-red-400",
                              "transition-all"
                            )}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newItem: ProjectItem = {
                            name: "New Project",
                            description: "Summary",
                            bullets: [],
                          };
                          updateBlock(bIdx, [...block.data, newItem]);
                        }}
                        className={clsx(
                          "w-full",
                          "py-4",
                          "border-2",
                          "border-dashed",
                          "border-slate-100",
                          "rounded-2xl",
                          "text-[11px]",
                          "font-black",
                          "uppercase",
                          "tracking-widest",
                          "text-slate-400",
                          "hover:text-slate-600",
                          "hover:border-slate-200",
                          "hover:bg-slate-50",
                          "transition-all"
                        )}
                      >
                        + New Project Item
                      </button>
                    </div>
                  )}

                  {block.type === "skills" && (
                    <div className="space-y-8">
                      {block.data.map((group, iIdx) => (
                        <div
                          key={iIdx}
                          className={clsx("space-y-3", "group/skill")}
                        >
                          <div
                            className={clsx(
                              "flex",
                              "items-center",
                              "justify-between"
                            )}
                          >
                            <input
                              className={clsx(
                                "text-[10px]",
                                "font-black",
                                "uppercase",
                                "tracking-[0.2em]",
                                "text-slate-400",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "w-full"
                              )}
                              value={group.category}
                              onChange={(e) => {
                                const newData = [...block.data];
                                newData[iIdx] = {
                                  ...group,
                                  category: e.target.value,
                                };
                                updateBlock(bIdx, newData);
                              }}
                            />
                            <button
                              onClick={() => {
                                const newData = block.data.filter(
                                  (_, i) => i !== iIdx
                                );
                                updateBlock(bIdx, newData);
                              }}
                              className={clsx(
                                "opacity-0",
                                "group-hover/skill:opacity-100",
                                "p-1",
                                "text-slate-300",
                                "hover:text-red-400",
                                "transition-all"
                              )}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <textarea
                            className={clsx(
                              "w-full",
                              "text-sm",
                              "font-medium",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "text-slate-700",
                              "bg-transparent",
                              "resize-none",
                              "overflow-hidden",
                              "h-6"
                            )}
                            value={group.skills.join(", ")}
                            onChange={(e) => {
                              const newData = [...block.data];
                              newData[iIdx] = {
                                ...group,
                                skills: e.target.value
                                  .split(",")
                                  .map((s) => s.trim()),
                              };
                              updateBlock(bIdx, newData);
                            }}
                            placeholder="Skill 1, Skill 2, Skill 3..."
                          />
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          updateBlock(bIdx, [
                            ...block.data,
                            { category: "Category", skills: [] },
                          ])
                        }
                        className={clsx(
                          "w-full",
                          "py-3",
                          "border",
                          "border-dashed",
                          "border-slate-100",
                          "rounded-xl",
                          "text-[10px]",
                          "font-black",
                          "uppercase",
                          "tracking-widest",
                          "text-slate-400",
                          "hover:text-slate-600",
                          "transition-all"
                        )}
                      >
                        + New Skills Group
                      </button>
                    </div>
                  )}

                  {block.type === "education" && (
                    <div className="space-y-8">
                      {block.data.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className={clsx(
                            "space-y-4",
                            "group/item",
                            "relative"
                          )}
                        >
                          <div
                            className={clsx(
                              "grid",
                              "grid-cols-1",
                              "md:grid-cols-[1fr_100px]",
                              "gap-4"
                            )}
                          >
                            <input
                              className={clsx(
                                "text-lg",
                                "font-bold",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "placeholder-slate-200",
                                "text-slate-900"
                              )}
                              value={item.institution}
                              onChange={(e) => {
                                const newData = [...block.data];
                                newData[iIdx] = {
                                  ...item,
                                  institution: e.target.value,
                                };
                                updateBlock(bIdx, newData);
                              }}
                              placeholder="Institution Name"
                            />
                            <input
                              className={clsx(
                                "md:text-right",
                                "text-sm",
                                "font-bold",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "placeholder-slate-200",
                                "text-slate-500"
                              )}
                              value={item.graduationYear}
                              onChange={(e) => {
                                const newData = [...block.data];
                                newData[iIdx] = {
                                  ...item,
                                  graduationYear: e.target.value,
                                };
                                updateBlock(bIdx, newData);
                              }}
                              placeholder="Year"
                            />
                          </div>
                          <input
                            className={clsx(
                              "w-full",
                              "text-sm",
                              "font-medium",
                              "italic",
                              "text-slate-500",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "placeholder-slate-200"
                            )}
                            value={item.degree}
                            onChange={(e) => {
                              const newData = [...block.data];
                              newData[iIdx] = {
                                ...item,
                                degree: e.target.value,
                              };
                              updateBlock(bIdx, newData);
                            }}
                            placeholder="Type of Degree / Major"
                          />
                          <button
                            onClick={() => {
                              const newData = block.data.filter(
                                (_, i) => i !== iIdx
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-4",
                              "top-0",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-slate-300",
                              "hover:text-red-400",
                              "transition-all"
                            )}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          updateBlock(bIdx, [
                            ...block.data,
                            {
                              degree: "Degree",
                              institution: "University",
                              graduationYear: "20XX",
                            },
                          ])
                        }
                        className={clsx(
                          "w-full",
                          "py-4",
                          "border-2",
                          "border-dashed",
                          "border-slate-100",
                          "rounded-2xl",
                          "text-[11px]",
                          "font-black",
                          "uppercase",
                          "tracking-widest",
                          "text-slate-400",
                          "hover:text-slate-600",
                          "hover:border-slate-200",
                          "transition-all"
                        )}
                      >
                        + New Education
                      </button>
                    </div>
                  )}

                  {block.type === "certifications" && (
                    <div className="space-y-6">
                      {block.data.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className={clsx(
                            "flex",
                            "gap-4",
                            "items-center",
                            "group/item",
                            "relative"
                          )}
                        >
                          <input
                            className={clsx(
                              "flex-1",
                              "font-bold",
                              "text-sm",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "text-slate-900"
                            )}
                            value={item.name}
                            onChange={(e) => {
                              const newData = [...block.data];
                              newData[iIdx] = { ...item, name: e.target.value };
                              updateBlock(bIdx, newData);
                            }}
                            placeholder="Certification Name"
                          />
                          <input
                            className={clsx(
                              "w-24",
                              "text-right",
                              "text-xs",
                              "font-bold",
                              "text-slate-400",
                              "border-none",
                              "p-0",
                              "focus:ring-0"
                            )}
                            value={item.year}
                            onChange={(e) => {
                              const newData = [...block.data];
                              newData[iIdx] = { ...item, year: e.target.value };
                              updateBlock(bIdx, newData);
                            }}
                            placeholder="Year"
                          />
                          <button
                            onClick={() => {
                              const newData = block.data.filter(
                                (_, i) => i !== iIdx
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-8",
                              "top-1/2",
                              "-translate-y-1/2",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-slate-300",
                              "hover:text-red-400",
                              "transition-all"
                            )}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          updateBlock(bIdx, [
                            ...block.data,
                            {
                              name: "New Certification",
                              issuer: "Issuer",
                              year: "20XX",
                            },
                          ])
                        }
                        className={clsx(
                          "w-full",
                          "py-4",
                          "border",
                          "border-dashed",
                          "border-slate-100",
                          "rounded-xl",
                          "text-[11px]",
                          "font-black",
                          "uppercase",
                          "tracking-widest",
                          "text-slate-400",
                          "hover:text-slate-600",
                          "transition-all"
                        )}
                      >
                        + New Certification
                      </button>
                    </div>
                  )}

                  {block.type === "custom" && (
                    <div className="space-y-4">
                      <input
                        className={clsx(
                          "w-full",
                          "font-black",
                          "uppercase",
                          "tracking-[0.2em]",
                          "text-[10px]",
                          "text-slate-400",
                          "border-none",
                          "p-0",
                          "focus:ring-0"
                        )}
                        value={block.data.title}
                        onChange={(e) =>
                          updateBlock(bIdx, {
                            ...block.data,
                            title: e.target.value,
                          })
                        }
                        placeholder="SECTION TITLE"
                      />
                      <textarea
                        className={clsx(
                          "w-full",
                          "h-32",
                          "text-sm",
                          "leading-relaxed",
                          "border-none",
                          "p-0",
                          "focus:ring-0",
                          "resize-none",
                          "placeholder-slate-200",
                          "text-slate-700"
                        )}
                        value={block.data.content}
                        onChange={(e) =>
                          updateBlock(bIdx, {
                            ...block.data,
                            content: e.target.value,
                          })
                        }
                        placeholder="Your custom content..."
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview Side */}
        <div className="bg-white overflow-hidden max-h-[calc(100vh-80px)] border-l border-zinc-200 flex flex-col items-center">
          {/* Refined Toolbar */}
          <div className="no-print sticky top-0 z-20 w-full flex justify-between items-center bg-white border-b border-zinc-100 px-8 py-4 shadow-sm transition-all">
            <div className="flex items-center gap-6">
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setPreviewMode("styled")}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer uppercase tracking-wider ${previewMode === "styled" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Styled
                </button>
                <button
                  onClick={() => setPreviewMode("plain")}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer uppercase tracking-wider ${previewMode === "plain" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Plain Text
                </button>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <span className="text-emerald-600 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                <Check size={12} strokeWidth={3} /> ATS Optimized
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleCopy}
                className="group flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                {isCopied ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  <Copy size={12} />
                )}
                <span>{isCopied ? "Copied!" : "Quick Copy Full"}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full overflow-y-auto p-4 lg:p-12 custom-scrollbar flex flex-col items-center pt-12 bg-zinc-100">
            <div
              id="resume-preview"
              className={`transform scale-[0.75] md:scale-[0.8] lg:scale-[0.85] xl:scale-[0.9] 2xl:scale-[1] origin-top transition-all duration-500 h-fit mb-40 shadow-[0_0_80px_-15px_rgba(0,0,0,0.15)] ${previewMode === "plain" ? "bg-white p-12 w-[210mm] min-h-[297mm] shadow-none rounded-none text-left" : ""}`}
            >
              {previewMode === "plain" ? (
                <pre className="whitespace-pre-wrap font-mono text-sm text-[#334155]">
                  {renderPlainText()}
                </pre>
              ) : (
                <>
                  {activeLayout === "minimalist" && (
                    <ATSMinimalist data={data} />
                  )}
                  {activeLayout === "professional" && (
                    <ModernProfessional data={data} />
                  )}
                  {activeLayout === "international" && (
                    <InternationalFormat data={data} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
