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
