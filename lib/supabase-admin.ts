import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const jwtRole = (token: string) => {
  const part = token.split(".")[1];
  if (!part) return "";
  try {
    const json = JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as {
      role?: unknown;
    };
    return typeof json.role === "string" ? json.role : "";
  } catch {
    return "";
  }
};

export const serviceRoleProblem = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (!url || !key) return "missing" as const;
  if (jwtRole(key) !== "service_role") return "public_key" as const;
  return "ok" as const;
};

export const getSupabaseAdmin = (): SupabaseClient | null => {
  if (serviceRoleProblem() !== "ok") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
