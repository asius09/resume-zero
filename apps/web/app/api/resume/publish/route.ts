import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateId } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const resumeData = await request.json();

    const slug = generateId().substring(0, 8);

    const { data, error } = await supabase
      .from("resumes")
      .insert([
        {
          slug,
          resume_data: resumeData,
          view_count: 0,
        },
      ])
      .select("slug")
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      slug: data.slug,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/p/${data.slug}`,
    });
  } catch (err) {
    console.error("Error publishing resume:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
