"use client";

import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/store");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google login successful", result.user);
      router.push("/store");
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-10vh)] flex items-center justify-center">
      <div className="rounded-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-950 text-center mb-6">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 shadow-lg"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-950 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
