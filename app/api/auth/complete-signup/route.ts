import { cookies } from "next/headers";
import { provisionConfirmedUser } from "@/lib/confirmed-signup";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { verifyOtp } from "@/lib/otp-store";
import { OTP_COOKIE, verifyOtpToken } from "@/lib/otp-token";

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

    const cookieStore = await cookies();
    const token = cookieStore.get(OTP_COOKIE)?.value || "";
    const tokenValid = token ? verifyOtpToken(email, otp, token) : false;
    const memoryValid = verifyOtp(email, otp);

    if (!tokenValid && !memoryValid) {
      return Response.json(
        { error: "Invalid or expired verification code." },
        { status: 400 },
      );
    }

    const result = await provisionConfirmedUser(email, password);
    if (!result.ok) {
      return Response.json({ error: result.message }, { status: result.reason === "missing_admin" ? 503 : 400 });
    }

    cookieStore.delete(OTP_COOKIE);
    return Response.json({
      success: true,
      created: result.created,
      exists: result.exists,
    });
  } catch (error) {
    console.error("Complete signup error:", error);
    return Response.json(
      { error: "Could not complete registration. Please try again." },
      { status: 500 },
    );
  }
}
