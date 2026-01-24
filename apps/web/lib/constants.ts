import type { ResumeData } from "@resume/types";

export const STORAGE_KEY = "resume_creator_v1_data";

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
          companyName: "BLK Max Super Speciality Hospital",
          location: "Delhi, India",
          startDate: "Jan 2024",
          endDate: "Present",
          isCurrent: true,
          bullets: [
            "Orchestrate seamless patient reception and front-desk workflows in a high-volume multi-speciality environment.",
            "Drive efficiency in appointment scheduling and follow-ups, reducing patient wait times and improving satisfaction.",
            "Lead rigorous insurance verification and coordination processes to ensure 100% billing accuracy.",
            "Mastermind medical billing and basic coding for complex government and private medical bills.",
            "Deliver exceptional customer service by resolving patient inquiries and maintaining professional communication.",
            "Uphold meticulous clinic documentation and records management in compliance with hospital standards.",
            "Leverage advanced MS Office and clinic management software to enhance operational productivity.",
            "Optimized patient registration flow, resulting in faster service delivery during peak hours."
          ],
        },
      ],
    },
    {
      type: "skills",
      data: [
        {
          category: "Key Professional Skills",
          skills: [
            "Patient Reception & Front Desk Handling",
            "Appointment Scheduling & Follow-ups",
            "Insurance Verification & Coordination",
            "Medical Billing & Basic Medical Coding",
            "Customer Service & Professional Communication",
            "Clinic Documentation & Records Management",
            "MS Office & Clinic Management Software",
          ],
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
