import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseAdmin, serviceRoleProblem } from "@/lib/supabase-admin";

const adminKeyMessage = () =>
  serviceRoleProblem() === "public_key"
    ? "Could not create the account. SUPABASE_SERVICE_ROLE_KEY is the public anon key. Replace it with the service_role secret from Supabase → Project Settings → API Keys, then redeploy."
    : "Could not create the account. Add the Supabase service_role secret as SUPABASE_SERVICE_ROLE_KEY, then redeploy.";

const failedMessage = (code?: string, message?: string) => {
  const lower = (message || "").toLowerCase();
  if (
    code === "not_admin" ||
    lower.includes("not allowed") ||
    lower.includes("invalid api key")
  ) {
    return adminKeyMessage();
  }
  if (code === "email_address_invalid" || lower.includes("email address")) {
    return "This email could not be used to create an account. Check the address, or sign in if you already registered.";
  }
  if (code === "weak_password" || lower.includes("password")) {
    return "Password must be at least 6 characters.";
  }
  if (code === "over_request_rate_limit" || lower.includes("too many")) {
    return "Too many attempts. Please try again later.";
  }
  return "Could not create the account. Please try again.";
};

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
    const users: User[] = data.users;
    const match = users.find((user) => user.email?.toLowerCase() === email);
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
      message: adminKeyMessage(),
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
    console.error("Admin create user failed:", error.code, error.message);
    return {
      ok: false,
      reason: error.status === 403 || error.code === "not_admin" ? "missing_admin" : "failed",
      message: failedMessage(error.code, error.message),
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
