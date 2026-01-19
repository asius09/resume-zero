import type {
  ResumeData,
  Contact,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  EducationItem,
  LanguageItem,
  CertificationItem,
  CustomBlock,
  PersonalDetailItem,
} from "@resume/types";

export const handleCopySection = async (data: ResumeData, index: number) => {
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
  } else if (block.type === "languages") {
    text = (block.data as LanguageItem[])
      .map((l) => `${l.language} - ${l.proficiency}`)
      .join("\n");
  } else if (block.type === "certifications") {
    text = (block.data as CertificationItem[])
      .map((c) => `${c.name} - ${c.issuer} (${c.year})`)
      .join("\n");
  } else if (block.type === "personal") {
    text = (block.data as PersonalDetailItem[])
      .map((p) => `${p.label}: ${p.value}`)
      .join("\n");
  } else if (block.type === "custom") {
    text = `${(block.data as CustomBlock).title}\n${(block.data as CustomBlock).content}`;
  }

  await navigator.clipboard.writeText(text);
};

export const renderPlainText = (data: ResumeData) => {
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
        const p = block.data as PersonalDetailItem[];
        return `PERSONAL DETAILS\n${p
          .map((item) => `${item.label}: ${item.value}`)
          .join("\n")}\n\n`;
      }
      return "";
    })
    .join("");
};
