"use client";

import React, { useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  fetchSignInMethodsForEmail 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/ModalProps";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        router.push("/store");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First check if email exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length === 0) {
        throw new Error("No account found with this email.");
      }

      // Check if email is verified before attempting login
      // Note: This requires your Firebase security rules to allow checking verification status
      // Alternatively, you can attempt login and check verification status after
      
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Strict verification check - only allow verified users
      if (!user.emailVerified) {
        await auth.signOut(); // Immediately sign out unverified users
        setShowVerificationModal(true);
        throw new Error("Email not verified. Please verify your email first.");
      }

      console.log("Logged In Successfully", user);
      router.push("/store");
    } catch (error: any) {
      console.log("Login failed:", error);
      setError(error.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeVerificationModal = () => {
    setShowVerificationModal(false);
  };

  return (
    <div className="min-h-[calc(100vh-10vh)] flex items-center justify-center">
      <div className="rounded-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-950 text-center mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="email">
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
          <div className="relative">
            <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md pr-12"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 ${
              loading ? "bg-gray-400" : "bg-primaryColor hover:bg-primaryColor/90"
            } text-white shadow-lg`}
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
          </button>
        </form>
        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{" "}
            <Link href={"/register"} className="text-blue-950 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-sm text-gray-700">
            Forgot password?{" "}
            <Link href={"/forgot-password"} className="text-blue-950 hover:underline">
              Click here
            </Link>
          </p>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <Modal onClose={closeVerificationModal}>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Email Verification Required</h3>
            <p className="mb-4">
              You must verify your email <span className="font-semibold">{email}</span> before logging in.
            </p>
            <p className="mb-4">
              Please check your inbox (and spam folder) for the verification email we sent when you registered.
            </p>
            <button
              onClick={closeVerificationModal}
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90"
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LoginPage;