import type { ResumeData } from "@resume/types";

export const STORAGE_KEY = "resume_creator_v1_data";
export const RESUMES_STORAGE_KEY = "resume_creator_v1_all_resumes";
export const ACTIVE_RESUME_ID_KEY = "resume_creator_v1_active_id";

export const INITIAL_DATA: ResumeData = {
  id: crypto.randomUUID(),
  version: 1,
  metadata: {
    name: "My Resume",
    theme: "minimalist",
    images: ["/og-image.png"],
    icons: {
      icon: "/icon.svg",
      apple: "/icon.png",
    },
    region: "US",
    lastModified: new Date().toISOString(),
  },
  blocks: [
    {
      type: "header",
      data: {
        fullName: "",
        location: "",
        contacts: [],
      },
    },
    {
      type: "summary",
      data: "",
    },
    {
      type: "experience",
      data: [],
    },
    {
      type: "skills",
      data: [],
    },
    {
      type: "education",
      data: [],
    },
    {
      type: "languages",
      data: [],
    },
    {
      type: "projects",
      data: [],
    },
    {
      type: "personal",
      data: [],
    },
  ],
};

// Date constants
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

export const YEARS = Array.from(
  { length: 60 }, 
  (_, i) => (new Date().getFullYear() - i).toString()
);

export const EDUCATION_YEARS = Array.from(
  { length: 40 }, 
  (_, i) => (new Date().getFullYear() + 5 - i).toString()
);

// Mandatory sections
export const MANDATORY_SECTIONS = ["header", "summary"] as const;

// Resume themes
export const RESUME_THEMES = [
  "minimalist",
  "professional", 
  "international",
  "executive"
] as const;

export type ResumeTheme = typeof RESUME_THEMES[number];
