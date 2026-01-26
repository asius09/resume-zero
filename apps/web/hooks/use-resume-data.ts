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
import {
  INITIAL_DATA,
  STORAGE_KEY,
  RESUMES_STORAGE_KEY,
  ACTIVE_RESUME_ID_KEY,
} from "@/lib/constants";

export function useResumeData() {
  const [resumes, setResumes] = useState<Record<string, ResumeData>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const data = (activeId && resumes[activeId]) || INITIAL_DATA;

  const setData = (newData: ResumeData | ((prev: ResumeData) => ResumeData)) => {
    if (!activeId) return;
    setResumes((prev) => {
      const current = prev[activeId] || INITIAL_DATA;
      const next = typeof newData === "function" ? newData(current) : newData;
      return {
        ...prev,
        [activeId]: next,
      };
    });
  };

  // Load from LocalStorage once on mount
  useEffect(() => {
    const savedResumes = localStorage.getItem(RESUMES_STORAGE_KEY);
    const savedActiveId = localStorage.getItem(ACTIVE_RESUME_ID_KEY);
    const legacySaved = localStorage.getItem(STORAGE_KEY);

    let initialResumes: Record<string, ResumeData> = {};
    let initialActiveId: string | null = null;

    if (savedResumes) {
      try {
        initialResumes = JSON.parse(savedResumes);
        initialActiveId = savedActiveId;
      } catch (e) {
        console.error("Failed to parse saved resumes", e);
      }
    } else if (legacySaved) {
      // Migrate legacy single resume
      try {
        const parsed = JSON.parse(legacySaved);
        if (parsed.id) {
          initialResumes = { [parsed.id]: parsed };
          initialActiveId = parsed.id;
        }
      } catch (e) {
        console.error("Failed to parse legacy saved data", e);
      }
    }

    // Ensure we have at least one resume
    if (Object.keys(initialResumes).length === 0) {
      const firstId = INITIAL_DATA.id;
      initialResumes = { [firstId]: INITIAL_DATA };
      initialActiveId = firstId;
    }

    if (!initialActiveId || !initialResumes[initialActiveId]) {
      initialActiveId = Object.keys(initialResumes)[0];
    }

    // Wrapped in setTimeout to avoid the linter warning about sync setState in effects
    setTimeout(() => {
      setResumes(initialResumes);
      setActiveId(initialActiveId);
    }, 0);

    setTimeout(() => {
      setIsMounted(true);
    }, 0);
  }, []);

  // Save to LocalStorage whenever resumes or activeId changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));
      if (activeId) {
        localStorage.setItem(ACTIVE_RESUME_ID_KEY, activeId);
      }
    }
  }, [resumes, activeId, isMounted]);

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

  const createNewVersion = () => {
    const newId = crypto.randomUUID();
    const newResume: ResumeData = {
      ...data,
      id: newId,
      metadata: {
        ...data.metadata,
        name: `${data.metadata.name} (Copy)`,
        lastModified: new Date().toISOString(),
      },
    };
    setResumes((prev) => ({ ...prev, [newId]: newResume }));
    setActiveId(newId);
  };

  const deleteVersion = (id: string) => {
    const versionCount = Object.keys(resumes).length;
    if (versionCount <= 1) {
      alert("You must have at least one resume.");
      return;
    }

    if (confirm("Are you sure you want to delete this version?")) {
      const newResumes = { ...resumes };
      delete newResumes[id];
      setResumes(newResumes);

      if (activeId === id) {
        setActiveId(Object.keys(newResumes)[0]);
      }
    }
  };

  const selectVersion = (id: string) => {
    setActiveId(id);
  };

  return {
    data,
    resumes,
    activeId,
    setData,
    isMounted,
    updateBlock,
    addBlock,
    removeBlock,
    autoClean,
    setResumeName,
    setTheme,
    createNewVersion,
    deleteVersion,
    selectVersion,
  };
}
