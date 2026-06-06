import { generateOtp, storeOtp } from "@/lib/otp-store";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    const otp = generateOtp();
    storeOtp(normalizedEmail, otp);
    await sendOtpEmail(normalizedEmail, otp);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return Response.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 },
    );
  }
}
