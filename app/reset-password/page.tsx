"use client";

import React, { useEffect, useState } from "react";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 bg-white border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-gray-900 placeholder:text-gray-400 text-sm disabled:opacity-50 hover:border-gray-300";

const getResetErrorMessage = (code?: string) => {
  switch (code) {
    case "auth/expired-action-code":
      return "This reset link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "This reset link is invalid. Please request a new one.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Failed to reset password. Please try again.";
  }
};

const ResetPasswordPage: React.FC = () => {
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("oobCode");
      const mode = params.get("mode");

      if (mode !== "resetPassword" || !code) {
        setError("Invalid or missing reset link. Please request a new one.");
        setVerifying(false);
        return;
      }

      try {
        const userEmail = await verifyPasswordResetCode(auth, code);
        setOobCode(code);
        setEmail(userEmail);
      } catch (err: unknown) {
        const firebaseError = err as { code?: string };
        setError(getResetErrorMessage(firebaseError.code));
      } finally {
        setVerifying(false);
      }
    };

    void init();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!oobCode) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.error("Reset password error:", firebaseError.code, firebaseError.message);
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
              New Password
            </h2>
            <p className="text-sm text-white/50 text-center">
              {verifying
                ? "Verifying your reset link..."
                : email
                  ? `Set a new password for ${email}`
                  : "Enter your new password"}
            </p>
          </div>

          {!verifying && oobCode && !success && (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-2 w-full bg-white rounded-xl px-4 py-8 mt-4"
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
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
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-primary text-white rounded-xl transition-all text-sm disabled:opacity-50 hover:opacity-90"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center w-full">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center w-full">
              {error}
              {!oobCode && (
                <Link
                  href="/forgot-password"
                  className="block mt-2 text-primary hover:underline"
                >
                  Request a new reset link
                </Link>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              <Link href="/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
