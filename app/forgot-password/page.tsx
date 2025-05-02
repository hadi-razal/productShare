"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setEmail(""); // Clear the email field after submission
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-10vh)] -mt-6 flex items-center justify-center">
      <div className="rounded-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-950 text-center mb-6">
          Reset Your Password
        </h2>
        <form onSubmit={handlePasswordReset} className="space-y-6">
          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label
              className="block text-sm font-medium text-slate-950 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
              placeholder="Enter your email"            
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-primaryColor hover:bg-primaryColor/90 text-white shadow-lg"
          >
            Send Reset Email
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Remember your password?{" "}
            <Link href={"/login"} className="text-blue-950 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
