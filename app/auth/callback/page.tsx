"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authErrorMessage,
  completeOAuthRedirect,
  ensureStoreForUser,
} from "@/lib/auth";
import { signedInHomePath } from "@/lib/super-admin";

const AuthCallbackPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const finishOAuth = async () => {
      try {
        const user = await completeOAuthRedirect();
        if (cancelled) return;

        if (!user) {
          router.replace("/login?error=Google%20sign-in%20failed.%20Please%20try%20again.");
          return;
        }

        await ensureStoreForUser(user);
        if (!cancelled) router.replace(signedInHomePath(user.email));
      } catch (err: unknown) {
        if (cancelled) return;
        const message = authErrorMessage(err, "Google sign-in failed. Please try again.");
        setError(message);
        router.replace(`/login?error=${encodeURIComponent(message)}`);
      }
    };

    void finishOAuth();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <section className="bg-black w-full h-screen flex items-center justify-center">
      <p className="text-white/70 text-sm">{error || "Signing you in..."}</p>
    </section>
  );
};

export default AuthCallbackPage;
