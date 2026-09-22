import type { SupabaseClient } from "@supabase/supabase-js";
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

const findUserByEmail = async (admin: SupabaseClient, email: string) => {
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
  return null;
};

export type ConfirmedSignupResult =
  | { ok: true; created: boolean; exists: boolean }
  | { ok: false; reason: "missing_admin" | "failed"; message: string };

export const provisionConfirmedUser = async (
  email: string,
  password: string,
): Promise<ConfirmedSignupResult> => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      reason: "missing_admin",
      message:
        "Registration cannot confirm this email yet. Add SUPABASE_SERVICE_ROLE_KEY in the server environment, then try again.",
    };
  }

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: email.split("@")[0] },
  });

  if (!error) return { ok: true, created: true, exists: false };

  if (!alreadyExists(error.code, error.message)) {
    console.error("Admin create user failed:", error);
    return {
      ok: false,
      reason: "failed",
      message: "Could not create the account. Please try again.",
    };
  }

  const existing = await findUserByEmail(admin, email);
  if (!existing) {
    return {
      ok: false,
      reason: "failed",
      message: "An account with this email already exists. Please sign in.",
    };
  }

  if (existing.email_confirmed_at) {
    return { ok: true, created: false, exists: true };
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
    email_confirm: true,
    password,
  });
  if (updateError) {
    console.error("Admin confirm user failed:", updateError);
    return {
      ok: false,
      reason: "failed",
      message: "Could not confirm this email. Please try again.",
    };
  }

  return { ok: true, created: true, exists: false };
};
