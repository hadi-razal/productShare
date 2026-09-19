import { isValidEmail, normalizeEmail } from "@/lib/email";
import { verifyOtp } from "@/lib/otp-store";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const alreadyExists = (code?: string, message?: string) => {
  const lower = (message || "").toLowerCase();
  return (
    code === "email_exists" ||
    code === "user_already_exists" ||
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    lower.includes("already exists")
  );
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");
    const otp = String(body.otp || "").trim();

    if (!isValidEmail(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    if (!otp) {
      return Response.json({ error: "Please enter the verification code." }, { status: 400 });
    }
    if (!verifyOtp(email, otp)) {
      return Response.json(
        { error: "Invalid or expired verification code." },
        { status: 400 },
      );
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return Response.json({ success: true, verified: true });
    }

    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: email.split("@")[0] },
    });

    if (error && !alreadyExists(error.code, error.message)) {
      console.error("Admin create user failed:", error);
      return Response.json(
        { error: "Could not create the account. Please try signing in." },
        { status: 400 },
      );
    }

    return Response.json({ success: true, created: !error });
  } catch (error) {
    console.error("Complete signup error:", error);
    return Response.json(
      { error: "Could not complete registration. Please try again." },
      { status: 500 },
    );
  }
}
