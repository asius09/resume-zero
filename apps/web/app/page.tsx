"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";

import {
  Plus,
  Trash2,
  Check,
  Info,
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
import { normalizeBullet, cleanText } from "@resume/cleaner";
import type {
  ResumeData,
  ResumeBlock,
  ResumeSectionType,
  Contact,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  EducationItem,
  LanguageItem,
  CertificationItem,
  CustomBlock,
} from "@resume/types";

const INITIAL_DATA: ResumeData = {
  id: crypto.randomUUID(),
  version: 1,
  metadata: {
    theme: "minimalist",
    images: ["/og-image.png"],
    icons: {
      icon: "/icon.svg",
      apple: "/icon.png",
    },
    region: "IN",
    lastModified: new Date().toISOString(),
  },
  blocks: [
    {
      type: "header",
      data: {
        fullName: "Adiba Firoz",
        location: "Karol Bagh, Delhi, India",
        contacts: [
          { type: "phone", value: "+91 95825 76055" },
          { type: "email", value: "adibafiroz2001@gmail.com" },
          {
            type: "linkedin",
            value: "linkedin.com/in/adiba-firoz-641984258/",
          },
        ],
      },
    },
    {
      type: "summary",
      data: "Patient-focused Front Office Executive with over a year of experience in high-volume medical environments at BLK-Max Super Speciality Hospital. Expert in managing patient billing, insurance verification, and coordinating complex clinical flow. Dedicated to providing calm, professional, and efficient front-desk assistance while ensuring accurate records management and exceptional patient care.",
    },
    {
      type: "experience",
      data: [
        {
          jobTitle: "Front Office Executive",
          companyName: "BLK-Max Super Speciality Hospital",
          location: "Delhi, India",
          startDate: "Jan 2024",
          endDate: "Present",
          isCurrent: true,
          bullets: [
            "Manage patient billing, payment processing, and basic insurance checks including verification of government bills.",
            "Guide patients at the front desk with registration, appointments, and general inquiries.",
            "Coordinate with clinical and support teams to ensure smooth and timely patient flow.",
            "Maintain accurate patient records and provide clear information to patients and their families.",
            "Ensure a polite and calm front desk experience during high-volume busy hours.",
            "Handle incoming calls and support faster overall service delivery.",
          ],
        },
      ],
    },
    {
      type: "skills",
      data: [
        {
          category: "Professional Skills",
          skills: [
            "Patient Reception",
            "Hospital Billing",
            "Insurance Verification",
            "Appointment Scheduling",
            "Records Management",
            "Documentation",
            "Patient Communication",
          ],
        },
        {
          category: "Computer Skills",
          skills: ["Microsoft Excel", "Microsoft Word", "Tally Software"],
        },
      ],
    },
    {
      type: "education",
      data: [
        {
          degree: "MBA in Operations Management",
          institution: "Pursuing",
          graduationYear: "2025 (Expected)",
        },
        {
          degree: "Bachelor of Arts",
          institution: "University of Delhi",
          graduationYear: "2021",
        },
        {
          degree: "Higher Secondary Education (C.B.S.E)",
          institution: "Delhi",
          graduationYear: "2018",
        },
      ],
    },
    {
      type: "languages",
      data: [
        { language: "Hindi", proficiency: "Native" },
        { language: "English", proficiency: "Intermediate" },
      ],
    },
    {
      type: "personal",
      data: [
        { label: "Full Name", value: "Adiba Firoz" },
        { label: "Father's Name", value: "Mr. Firoz" },
        { label: "Date of Birth", value: "19 December 2001" },
        { label: "Gender", value: "Female" },
        { label: "Marital Status", value: "Unmarried" },
        { label: "Nationality", value: "Indian" },
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
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  // Load from LocalStorage once on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id) {
          // Robust data migration for personal block
          if (parsed.blocks) {
            parsed.blocks = parsed.blocks.map((block: any) => {
              if (block.type === "personal" && !Array.isArray(block.data)) {
                return {
                  ...block,
                  data: Object.entries(block.data || {}).map(
                    ([key, value]) => ({
                      label: key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase()),
                      value: String(value),
                    }),
                  ),
                };
              }
              return block;
            });
          }
          // Wrapped in setTimeout to avoid the linter warning about sync setState in effects
          setTimeout(() => {
            setData(parsed);
          }, 0);
        }
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setTimeout(() => {
      setIsMounted(true);
    }, 0);
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

  const handleExportPDF = () => {
    window.print();
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
      case "languages":
        newBlock = {
          type: "languages",
          data: [
            {
              language: "English",
              proficiency: "Native",
            },
          ],
        };
        break;
      case "personal":
        newBlock = {
          type: "personal",
          data: [
            { label: "Date of Birth", value: "" },
            { label: "Gender", value: "" },
            { label: "Father's Name", value: "" },
            { label: "Marital Status", value: "" },
            { label: "Nationality", value: "Indian" },
          ],
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
    if (block && mandatory.includes(block.type)) {
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
            } - ${item.endDate || "Present"}\n${item.bullets.map((b: string) => `• ${b}`).join("\n")}`,
        )
        .join("\n\n");
    } else if (block.type === "projects") {
      text = (block.data as ProjectItem[])
        .map(
          (item) =>
            `${item.name} | ${item.description}\n${
              item.dates
            }\n${item.bullets.map((b: string) => `• ${b}`).join("\n")}`,
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
                }\n${item.bullets.map((b) => `- ${b}`).join("\n")}`,
            )
            .join("\n\n")}\n\n`;
        }
        if (block.type === "projects") {
          return `PROJECTS\n${(block.data as ProjectItem[])
            .map(
              (item) =>
                `${item.name.toUpperCase()}\n${item.description}\n${item.bullets
                  .map((b) => `- ${b}`)
                  .join("\n")}`,
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
        if (block.type === "languages") {
          return `LANGUAGES\n${(block.data as LanguageItem[])
            .map((l) => `${l.language} - ${l.proficiency}`)
            .join("\n")}\n\n`;
        }
        if (block.type === "certifications") {
          return `CERTIFICATIONS\n${(block.data as CertificationItem[])
            .map((c) => `${c.name} - ${c.issuer} (${c.year})`)
            .join("\n")}\n\n`;
        }
        if (block.type === "custom") {
          const b = block.data as CustomBlock;
          return `${b.title.toUpperCase()}\n${b.content}\n\n`;
        }
        if (block.type === "personal") {
          const p = block.data;
          return `PERSONAL DETAILS\nDOB: ${p.dateOfBirth}\n${p.gender}\n${p.nationality}\n\n`;
        }
        return "";
      })
      .join("");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 selection:text-black">
      <header className="no-print sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-dashed border-zinc-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Resume: Zero Logo"
            width={32}
            height={32}
            className="rounded-lg shadow-sm border border-zinc-100"
          />
          <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[14px] font-semibold tracking-tight text-zinc-900 leading-none">
                Resume: Zero
              </h1>
              <span className="text-zinc-300">/</span>
              <span className="text-[14px] font-medium text-zinc-700">
                My Resume
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">
              v1.0 • ATS Optimized
            </p>
          </div>
        </div>

        <div className={clsx("flex", "items-center", "gap-3")}>
          <div
            className={clsx(
              "hidden",
              "md:flex",
              "bg-zinc-100/50 border border-zinc-200",
              "p-0.5",
              "rounded-lg",
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
                  className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all capitalize cursor-pointer ${
                    activeLayout === t
                      ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {t}
                </button>
              ),
            )}
          </div>

          <div className={clsx("w-px", "h-6", "bg-zinc-200", "mx-1")} />

          <button
            onClick={autoClean}
            className={clsx(
              "flex",
              "items-center",
              "gap-2",
              "px-4",
              "py-1.5",
              "bg-black",
              "text-white",
              "rounded-lg",
              "text-[11px]",
              "font-medium",
              "hover:bg-zinc-800",
              "transition-all",
              "cursor-pointer",
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
              "px-4",
              "py-1.5",
              "border",
              "border-zinc-200",
              "bg-white",
              "text-zinc-900",
              "rounded-lg",
              "text-[11px]",
              "font-medium",
              "hover:bg-zinc-50",
              "transition-all",
              "cursor-pointer",
            )}
          >
            <Download size={12} />
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
          "min-h-[calc(100vh-80px)]",
          "relative",
        )}
      >
        {/* Mobile View Toggle */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-lg p-1 shadow-2xl flex items-center border border-white/10">
          <button
            onClick={() => setMobileView("edit")}
            className={clsx(
              "px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
              mobileView === "edit" ? "bg-white text-black" : "text-white/60",
            )}
          >
            Edit
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={clsx(
              "px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
              mobileView === "preview"
                ? "bg-white text-black"
                : "text-white/60",
            )}
          >
            Preview
          </button>
        </div>

        {/* Editor Side */}
        <div
          className={clsx(
            "no-print",
            "editor-side",
            "p-6",
            "lg:p-12",
            mobileView === "edit" ? "block" : "hidden lg:block",
            "bg-[#fafafa]",
            "border-r",
            "border-zinc-200",
            "overflow-y-auto",
            "max-h-[calc(100vh-80px)]",
            "custom-scrollbar",
          )}
        >
          <div
            className={clsx("max-w-[700px]", "mx-auto", "space-y-6", "pb-20")}
          >
            <div
              className={clsx(
                "flex",
                "items-end",
                "justify-between",
                "border-b",
                "border-zinc-200",
                "pb-6",
                "mb-2",
              )}
            >
              <div>
                <h2
                  className={clsx(
                    "text-2xl",
                    "font-bold",
                    "tracking-tight",
                    "text-zinc-900",
                    "mb-1",
                  )}
                >
                  Editor
                </h2>
                <p className={clsx("text-xs", "text-zinc-600", "font-medium")}>
                  Focus on your experience. We handle the rest.
                </p>
              </div>
              <div className={clsx("flex", "flex-wrap", "gap-2")}>
                {(
                  [
                    "languages",
                    "projects",
                    "certifications",
                    "custom",
                    "personal",
                  ] as const
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className={clsx(
                      "text-[11px]",
                      "font-medium",
                      "text-zinc-600",
                      "bg-white",
                      "border",
                      "border-zinc-200",
                      "px-3",
                      "py-1.5",
                      "rounded-md",
                      "hover:bg-zinc-50",
                      "flex",
                      "items-center",
                      "gap-1.5",
                      "transition-all",
                      "cursor-pointer",
                    )}
                  >
                    <Plus size={12} />{" "}
                    {type === "personal"
                      ? "Personal Details"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
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
                    "rounded-lg",
                    "border",
                    "border-zinc-200",
                    "p-8",
                    "group",
                    "relative",
                    "hover:shadow-md",
                    "transition-shadow",
                  )}
                >
                  <div
                    className={clsx(
                      "flex",
                      "items-center",
                      "justify-between",
                      "mb-6",
                    )}
                  >
                    <div
                      className={clsx(
                        "flex",
                        "items-center",
                        "gap-2",
                        "text-zinc-400",
                      )}
                    >
                      <span
                        className={clsx(
                          "text-[10px]",
                          "font-black",
                          "uppercase",
                          "tracking-[0.2em]",
                        )}
                      >
                        {block.type}
                      </span>
                      {isMandatory && (
                        <span
                          className={clsx(
                            "bg-zinc-100",
                            "text-zinc-700",
                            "text-[9px]",
                            "px-2",
                            "py-0.5",
                            "rounded-md",
                            "font-bold",
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
                          "text-zinc-400",
                          "hover:text-zinc-900",
                          "hover:bg-zinc-100",
                          "rounded-md",
                          "transition-all",
                          "cursor-pointer",
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
                            "text-zinc-400",
                            "hover:text-red-500",
                            "hover:bg-red-50",
                            "rounded-md",
                            "transition-all",
                            "cursor-pointer",
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
                          "placeholder-zinc-200",
                          "text-zinc-900",
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
                          "gap-6",
                        )}
                      >
                        <div
                          className={clsx(
                            "flex",
                            "items-center",
                            "gap-3",
                            "text-zinc-500",
                            "focus-within:text-zinc-900",
                            "transition-colors",
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
                              "placeholder-zinc-200",
                            )}
                            value={
                              block.data.contacts.find(
                                (c: Contact) => c.type === "email",
                              )?.value || ""
                            }
                            onChange={(e) => {
                              const newContacts = [...block.data.contacts];
                              const idx = newContacts.findIndex(
                                (c: Contact) => c.type === "email",
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
                            "text-zinc-500",
                            "focus-within:text-zinc-900",
                            "transition-colors",
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
                              "placeholder-zinc-200",
                            )}
                            value={
                              block.data.contacts.find(
                                (c: Contact) => c.type === "phone",
                              )?.value || ""
                            }
                            onChange={(e) => {
                              const newContacts = [...block.data.contacts];
                              const idx = newContacts.findIndex(
                                (c: Contact) => c.type === "phone",
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
                            "text-zinc-500",
                            "focus-within:text-zinc-900",
                            "transition-colors",
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
                              "placeholder-zinc-200",
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
                            "text-zinc-500",
                            "focus-within:text-zinc-900",
                            "transition-colors",
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
                              "placeholder-zinc-200",
                            )}
                            value={
                              block.data.contacts.find((c: Contact) =>
                                [
                                  "linkedin",
                                  "github",
                                  "website",
                                  "other",
                                ].includes(c.type),
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
                                ].includes(c.type),
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
                          "placeholder-zinc-200",
                          "text-zinc-700",
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
                          "bg-zinc-50",
                          "rounded-lg",
                          "text-[11px]",
                          "text-zinc-600",
                          "font-medium",
                          "border",
                          "border-zinc-200",
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
                            "group/item",
                          )}
                        >
                          <div
                            className={clsx(
                              "grid",
                              "grid-cols-1",
                              "md:grid-cols-2",
                              "gap-4",
                            )}
                          >
                            <input
                              className={clsx(
                                "text-lg",
                                "font-bold",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "placeholder-zinc-200",
                                "text-zinc-900",
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
                            <div className="flex items-center justify-end gap-1">
                              <input
                                className={clsx(
                                  "text-sm",
                                  "font-bold",
                                  "border-none",
                                  "p-0",
                                  "focus:ring-0",
                                  "placeholder-zinc-200",
                                  "text-zinc-500",
                                  "text-right",
                                  "w-20",
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
                              <span className={clsx("mx-2", "text-zinc-300")}>
                                —
                              </span>
                              <input
                                className={clsx(
                                  "text-sm",
                                  "font-bold",
                                  "border-none",
                                  "p-0",
                                  "focus:ring-0",
                                  "placeholder-zinc-200",
                                  "text-zinc-500",
                                  "w-20",
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
                              "text-zinc-400",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
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
                              return (
                                <div key={bulIdx} className="space-y-2">
                                  <div
                                    className={clsx(
                                      "flex",
                                      "gap-3",
                                      "items-start",
                                      "group/bullet",
                                    )}
                                  >
                                    <div
                                      className={clsx(
                                        "shrink-0",
                                        "text-zinc-400",
                                        "text-lg",
                                        "leading-none",
                                        "mt-0.5",
                                      )}
                                    >
                                      •
                                    </div>
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
                                        "text-zinc-700",
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
                                            (_, k) => k !== bulIdx,
                                          );
                                        updateBlock(bIdx, newData);
                                      }}
                                      className={clsx(
                                        "opacity-0",
                                        "group-hover/bullet:opacity-100",
                                        "p-1",
                                        "text-zinc-300",
                                        "hover:text-red-500",
                                        "transition-all",
                                        "cursor-pointer",
                                      )}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                  {/* Hints hidden as per user request */}
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
                                "text-zinc-500",
                                "hover:text-zinc-900",
                                "transition-colors",
                                "flex",
                                "items-center",
                                "gap-1.5",
                                "cursor-pointer",
                              )}
                            >
                              <Plus size={10} /> Add Bullet
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const newData = block.data.filter(
                                (_, i) => i !== iIdx,
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-2",
                              "top-0",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-zinc-300",
                              "hover:text-red-400",
                              "transition-all",
                              "cursor-pointer",
                              "z-10",
                            )}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newItem: ExperienceItem = {
                            jobTitle: "",
                            companyName: "",
                            startDate: "",
                            endDate: "",
                            location: "",
                            isCurrent: false,
                            bullets: [""],
                          };
                          updateBlock(bIdx, [...block.data, newItem]);
                        }}
                        className={clsx(
                          "w-full",
                          "py-3",
                          "border-2",
                          "border-dashed",
                          "border-zinc-200",
                          "rounded-md",
                          "text-[11px]",
                          "font-medium",
                          "text-zinc-400",
                          "hover:text-zinc-900",
                          "hover:border-zinc-300",
                          "transition-all",
                          "cursor-pointer",
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
                            "group/item",
                          )}
                        >
                          <div
                            className={clsx(
                              "grid",
                              "grid-cols-1",
                              "md:grid-cols-2",
                              "gap-4",
                            )}
                          >
                            <input
                              className={clsx(
                                "text-lg",
                                "font-bold",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "placeholder-zinc-200",
                                "text-zinc-900",
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
                                  "placeholder-zinc-200",
                                  "text-zinc-500",
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
                              "tracking-widest",
                              "text-zinc-400",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
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
                              return (
                                <div key={bulIdx} className="space-y-2">
                                  <div
                                    className={clsx(
                                      "flex",
                                      "gap-3",
                                      "items-start",
                                      "group/bullet",
                                    )}
                                  >
                                    <div
                                      className={clsx(
                                        "shrink-0",
                                        "text-zinc-400",
                                        "text-lg",
                                        "leading-none",
                                        "mt-0.5",
                                      )}
                                    >
                                      •
                                    </div>
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
                                        "text-zinc-700",
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
                                            (_, k) => k !== bulIdx,
                                          );
                                        updateBlock(bIdx, newData);
                                      }}
                                      className={clsx(
                                        "opacity-0",
                                        "group-hover/bullet:opacity-100",
                                        "p-1",
                                        "text-zinc-300",
                                        "hover:text-red-500",
                                        "transition-all",
                                        "cursor-pointer",
                                      )}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                  {/* Hints hidden as per user request */}
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
                                "text-zinc-500",
                                "hover:text-zinc-900",
                                "transition-colors",
                                "flex",
                                "items-center",
                                "gap-1.5",
                                "cursor-pointer",
                              )}
                            >
                              <Plus size={10} /> Add Bullet
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const newData = block.data.filter(
                                (_, i) => i !== iIdx,
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-2",
                              "top-0",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-zinc-300",
                              "hover:text-red-400",
                              "transition-all",
                              "cursor-pointer",
                              "z-10",
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
                            bullets: [""],
                          };
                          updateBlock(bIdx, [...block.data, newItem]);
                        }}
                        className={clsx(
                          "w-full",
                          "py-3",
                          "border-2",
                          "border-dashed",
                          "border-zinc-200",
                          "rounded-md",
                          "text-[11px]",
                          "font-medium",
                          "text-zinc-400",
                          "hover:text-zinc-900",
                          "hover:border-zinc-300",
                          "transition-all",
                          "cursor-pointer",
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
                              "justify-between",
                            )}
                          >
                            <input
                              className={clsx(
                                "text-[10px]",
                                "font-black",
                                "tracking-[0.2em]",
                                "text-zinc-400",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "w-full",
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
                                  (_, i) => i !== iIdx,
                                );
                                updateBlock(bIdx, newData);
                              }}
                              className={clsx(
                                "opacity-0",
                                "group-hover/skill:opacity-100",
                                "p-1",
                                "text-zinc-300",
                                "hover:text-red-400",
                                "transition-all",
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
                              "text-zinc-700",
                              "bg-transparent",
                              "resize-none",
                              "overflow-hidden",
                              "h-6",
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
                          "border-zinc-100",
                          "rounded-lg",
                          "text-[10px]",
                          "font-black",
                          "uppercase",
                          "tracking-widest",
                          "text-zinc-400",
                          "hover:text-zinc-600",
                          "transition-all",
                          "cursor-pointer",
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
                            "relative",
                          )}
                        >
                          <div
                            className={clsx(
                              "grid",
                              "grid-cols-1",
                              "md:grid-cols-[1fr_100px]",
                              "gap-4",
                            )}
                          >
                            <input
                              className={clsx(
                                "text-lg",
                                "font-bold",
                                "border-none",
                                "p-0",
                                "focus:ring-0",
                                "placeholder-zinc-200",
                                "text-zinc-900",
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
                                "placeholder-zinc-200",
                                "text-zinc-500",
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
                              "text-zinc-500",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "placeholder-zinc-200",
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
                                (_, i) => i !== iIdx,
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-2",
                              "top-0",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-zinc-300",
                              "hover:text-red-400",
                              "transition-all",
                              "cursor-pointer",
                              "z-10",
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
                          "border-zinc-100",
                          "rounded-lg",
                          "text-[11px]",
                          "font-black",
                          "uppercase",
                          "tracking-widest",
                          "text-zinc-400",
                          "hover:text-zinc-600",
                          "hover:border-zinc-200",
                          "transition-all",
                          "cursor-pointer",
                        )}
                      >
                        + New Education
                      </button>
                    </div>
                  )}

                  {block.type === "languages" && (
                    <div className="space-y-6">
                      {block.data.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className={clsx(
                            "flex",
                            "gap-4",
                            "items-center",
                            "group/item",
                            "relative",
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
                              "text-zinc-900",
                            )}
                            value={item.language}
                            onChange={(e) => {
                              const newData = [...block.data];
                              newData[iIdx] = {
                                ...item,
                                language: e.target.value,
                              };
                              updateBlock(bIdx, newData);
                            }}
                            placeholder="Language (e.g. English)"
                          />
                          <select
                            className={clsx(
                              "w-32",
                              "text-right",
                              "text-xs",
                              "font-bold",
                              "text-zinc-500",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
                              "bg-transparent",
                            )}
                            value={item.proficiency}
                            onChange={(e) => {
                              const newData = [...block.data];
                              newData[iIdx] = {
                                ...item,
                                proficiency: e.target.value,
                              };
                              updateBlock(bIdx, newData);
                            }}
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                          </select>
                          <button
                            onClick={() => {
                              const newData = block.data.filter(
                                (_, i) => i !== iIdx,
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-8",
                              "top-1/2",
                              "-tranzinc-y-1/2",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-zinc-300",
                              "hover:text-red-400",
                              "transition-all",
                              "cursor-pointer",
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
                              language: "New Language",
                              proficiency: "Proficiency",
                            },
                          ])
                        }
                        className={clsx(
                          "w-full",
                          "py-3",
                          "border-2",
                          "border-dashed",
                          "border-zinc-200",
                          "rounded-md",
                          "text-[11px]",
                          "font-medium",
                          "text-zinc-400",
                          "hover:text-zinc-900",
                          "hover:border-zinc-300",
                          "transition-all",
                          "cursor-pointer",
                        )}
                      >
                        + New Language
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
                            "relative",
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
                              "text-zinc-900",
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
                              "text-zinc-400",
                              "border-none",
                              "p-0",
                              "focus:ring-0",
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
                                (_, i) => i !== iIdx,
                              );
                              updateBlock(bIdx, newData);
                            }}
                            className={clsx(
                              "absolute",
                              "-right-8",
                              "top-1/2",
                              "-tranzinc-y-1/2",
                              "opacity-0",
                              "group-hover/item:opacity-100",
                              "p-2",
                              "text-zinc-300",
                              "hover:text-red-400",
                              "transition-all",
                              "cursor-pointer",
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
                          "py-3",
                          "border-2",
                          "border-dashed",
                          "border-zinc-200",
                          "rounded-md",
                          "text-[11px]",
                          "font-medium",
                          "text-zinc-400",
                          "hover:text-zinc-900",
                          "hover:border-zinc-300",
                          "transition-all",
                          "cursor-pointer",
                        )}
                      >
                        + New Certification
                      </button>
                    </div>
                  )}

                  {block.type === "personal" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {(Array.isArray(block.data) ? block.data : []).map(
                          (item: any, iIdx: number) => (
                            <div
                              key={iIdx}
                              className="space-y-1.5 group/pitem relative"
                            >
                              <div className="flex items-center justify-between">
                                <input
                                  className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-none p-0 focus:ring-0 bg-transparent w-full"
                                  value={item.label}
                                  onChange={(e) => {
                                    const newData = [...block.data];
                                    newData[iIdx] = {
                                      ...item,
                                      label: e.target.value,
                                    };
                                    updateBlock(bIdx, newData);
                                  }}
                                  placeholder="FIELD LABEL"
                                />
                                <button
                                  onClick={() => {
                                    const newData = block.data.filter(
                                      (_: any, i: number) => i !== iIdx,
                                    );
                                    updateBlock(bIdx, newData);
                                  }}
                                  className="opacity-0 group-hover/pitem:opacity-100 p-1 text-zinc-300 hover:text-red-400 transition-all cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <input
                                className="w-full text-sm font-medium border-none p-0 focus:ring-0 bg-transparent text-zinc-900"
                                value={item.value}
                                onChange={(e) => {
                                  const newData = [...block.data];
                                  newData[iIdx] = {
                                    ...item,
                                    value: e.target.value,
                                  };
                                  updateBlock(bIdx, newData);
                                }}
                                placeholder="Value..."
                              />
                            </div>
                          ),
                        )}
                      </div>
                      <button
                        onClick={() =>
                          updateBlock(bIdx, [
                            ...block.data,
                            { label: "New Field", value: "" },
                          ])
                        }
                        className={clsx(
                          "w-full",
                          "py-3",
                          "border-2",
                          "border-dashed",
                          "border-zinc-200",
                          "rounded-md",
                          "text-[11px]",
                          "font-medium",
                          "text-zinc-400",
                          "hover:text-zinc-900",
                          "hover:border-zinc-300",
                          "transition-all",
                          "cursor-pointer",
                        )}
                      >
                        + Add Personal Detail Field
                      </button>
                    </div>
                  )}

                  {block.type === "custom" && (
                    <div className="space-y-4">
                      <input
                        className={clsx(
                          "w-full",
                          "font-black",
                          "tracking-[0.2em]",
                          "text-[10px]",
                          "text-zinc-400",
                          "border-none",
                          "p-0",
                          "focus:ring-0",
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
                          "placeholder-zinc-200",
                          "text-zinc-700",
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
        <div
          className={clsx(
            "preview-side",
            "bg-white",
            "overflow-hidden",
            "max-h-[calc(100vh-80px)]",
            "border-l",
            "border-zinc-200",
            "flex",
            "flex-col",
            "items-center",
            mobileView === "preview" ? "block" : "hidden lg:flex",
          )}
        >
          {/* Refined Toolbar */}
          <div
            className={clsx(
              "no-print",
              "sticky",
              "top-0",
              "z-20",
              "w-full",
              "flex",
              "justify-between",
              "items-center",
              "bg-white",
              "border-b",
              "border-zinc-100",
              "px-8",
              "py-4",
              "shadow-sm",
              "transition-all",
            )}
          >
            <div className={clsx("flex", "items-center", "gap-6")}>
              <div
                className={clsx(
                  "flex",
                  "bg-zinc-100",
                  "p-1",
                  "rounded-lg",
                  "border",
                  "border-zinc-200",
                )}
              >
                <button
                  onClick={() => setPreviewMode("styled")}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer uppercase tracking-wider ${previewMode === "styled" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-800"}`}
                >
                  Styled
                </button>
                <button
                  onClick={() => setPreviewMode("plain")}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer uppercase tracking-wider ${previewMode === "plain" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-800"}`}
                >
                  Plain Text
                </button>
              </div>
              <div className={clsx("h-6", "w-px", "bg-zinc-200")} />
              <span
                className={clsx(
                  "text-emerald-700",
                  "flex",
                  "items-center",
                  "gap-1.5",
                  "text-[10px]",
                  "font-bold",
                  "uppercase",
                  "tracking-widest",
                  "whitespace-nowrap",
                )}
              >
                <Check size={12} strokeWidth={3} /> ATS Optimized
              </span>
            </div>

            <div className={clsx("flex", "items-center", "gap-4")}>
              <button
                onClick={handleCopy}
                className={clsx(
                  "group",
                  "flex",
                  "items-center",
                  "gap-2",
                  "px-6",
                  "py-2",
                  "bg-zinc-900",
                  "text-white",
                  "rounded-lg",
                  "text-[10px]",
                  "font-black",
                  "uppercase",
                  "tracking-widest",
                  "hover:bg-black",
                  "active:scale-95",
                  "transition-all",
                  "shadow-md",
                  "cursor-pointer",
                  "whitespace-nowrap",
                )}
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

          <div
            className={clsx(
              "flex-1",
              "w-full",
              "overflow-y-auto",
              "p-4",
              "lg:p-12",
              "custom-scrollbar",
              "flex",
              "flex-col",
              "items-center",
              "pt-12",
              "bg-zinc-100",
            )}
          >
            <div
              id="resume-preview"
              className={`transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.85] xl:scale-[0.9] 2xl:scale-[1] print:scale-100 print:transform-none origin-top transition-all duration-500 h-fit mb-40 shadow-[0_0_80px_-15px_rgba(0,0,0,0.15)] ${previewMode === "plain" ? "bg-white p-12 w-[210mm] min-h-[297mm] shadow-none rounded-none text-left" : ""}`}
            >
              {previewMode === "plain" ? (
                <pre
                  className={clsx(
                    "whitespace-pre-wrap",
                    "font-mono",
                    "text-sm",
                    "text-[#334155]",
                  )}
                >
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
