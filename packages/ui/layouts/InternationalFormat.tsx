import React from "react";
import type { ResumeData, Contact } from "@resume/types";

export const InternationalFormat = ({ data }: { data: ResumeData }) => {
  return (
    <div
      className="resume-container w-[210mm] min-h-[297mm] mx-auto bg-white font-serif leading-relaxed text-black shadow-none print:shadow-none"
      style={{ padding: "0.5in" }}
    >
      {/* 1. NAME - TEXT_TYPE: NAME */}
      {data.blocks.map((block, idx) => {
        if (block.type === "header") {
          return (
            <div
              key={idx}
              className="mb-10 text-left border-b-2 border-[#0f172a] pb-5"
            >
              <h1 className="text-3xl font-normal mb-2 tracking-widest uppercase">
                {block.data.fullName}
              </h1>
              {/* 2. CONTACT INFORMATION - TEXT_TYPE: META_TEXT */}
              <div className="text-[13px] flex flex-col font-medium text-[#1e293b]">
                {block.data.location && (
                  <span className="mb-1">{block.data.location}</span>
                )}
                {block.data.contacts.map((contact: Contact, cIdx: number) => (
                  <span key={cIdx} className="flex items-center mb-1">
                    <span className="font-bold opacity-60 mr-2">
                      {contact.label || contact.type}:
                    </span>{" "}
                    {contact.value}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}

      <div className="space-y-8">
        {data.blocks.map((block, idx) => {
          if (block.type === "header") return null;

          return (
            <div key={idx}>
              {/* 3. PROFESSIONAL SUMMARY - Strongly recommended */}
              {block.type === "summary" && block.data && (
                <div className="mb-8">
                  <h2 className="text-[16px] font-bold border-b-2 border-[#0f172a] pb-1 mb-4 uppercase tracking-wider">
                    Professional Profile
                  </h2>
                  <p className="text-[13px] text-justify leading-relaxed text-[#0f172a] italic">
                    {block.data as string}
                  </p>
                </div>
              )}

              {/* 4. CORE SKILLS - Optimized for ATS keywords */}
              {block.type === "skills" && (
                <div className="mb-8">
                  <h2 className="text-[16px] font-bold border-b-2 border-[#0f172a] pb-1 mb-4 uppercase tracking-wider">
                    Core Skills
                  </h2>
                  <div className="space-y-3">
                    {block.data.map((item, iIdx) => (
                      <div key={iIdx} className="text-[13px] flex items-start">
                        <span className="font-bold text-black uppercase text-[11px] tracking-wide pt-0.5 w-[160px] shrink-0">
                          {item.category}
                        </span>
                        <span className="text-[#0f172a] font-medium leading-relaxed">
                          {item.skills.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. PROFESSIONAL EXPERIENCE */}
              {block.type === "experience" && (
                <div className="mb-8">
                  <h2 className="text-[16px] font-bold border-b-2 border-[#0f172a] pb-1 mb-5 uppercase tracking-wider">
                    Professional Experience
                  </h2>
                  <div className="space-y-8">
                    {block.data.map((item, iIdx) => (
                      <div key={iIdx}>
                        <div className="flex justify-between font-bold text-[14px] mb-1">
                          <span className="uppercase">{item.jobTitle}</span>
                          <span className="text-[12px] font-bold text-[#475569] uppercase">
                            {item.startDate.toUpperCase()} —{" "}
                            {item.isCurrent
                              ? "PRESENT"
                              : item.endDate?.toUpperCase() || "PRESENT"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[13px] mb-3">
                          <span className="font-bold italic text-[#1e293b]">
                            {item.companyName}
                          </span>
                          {item.location && (
                            <span className="text-[#64748b] font-medium italic">
                              {item.location}
                            </span>
                          )}
                        </div>
                        <ul className="list-disc list-outside ml-6 text-[13px] text-[#0f172a] space-y-2">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="pl-1 leading-relaxed">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. EDUCATION */}
              {block.type === "education" && (
                <div className="mb-8">
                  <h2 className="text-[16px] font-bold border-b-2 border-[#0f172a] pb-1 mb-5 uppercase tracking-wider">
                    Education
                  </h2>
                  <div className="space-y-6">
                    {block.data.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="flex justify-between items-start text-[14px]"
                      >
                        <div>
                          <div className="font-bold uppercase tracking-tight">
                            {item.institution}
                          </div>
                          <div className="text-[#1e293b] italic text-[13px] mt-1">
                            {item.degree}
                          </div>
                          {item.gpa && (
                            <div className="text-[11px] font-bold text-[#64748b] mt-1">
                              Grade: {item.gpa}
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-[12px] text-[#334155]">
                          {item.graduationYear}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. ADDITIONAL INFORMATION (Optional / Certs) */}
              {block.type === "certifications" && (
                <div className="mb-8">
                  <h2 className="text-[16px] font-bold border-b border-[#d4d4d8] pb-1 mb-4 uppercase tracking-wider">
                    Certifications & Training
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-[13px]">
                    {block.data.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="border-l border-[#e4e4e7] pl-4 py-1"
                      >
                        <div className="font-bold uppercase mb-1">
                          {item.name}
                        </div>
                        <div className="text-[#475569] text-[11px] uppercase tracking-wide">
                          {item.issuer} • {item.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {block.type === "projects" && (
                <div className="mb-8">
                  <h2 className="text-[16px] font-bold border-b border-[#d4d4d8] pb-1 mb-4 uppercase tracking-wider">
                    Key Projects
                  </h2>
                  <div className="space-y-6">
                    {block.data.map((item, iIdx) => (
                      <div key={iIdx}>
                        <div className="flex justify-between font-bold text-[14px] mb-1 uppercase">
                          <span>{item.name}</span>
                          {item.link && (
                            <span className="font-normal text-[11px] text-[#64748b] normal-case">
                              {item.link}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[12px] mb-2 font-bold italic text-[#334155]">
                            {item.description}
                          </p>
                        )}
                        <ul className="list-disc list-outside ml-6 text-[13px] text-[#0f172a] space-y-2">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="pl-1">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {block.type === "custom" && (
                <div className="mb-8 pb-4">
                  <h2 className="text-[16px] font-bold border-b border-[#d4d4d8] pb-1 mb-3 uppercase tracking-wider">
                    {block.data.title}
                  </h2>
                  <div className="text-[13px] whitespace-pre-wrap leading-relaxed italic text-[#1e293b]">
                    {block.data.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
