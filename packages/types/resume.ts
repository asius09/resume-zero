import { z } from 'zod';

export const ContactSchema = z.object({
  type: z.enum(['phone', 'email', 'linkedin', 'github', 'website', 'other']),
  value: z.string().min(1),
  label: z.string().optional(),
});

export const HeaderSchema = z.object({
  fullName: z.string().min(1),
  location: z.string().optional(),
  contacts: z.array(ContactSchema),
});

export const ExperienceItemSchema = z.object({
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(), // empty means "Present"
  isCurrent: z.boolean().default(false),
  bullets: z.array(z.string().min(1)),
});

export const ProjectItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  dates: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  link: z.string().url().optional(),
  bullets: z.array(z.string().min(1)),
});

export const EducationItemSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().optional(),
  graduationYear: z.string().min(1),
  gpa: z.string().optional(),
  isPursuing: z.boolean().default(false),
});

export const SkillGroupSchema = z.object({
  category: z.string().min(1),
  skills: z.array(z.string().min(1)),
});

export const CertificationItemSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  year: z.string().min(1),
});

export const PersonalDetailItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const PersonalDetailsSchema = z.array(PersonalDetailItemSchema);

export const CustomBlockSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export const LanguageItemSchema = z.object({
  language: z.string().min(1),
  proficiency: z.string().min(1), // Native, Intermediate, etc.
});

export const ResumeSectionTypeSchema = z.enum([
  'header',
  'summary',
  'experience',
  'projects',
  'skills',
  'education',
  'certifications',
  'languages',
  'personal',
  'custom',
]);

export type ResumeSectionType = z.infer<typeof ResumeSectionTypeSchema>;

export const ResumeBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('header'), data: HeaderSchema }),
  z.object({ type: z.literal('summary'), data: z.string().max(1000) }),
  z.object({ type: z.literal('experience'), data: z.array(ExperienceItemSchema) }),
  z.object({ type: z.literal('projects'), data: z.array(ProjectItemSchema) }),
  z.object({ type: z.literal('skills'), data: z.array(SkillGroupSchema) }),
  z.object({ type: z.literal('education'), data: z.array(EducationItemSchema) }),
  z.object({ type: z.literal('certifications'), data: z.array(CertificationItemSchema) }),
  z.object({ type: z.literal('languages'), data: z.array(LanguageItemSchema) }),
  z.object({ type: z.literal('personal'), data: PersonalDetailsSchema }),
  z.object({ type: z.literal('custom'), data: CustomBlockSchema }),
]);

export const ResumeDataSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()),
  version: z.number().default(1),
  metadata: z.object({
    name: z.string().default('My Resume'),
    theme: z.enum(['minimalist', 'professional', 'international']).default('minimalist'),
    region: z.string().default('US'),
    lastModified: z.string().default(() => new Date().toISOString()),
    images: z.array(z.string()).optional(),
    icons: z.object({
      icon: z.string(),
      apple: z.string(),
    }).optional(),
  }),
  blocks: z.array(ResumeBlockSchema),
});

export type Contact = z.infer<typeof ContactSchema>;
export type Header = z.infer<typeof HeaderSchema>;
export type LanguageItem = z.infer<typeof LanguageItemSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type CertificationItem = z.infer<typeof CertificationItemSchema>;
export type CustomBlock = z.infer<typeof CustomBlockSchema>;
export type PersonalDetailItem = z.infer<typeof PersonalDetailItemSchema>;
export type ResumeBlock = z.infer<typeof ResumeBlockSchema>;
export type ResumeData = z.infer<typeof ResumeDataSchema>;
