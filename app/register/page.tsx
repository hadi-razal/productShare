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

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

     const rawUsername = user.email?.split("@")[0] || "user";
const safeUsername = rawUsername.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
const finalUsername = safeUsername + Math.floor(Math.random() * 1000);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: finalUsername, 
        name: user.displayName ,
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

       
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {error}
          </div>
        )}


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
