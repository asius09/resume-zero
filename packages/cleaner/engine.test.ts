import { describe, it, expect } from "vitest";
import { cleanText, normalizeBullet, analyzeBullet } from "./engine";

describe("cleanText", () => {
  it("removes fluff words", () => {
    expect(cleanText("Hardworking developer")).toBe("developer");
    expect(cleanText("Passionate about code")).toBe("about code");
    expect(cleanText("Detail-oriented team player")).toBe("");
  });

  it("replaces weak phrases", () => {
    expect(cleanText("Worked on the app")).toBe("developed the app");
    expect(cleanText("Helped with deployment")).toBe("collaborated on deployment");
    expect(cleanText("Responsible for team")).toBe("led team");
  });

  it("normalizes whitespace", () => {
    const result = cleanText("  Led   the   team  ");
    expect(result).toBe("Led the team");
  });

  it("handles empty string", () => {
    expect(cleanText("")).toBe("");
    expect(cleanText("   ")).toBe("");
  });
});

describe("normalizeBullet", () => {
  it("capitalizes first letter", () => {
    expect(normalizeBullet("built an api")).toBe("Built an api.");
  });

  it("adds trailing period for long bullets", () => {
    expect(normalizeBullet("This is a long bullet point that should get a period")).toBe(
      "This is a long bullet point that should get a period.",
    );
  });

  it("does not add period for short bullets", () => {
    expect(normalizeBullet("Hi")).toBe("Hi");
  });

  it("does not duplicate existing period", () => {
    expect(normalizeBullet("Built an api.")).toBe("Built an api.");
  });

  it("cleans weak phrasing before normalizing", () => {
    const result = normalizeBullet("responsible for building the system");
    expect(result).toBe("Led building the system.");
  });
});

describe("analyzeBullet", () => {
  it("suggests adding quantifiable results when no numbers present", () => {
    const hints = analyzeBullet("Built a feature");
    expect(hints.some((h) => h.message.includes("quantifiable"))).toBe(true);
  });

  it("does not warn about quantifiable results when numbers are present", () => {
    const hints = analyzeBullet("Improved performance by 40%");
    expect(hints.some((h) => h.message.includes("quantifiable"))).toBe(false);
  });

  it("warns about long bullets", () => {
    const longBullet = "This is a very long bullet point that exceeds the twenty five word limit that we have set for acceptable bullet point length in the resume";
    const hints = analyzeBullet(longBullet);
    expect(hints.some((h) => h.type === "warning" && h.message.includes("long"))).toBe(true);
  });

  it("suggests stronger verbs for weak starts", () => {
    const hints = analyzeBullet("Responsible for managing the team");
    expect(hints.some((h) => h.message.includes("stronger action verb"))).toBe(true);
  });

  it("returns no warnings for a strong bullet", () => {
    const hints = analyzeBullet("Optimized database queries reducing response time by 60%");
    expect(hints.length).toBe(0);
  });
});
