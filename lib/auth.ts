import type { User } from "@supabase/supabase-js";
import { createStore, getStoreById } from "@/lib/db";
import { supabase } from "@/lib/supabase";

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
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Registration failed. Please try again.");
  return toAuthUser(data.user);
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  });
  if (error) throw error;
};

export const sendPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
};

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
};

export const authErrorMessage = (err: unknown, fallback: string) => {
  const message = err instanceof Error ? err.message : "";
  const lower = message.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "Invalid email or password. Please try again.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Please sign in.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please confirm your email, then try again.";
  }
  if (lower.includes("too many")) {
    return "Too many attempts. Please try again later.";
  }
  if (lower.includes("password")) {
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
  const existing = await getStoreById(user.uid);
  if (existing) return existing;

  await createStore(user.uid, {
    username: usernameFromIdentity(user.email, user.displayName),
    name: user.displayName || user.email?.split("@")[0] || "My Store",
    email: user.email,
    premiumUser: false,
  });
};
