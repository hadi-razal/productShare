"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  authErrorMessage,
  ensureStoreForUser,
  onAuthChange,
  signInWithGoogle,
  signUpWithEmail,
  usernameFromIdentity,
} from "@/lib/auth";
import { createStore, getStoreByEmail } from "@/lib/db";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";

const inputClass =
  "w-full px-4 py-3 bg-white border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-gray-900 placeholder:text-gray-400 text-sm disabled:opacity-50 hover:border-gray-300";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user && !showOtpStep) {
        await ensureStoreForUser(user);
        router.push("/store");
      }
    });
    return () => unsubscribe();
  }, [router, showOtpStep]);

  const redirectToLogin = (userEmail: string, exists = false) => {
    const params = new URLSearchParams({
      email: userEmail.trim().toLowerCase(),
      ...(exists ? { exists: "true" } : { registered: "true" }),
    });
    router.push(`/login?${params.toString()}`);
  };

  const checkExistingUser = async (userEmail: string) => {
    try {
      const existing = await getStoreByEmail(userEmail.trim().toLowerCase());
      if (existing) {
        redirectToLogin(userEmail, true);
        return true;
      }
    } catch {
      // Continue if lookup fails
    }
    return false;
  };

  const handleRegister = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const exists = await checkExistingUser(email.trim());
      if (exists) return;

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code.");
      }

      setShowOtpStep(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");

    if (!otp.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Invalid verification code.");
      }

      const exists = await checkExistingUser(email.trim());
      if (exists) return;

      const normalizedEmail = email.trim().toLowerCase();
      const user = await signUpWithEmail(normalizedEmail, password);
      await createStore(user.uid, {
        username: usernameFromIdentity(normalizedEmail),
        name: email.split("@")[0],
        email: normalizedEmail,
        premiumUser: false,
      });

      redirectToLogin(normalizedEmail);
    } catch (err: unknown) {
      const message = authErrorMessage(err, "Registration failed. Please try again.");
      if (message.toLowerCase().includes("already")) {
        redirectToLogin(email, true);
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(authErrorMessage(err, "Google sign-in failed. Please try again."));
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
              Start Your Free Trial
            </h2>
            <p className="text-sm text-white/50 text-center">
              3 Days free, then ₹99 per month
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full bg-white rounded-xl px-4 py-8 mt-4">
            {!showOtpStep ? (
              <>
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
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-primary text-white rounded-xl transition-all text-sm disabled:opacity-50 hover:opacity-90"
                >
                  {loading ? "Sending code..." : "Register"}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 text-center mb-1">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Verification code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  disabled={loading}
                  className={`${inputClass} text-center tracking-[0.4em] font-semibold`}
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-primary text-white rounded-xl transition-all text-sm disabled:opacity-50 hover:opacity-90"
                >
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpStep(false);
                    setOtp("");
                    setError("");
                  }}
                  disabled={loading}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Back
                </button>
              </>
            )}

            {!showOtpStep && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-gray-300" />
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-300" />
                </div>

                <button
                  onClick={handleGoogleRegister}
                  disabled={loading}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 shadow-lg"
                >
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Continue with Google
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center w-full">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Already have an account?{" "}
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

export default RegisterPage;
