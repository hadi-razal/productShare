type OtpRecord = {
  otp: string;
  expiresAt: number;
};

const globalForOtp = globalThis as typeof globalThis & {
  otpStore?: Map<string, OtpRecord>;
};

const otpStore = globalForOtp.otpStore ?? new Map<string, OtpRecord>();
globalForOtp.otpStore = otpStore;

const OTP_TTL_MS = 10 * 60 * 1000;

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const storeOtp = (email: string, otp: string) => {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
};

export const verifyOtp = (email: string, otp: string) => {
  const record = otpStore.get(email.toLowerCase());

  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (record.otp !== otp) return false;

  otpStore.delete(email.toLowerCase());
  return true;
};
