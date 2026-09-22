import { createHmac, timingSafeEqual } from "crypto";

export const OTP_COOKIE = "ps_otp";
export const OTP_TTL_MS = 10 * 60 * 1000;

const otpSecret = () =>
  process.env.OTP_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SMTP_PASS ||
  "";

const sign = (email: string, otp: string, expiresAt: number) =>
  createHmac("sha256", otpSecret())
    .update(`${email}|${otp}|${expiresAt}`)
    .digest("hex");

export const createOtpToken = (email: string, otp: string) => {
  const expiresAt = Date.now() + OTP_TTL_MS;
  return `${expiresAt}.${sign(email, otp, expiresAt)}`;
};

export const verifyOtpToken = (email: string, otp: string, token: string) => {
  if (!otpSecret()) return false;
  const [expiresRaw, signature] = token.split(".");
  const expiresAt = Number(expiresRaw);
  if (!expiresAt || !signature || Date.now() > expiresAt) return false;

  const expected = sign(email, otp, expiresAt);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
};
