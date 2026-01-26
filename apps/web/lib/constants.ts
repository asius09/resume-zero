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
            "Handle incoming calls and support faster overall service delivery."
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
            "Patient Communication"
          ],
        },
        {
          category: "Computer Skills",
          skills: [
            "Microsoft Excel",
            "Microsoft Word",
            "Tally Software"
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
