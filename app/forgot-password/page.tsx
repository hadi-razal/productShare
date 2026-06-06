"use client";

import React, { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

const inputClass =
  "w-full px-4 py-3 bg-white border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-gray-900 placeholder:text-gray-400 text-sm disabled:opacity-50 hover:border-gray-300";

const getResetErrorMessage = (code?: string) => {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Failed to send password reset email. Please try again.";
  }
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const resetUrl = `${window.location.origin}/reset-password`;

      await sendPasswordResetEmail(
        auth,
        email.trim().toLowerCase(),
        {
          url: resetUrl,
          handleCodeInApp: true,
        },
      );

      setMessage(
        "Password reset email sent! Check your inbox and spam folder.",
      );
      setEmail("");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.error("Password reset error:", firebaseError.code, firebaseError.message);
      setError(getResetErrorMessage(firebaseError.code));
    } finally {
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
              Reset Password
            </h2>
            <p className="text-sm text-white/50 text-center">
              We&apos;ll email you a link to reset your password
            </p>
          </div>

          <form
            onSubmit={handlePasswordReset}
            className="flex flex-col gap-2 w-full bg-white rounded-xl px-4 py-8 mt-4"
          >
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              placeholder="Email"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-white rounded-xl transition-all text-sm disabled:opacity-50 hover:opacity-90"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center w-full">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center w-full">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
