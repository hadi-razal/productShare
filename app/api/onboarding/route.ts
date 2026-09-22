import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { onboardingSchema } from "@/lib/onboarding";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
    if (!token)
      return NextResponse.json(
        { error: "Please sign in again." },
        { status: 401 },
      );
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
      return NextResponse.json(
        {
          error:
            "Store setup is temporarily unavailable. Please contact support.",
        },
        { status: 503 },
      );
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false },
      },
    );
    const { data: auth, error: authError } = await client.auth.getUser(token);
    if (authError || !auth.user)
      return NextResponse.json(
        { error: "Your session expired. Please sign in again." },
        { status: 401 },
      );
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    const { error } = await client.rpc("complete_store_onboarding", {
      details: parsed.data,
    });
    if (error)
      return NextResponse.json(
        {
          error:
            error.code === "23505"
              ? "That catalogue address was just taken. Go back and choose another."
              : "We couldn’t save your catalogue. Your draft is safe. Please retry.",
        },
        { status: error.code === "23505" ? 409 : 500 },
      );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn’t reach your store. Your draft is safe. Please retry.",
      },
      { status: 503 },
    );
  }
}
