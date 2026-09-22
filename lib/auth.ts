import type { User } from "@supabase/supabase-js";
import { createStore, getStoreById } from "@/lib/db";
import { normalizeEmail } from "@/lib/email";
import { getAuthRedirectOrigin } from "@/lib/storefront-url";
import { isSupabaseBrowserConfigured, supabase } from "@/lib/supabase";
import { isSuperAdminEmail } from "@/lib/super-admin";

const authRedirectUrl = (path: string) => `${getAuthRedirectOrigin()}${path}`;

export type AuthUser = {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
};

const toAuthUser = (user: User): AuthUser => ({
  uid: user.id,
  id: user.id,
  email: user.email ?? null,
  displayName:
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.display_name ||
    null,
});

export const onAuthChange = (callback: (user: AuthUser | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toAuthUser(session.user) : null);
  });
  return () => data.subscription.unsubscribe();
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user ? toAuthUser(data.user) : null;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });
  if (error) throw error;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: normalizeEmail(email),
    password,
    options: {
      emailRedirectTo: authRedirectUrl("/auth/callback"),
    },
  });
  if (error) throw error;
  if (data.user && (data.user.identities?.length ?? 1) === 0) {
    throw new Error("An account with this email already exists. Please sign in.");
  }
  if (!data.user) throw new Error("Registration failed. Please try again.");
  return toAuthUser(data.user);
};

const authErrorCode = (err: unknown) => {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string") return code;
  }
  return "";
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithGoogle = async () => {
  if (!isSupabaseBrowserConfigured()) {
    throw new Error(
      "Google sign-in is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy.",
    );
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: authRedirectUrl("/auth/callback"),
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });
  if (error) throw error;
};

const oauthErrorFromUrl = () => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return (
    params.get("error_description") ||
    params.get("error") ||
    hash.get("error_description") ||
    hash.get("error")
  );
};

export const completeOAuthRedirect = async (): Promise<AuthUser | null> => {
  const oauthError = oauthErrorFromUrl();
  if (oauthError) throw new Error(oauthError);

  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user) return toAuthUser(existing.session.user);

  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return null;

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;
  return data.user ? toAuthUser(data.user) : null;
};

export const sendPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
    redirectTo: authRedirectUrl("/reset-password"),
  });
  if (error) throw error;
};

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
};

export const authErrorMessage = (err: unknown, fallback: string) => {
  const code = authErrorCode(err);
  const message = err instanceof Error ? err.message : "";
  const lower = message.toLowerCase();

  if (
    code === "email_address_invalid" ||
    (lower.includes("email address") && lower.includes("invalid"))
  ) {
    return "This email could not be used to create an account. Check the address, or sign in if you already registered.";
  }
  if (code === "email_address_not_authorized") {
    return "This email could not be verified by the auth provider. Use the code we send, then try again.";
  }
  if (
    code === "email_exists" ||
    code === "user_already_exists" ||
    lower.includes("already registered") ||
    lower.includes("already been registered")
  ) {
    return "An account with this email already exists. Please sign in.";
  }
  if (code === "email_not_confirmed" || lower.includes("email not confirmed")) {
    return "This email is not confirmed yet. Register with the same email, enter the code we send, and we will confirm it.";
  }
  if (
    code === "invalid_credentials" ||
    lower.includes("invalid login") ||
    lower.includes("invalid credentials")
  ) {
    return "Invalid email or password. If you do not have an account yet, register first.";
  }
  if (code === "over_email_send_rate_limit" || lower.includes("too many")) {
    return "Too many attempts. Please try again later.";
  }
  if (
    lower.includes("provider is not enabled") ||
    lower.includes("unsupported provider")
  ) {
    return "Google sign-in is not enabled yet. Please use email, or enable the Google provider in Supabase Auth.";
  }
  if (lower.includes("redirect") && lower.includes("not allowed")) {
    return "Google sign-in is misconfigured. Add this site URL to the Supabase Auth redirect allowlist.";
  }
  if (code === "weak_password" || (lower.includes("password") && lower.includes("6"))) {
    return "Password must be at least 6 characters.";
  }
  return message || fallback;
};

export const usernameFromIdentity = (email?: string | null, name?: string | null) => {
  const raw = (email?.split("@")[0] || name || "user")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  return `${raw || "user"}${Math.floor(Math.random() * 1000)}`;
};

export const ensureStoreForUser = async (user: AuthUser) => {
  if (isSuperAdminEmail(user.email)) return null;

  const existing = await getStoreById(user.uid);
  if (existing) return existing;

  const name = user.displayName || user.email?.split("@")[0] || "My Store";
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await createStore(user.uid, {
        username: usernameFromIdentity(user.email, user.displayName),
        name,
        email: user.email,
        premiumUser: false,
      });
      return getStoreById(user.uid);
    } catch (error) {
      lastError = error;
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error && "message" in error
            ? String((error as { message?: unknown }).message || "")
            : String(error);
      if (!/duplicate|unique|username/i.test(message)) break;
    }
  }
  throw lastError;
};
