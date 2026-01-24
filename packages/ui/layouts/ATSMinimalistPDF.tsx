import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type {
  ResumeData,
  Contact,
  ExperienceItem,
  SkillGroup,
  EducationItem,
  ProjectItem,
  LanguageItem,
  CertificationItem,
  CustomBlock,
} from "@resume/types";

// Register fonts
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-SemiBold.ttf",
      fontWeight: 600,
    },
    {
      src: "https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Bold.ttf",
      fontWeight: 700,
    },
    {
      src: "https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Italic.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: "12mm 15mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter",
    color: "#18181b", // zinc-900
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  fullName: {
    fontSize: 18,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    color: "#18181b",
    lineHeight: 1.2,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    fontSize: 9,
    color: "#3f3f46", // zinc-700
  },
  contactItem: {
    textDecoration: "none",
    color: "inherit",
  },
  divider: {
    marginHorizontal: 8,
    color: "#a1a1aa", // zinc-400
  },
  section: {
    width: "100%",
    marginBottom: 12,
  },
  sectionHeader: {
    marginTop: 15,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#18181b",
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 10,
    fontSize: 9.5,
    fontWeight: 700,
    color: "#18181b",
  },
  bulletContent: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.3,
    color: "#27272a", // zinc-800
  },
  itemHeader: {
    marginBottom: 4,
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#18181b",
  },
  itemRightLabel: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#3f3f46",
  },
  itemSubtitle: {
    fontSize: 9.5,
    fontWeight: 500,
    fontStyle: "italic",
    color: "#27272a",
  },
  summary: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#27272a",
  },
  skillCategory: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#18181b",
  },
  personalItem: {
    flexDirection: "row",
    marginBottom: 4,
    fontSize: 9.5,
    paddingLeft: 4,
  },
  personalLabel: {
    fontWeight: 700,
    color: "#18181b",
    minWidth: 100,
  },
  personalValue: {
    color: "#3f3f46",
    flex: 1,
  },
  italic: {
    fontStyle: "italic",
    fontSize: 9.5,
    color: "#52525b", // zinc-600
  },
});

// Helper Functions
function formatContactLink(contact: Contact): string {
  switch (contact.type) {
    case "email":
      return `mailto:${contact.value}`;
    case "phone":
      return `tel:${contact.value.replace(/\s+/g, "")}`;
    case "linkedin":
    case "github":
    case "website":
      return contact.value.startsWith("http")
        ? contact.value
        : `https://${contact.value}`;
    default:
      return contact.value;
  }
}

function formatPersonalValue(label: string, value: string): string {
  if (
    label.toLowerCase().includes("date") ||
    label.toLowerCase().includes("birth")
  ) {
    const date = new Date(value);
    if (!isNaN(date.getTime()) && value.includes("-")) {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
  }
  return value;
}

const BulletPoint = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.bulletItem}>
    <Text style={styles.bulletPoint}>•</Text>
    <View style={styles.bulletContent}>{children}</View>
  </View>
);

export const ATSMinimalistPDF: React.FC<{ data: ResumeData }> = ({ data }) => {
  const renderBlock = (block: any, idx: number) => {
    switch (block.type) {
      case "header":
        return (
          <View key={idx} style={styles.header}>
            <Text style={styles.fullName}>{block.data.fullName}</Text>
            <View style={styles.contactContainer}>
              {[
                block.data.location && {
                  type: "location" as const,
                  value: block.data.location,
                  isContact: false,
                },
                ...(block.data.contacts as Contact[]).map((c) => ({
                  ...c,
                  isContact: true,
                })),
              ]
                .filter(Boolean)
                .map((item: any, index, array) => (
                  <React.Fragment key={index}>
                    {item.isContact ? (
                      <Link
                        src={formatContactLink(item)}
                        style={styles.contactItem}
                      >
                        <Text>
                          {["linkedin", "github", "website"].includes(item.type)
                            ? item.value.replace(/^https?:\/\/(www\.)?/, "")
                            : item.value}
                        </Text>
                      </Link>
                    ) : (
                      <Text>{item.value}</Text>
                    )}
                    {index < array.length - 1 && (
                      <Text style={styles.divider}>|</Text>
                    )}
                  </React.Fragment>
                ))}
            </View>
          </View>
        );

      case "summary":
        if (!block.data) return null;
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
            </View>
            <Text style={styles.summary}>{block.data}</Text>
          </View>
        );

      case "experience":
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Experience</Text>
            </View>
            {block.data.map((item: ExperienceItem, i: number) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemTitle}>{item.jobTitle}</Text>
                    <Text style={styles.itemRightLabel}>
                      {item.startDate} – {item.endDate || "Present"}
                    </Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{item.companyName}</Text>
                </View>
                <View style={{ paddingLeft: 4 }}>
                  {item.bullets.map((bullet: string, bIdx: number) => (
                    <BulletPoint key={bIdx}>
                      <Text>{bullet}</Text>
                    </BulletPoint>
                  ))}
                </View>
              </View>
            ))}
          </View>
        );

      case "skills":
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            </View>
            <View style={{ paddingLeft: 4 }}>
              {block.data.map((group: SkillGroup, i: number) => (
                <BulletPoint key={i}>
                  <Text>
                    <Text style={styles.skillCategory}>{group.category}: </Text>
                    <Text>{group.skills.join(", ")}</Text>
                  </Text>
                </BulletPoint>
              ))}
            </View>
          </View>
        );

      case "education":
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            {block.data.map((edu: EducationItem, i: number) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemRightLabel}>{edu.graduationYear}</Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {edu.institution}
                  {edu.gpa && ` — GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        );

      case "languages":
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Languages</Text>
            </View>
            <View style={{ paddingLeft: 4 }}>
              {block.data.map((lang: LanguageItem, i: number) => (
                <BulletPoint key={i}>
                  <Text>
                    <Text style={{ fontWeight: 700 }}>{lang.language}</Text>
                    {lang.proficiency && (
                      <Text style={styles.italic}> ({lang.proficiency})</Text>
                    )}
                  </Text>
                </BulletPoint>
              ))}
            </View>
          </View>
        );

      case "projects":
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Projects</Text>
            </View>
            {block.data.map((proj: ProjectItem, i: number) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  <Text style={styles.itemRightLabel}>{proj.dates}</Text>
                </View>
                {proj.description && (
                  <Text style={[styles.summary, { marginBottom: 4 }]}>
                    {proj.description}
                  </Text>
                )}
                <View style={{ paddingLeft: 4 }}>
                  {proj.bullets.map((bullet: string, bIdx: number) => (
                    <BulletPoint key={bIdx}>
                      <Text>{bullet}</Text>
                    </BulletPoint>
                  ))}
                </View>
              </View>
            ))}
          </View>
        );

      case "certifications":
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Certifications</Text>
            </View>
            <View style={{ paddingLeft: 4 }}>
              {block.data.map((cert: CertificationItem, i: number) => (
                <BulletPoint key={i}>
                  <Text>
                    <Text style={{ fontWeight: 700 }}>{cert.name}</Text>
                    <Text style={{ color: "#71717a" }}>
                      {" "}
                      — {cert.issuer} ({cert.year})
                    </Text>
                  </Text>
                </BulletPoint>
              ))}
            </View>
          </View>
        );

      case "custom":
        if (!(block.data as CustomBlock).title) return null;
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {(block.data as CustomBlock).title}
              </Text>
            </View>
            <Text style={styles.summary}>
              {(block.data as CustomBlock).content}
            </Text>
          </View>
        );

      case "personal":
        return (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </View>
            <View style={{ paddingLeft: 4 }}>
              {block.data.map((item: any, i: number) => (
                <View key={i} style={styles.personalItem}>
                  <Text style={styles.personalLabel}>{item.label}:</Text>
                  <Text style={styles.personalValue}>
                    {formatPersonalValue(item.label, item.value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.blocks.map((block, index) => renderBlock(block, index))}
      </Page>
    </Document>
  );
};
