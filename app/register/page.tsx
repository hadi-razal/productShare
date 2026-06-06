"use client";

import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
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
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !showOtpStep) {
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
      const methods = await fetchSignInMethodsForEmail(
        auth,
        userEmail.trim().toLowerCase(),
      );
      if (methods.length > 0) {
        redirectToLogin(userEmail, true);
        return true;
      }
    } catch {
      // Continue if email enumeration protection blocks lookup
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

      const credential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      const rawUsername = email.split("@")[0] || "user";
      const safeUsername = rawUsername
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      const finalUsername = safeUsername + Math.floor(Math.random() * 1000);

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        username: finalUsername,
        name: email.split("@")[0],
        email: normalizedEmail,
        premiumUser: false,
        createdAt: new Date().toISOString(),
      });

      // Keep session active — createUser already signs the user in.
      // Forcing signOut here causes auth/invalid-credential on immediate re-login.
      redirectToLogin(normalizedEmail);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };

      if (firebaseError.code === "auth/email-already-in-use") {
        redirectToLogin(email, true);
        return;
      }

      const message =
        firebaseError.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const existingUser = await getDoc(doc(db, "users", user.uid));
      if (existingUser.exists()) {
        await signOut(auth);
        router.push("/login");
        return;
      }

      const rawUsername = user.email?.split("@")[0] || "user";
      const safeUsername = rawUsername
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      const finalUsername = safeUsername + Math.floor(Math.random() * 1000);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: finalUsername,
        name: user.displayName,
        email: user.email,
        premiumUser: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again.";
      setError(message);
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
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
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
