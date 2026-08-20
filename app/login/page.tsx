"use client";

import React, { useEffect, useState } from "react";
import {
  authErrorMessage,
  ensureStoreForUser,
  onAuthChange,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/auth";
import { signedInHomePath } from "@/lib/super-admin";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";

const inputClass =
  "w-full px-4 py-3 bg-white border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-gray-900 placeholder:text-gray-400 text-sm disabled:opacity-50 hover:border-gray-300";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (params.get("registered") === "true") {
      setSuccess("Account created successfully. Redirecting to your store...");
    }

    if (params.get("exists") === "true") {
      setError(
        "An account with this email already exists. Please sign in with your existing password.",
      );
    }

    const oauthError = params.get("error_description") || params.get("error");
    if (oauthError) {
      setError(authErrorMessage(new Error(oauthError), "Google sign-in failed. Please try again."));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (!user) return;
      try {
        await ensureStoreForUser(user);
        router.replace(signedInHomePath(user.email));
      } catch (err) {
        console.error("Failed to prepare store:", err);
        setError("Signed in, but we could not open your store. Please try again.");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmail(email.trim().toLowerCase(), password);
    } catch (err: unknown) {
      console.error("Email login failed:", err);
      setError(authErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error("Google login failed:", err);
      setError(authErrorMessage(err, "Login failed. Please try again."));
      setLoading(false);
    }
  };

  return (
    <section className="bg-black w-full h-screen">
      <div className="min-h-[calc(100vh-10vh)] flex items-center justify-center pt-4">
        <div className="rounded-md p-8 max-w-md w-full flex flex-col items-center justify-center">
          <Image
            src="/white-logo.svg"
            alt="Product Share"
            width={150}
            height={150}
          />
          <div className="flex flex-col items-center justify-center gap-0">
            <h2 className="text-4xl font-semibold text-white text-center">
              Welcome Back
            </h2>
            <p className="text-sm text-white/50 text-center">
              Sign in to manage your store
            </p>
          </div>

          <form
            onSubmit={handleEmailLogin}
            className="flex flex-col gap-2 w-full bg-white rounded-xl px-4 py-8 mt-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-white rounded-xl transition-all text-sm disabled:opacity-50 hover:opacity-90"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-right">
              <Link
                href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-gray-300" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 shadow-lg"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </button>
          </form>

          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center w-full">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center w-full">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
