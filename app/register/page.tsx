"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/store");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        username,
        whatsappNumber,
        email,
        premiumUser: false,
        createdAt: new Date().toISOString(),
      });

      console.log("Account created successfully:", user);
    } catch (error: any) {
      console.error("Error creating account:", error);
      setError(error.message || "Registration failed. Please try again.");
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

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || name,
        email: user.email,
        premiumUser: false,
        createdAt: new Date().toISOString(),
      });

      console.log("Google account linked successfully:", user);
    } catch (error: any) {
      console.error("Error with Google sign-in:", error);
      setError(error.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10vh)] flex items-center justify-center pt-4">
      <div className="rounded-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-950 text-center mb-6">
          Create Your Account
        </h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="flex items-center justify-center w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 shadow-lg mb-6"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-slate-950 mb-2"
              htmlFor="name"
            >
              Store Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
              placeholder="Your store name"
            />
          </div>

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
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-950 mb-2"
              htmlFor="username"
            >
              Store Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
              placeholder="your-store-name"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-950 mb-2"
              htmlFor="WhatsappNumber"
            >
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="WhatsappNumber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-950 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-primary w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-primaryColor hover:bg-primaryColor/90 text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
            {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-950 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
