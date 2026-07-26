import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumePreview } from "@/components/resume-editor/resume-preview";
import { ResumeData } from "@resume/types";

interface PageProps {
  params: { slug: string };
}

export default async function PublicResumePage({ params }: PageProps) {
  const resolvedParams = params;
  const { slug } = resolvedParams;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("resumes")
    .select("resume_data, view_count")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  (async () => {
    const { error: rpcError } = await supabase.rpc("increment_view_count", {
      resume_slug: slug,
    });
    if (rpcError) console.error(rpcError);
  })();

  const resumeData = data.resume_data as ResumeData;
  const activeLayout = resumeData.metadata.theme as
    | "minimalist"
    | "professional"
    | "international"
    | "executive";

  return (
    <div className="min-h-screen bg-[#f4f4f5] py-12 flex flex-col items-center">
      {/* Analytics Badge (Optional: only shown to the owner ideally, but here for demo) */}
      <div className="mb-6 px-4 py-2 bg-white rounded-full shadow-sm text-xs font-medium text-zinc-500 border border-zinc-200 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        {data.view_count + 1} Views
      </div>

      <div
        className="shadow-2xl bg-white overflow-hidden"
        style={{ width: "210mm" }}
      >
        <ResumePreview data={resumeData} activeLayout={activeLayout} />
      </div>

      <div className="mt-12 text-center text-zinc-400 text-xs font-medium">
        Powered by Resume-Zero
      </div>
    </div>
  );
}
