import { verifyOtp } from "@/lib/otp-store";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return Response.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const isValid = verifyOtp(email.trim().toLowerCase(), String(otp).trim());

    if (!isValid) {
      return Response.json(
        { error: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    return Response.json({ success: true, verified: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return Response.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 },
    );
  }
}
