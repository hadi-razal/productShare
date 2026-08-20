export const ADMIN_HOME_PATH = "/admin";

export const superAdminEmails = () =>
  String(process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isSuperAdminEmail = (email?: string | null) => {
  if (!email) return false;
  return superAdminEmails().includes(email.trim().toLowerCase());
};

export const signedInHomePath = (email?: string | null) =>
  isSuperAdminEmail(email) ? ADMIN_HOME_PATH : "/store";

