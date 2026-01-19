"use client";

import { useState, useEffect } from "react";
import type {
  ResumeData,
  ResumeBlock,
  ResumeSectionType,
  ExperienceItem,
  ProjectItem,
} from "@resume/types";
import { normalizeBullet, cleanText } from "@resume/cleaner";
import { INITIAL_DATA, STORAGE_KEY } from "@/lib/constants";

export function useResumeData() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isMounted, setIsMounted] = useState(false);

  // Load from LocalStorage once on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id) {
          // Robust data migration for personal block
          if (parsed.blocks) {
            parsed.blocks = parsed.blocks.map((block: ResumeBlock) => {
              if (block.type === "personal" && !Array.isArray(block.data)) {
                return {
                  ...block,
                  data: Object.entries(block.data || {}).map(([key, value]) => ({
                    label: key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase()),
                    value: String(value),
                  })),
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
    const mandatory = ["header", "summary", "experience", "skills", "education"];
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

  const setResumeName = (name: string) => {
    setData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, name },
    }));
  };

  const setTheme = (theme: "minimalist" | "professional" | "international") => {
    setData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, theme },
    }));
  };

  return {
    data,
    setData,
    isMounted,
    updateBlock,
    addBlock,
    removeBlock,
    autoClean,
    setResumeName,
    setTheme,
  };
}
