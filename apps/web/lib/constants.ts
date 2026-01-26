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
    region: "IN",
    lastModified: new Date().toISOString(),
  },
  blocks: [
    {
      type: "header",
      data: {
        fullName: "ADIBA FIROZ",
        location: "Delhi, India",
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
      data: "Dedicated Front Office Executive with 1+ years in high-volume hospital administration. Expert in patient registration, OPD/IPD billing, and insurance verification for 80+ daily patients. Delivers efficient hospital coordination and premium patient support with 100% documentation accuracy.",
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
            "Managed front desk operations for a high-volume hospital, handling 80+ patient registrations and billing inquiries daily.",
            "Processed government insurance verifications and OPD/IPD billing with 100% accuracy, streamlining treasury operations.",
            "Coordinated with clinical and nursing departments to optimize patient flow, reducing average waiting time during peak hours.",
            "Verified and maintained digital patient records while facilitating clear communication between patients, families, and doctors.",
            "Handled 40+ daily telephonic inquiries and resolved complex patient queries with a focus on service efficiency and resolution."
          ],
        },
      ],
    },
    {
      type: "skills",
      data: [
        {
          category: "Core Skills",
          skills: [
            "Patient Registration",
            "OPD/IPD Coordination",
            "Cash Handling",
            "Billing",
            "Insurance Verification",
            "Front Desk Operations",
            "Patient Resolution"
          ],
        },
        {
          category: "Tools",
          skills: [
            "MS Excel",
            "MS Word",
            "Tally",
            "HIS (Hospital Information System)"
          ],
        },
      ],
    },
    {
      type: "education",
      data: [
        {
          degree: "MBA in Operations Management",
          institution: "Indira Gandhi National Open University",
          graduationYear: "2025",
          isPursuing: true,
        },
        {
          degree: "Bachelor of Arts",
          institution: "University of Delhi",
          graduationYear: "2021",
          isPursuing: false,
        },
        {
          degree: "Higher Secondary Education (C.B.S.E)",
          institution: "Delhi",
          graduationYear: "2018",
          isPursuing: false,
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
        { label: "Father's Name", value: "Mohd Firoz" },
        { label: "Date of Birth", value: "2001-12-19" },
        { label: "Gender", value: "Female" },
        { label: "Marital Status", value: "Unmarried" },
        { label: "Nationality", value: "Indian" },
      ],
    },
  ],
};
