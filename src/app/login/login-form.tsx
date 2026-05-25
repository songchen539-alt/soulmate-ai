"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/chat";
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function getCallbackUrl() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    return `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
  }

  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: getCallbackUrl() },
        });

    setLoading(false);

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setStatus("Check your email to confirm your account.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function signInWithGoogle() {
    setLoading(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getCallbackUrl() },
    });
    if (error) {
      setStatus(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-purple-950/20">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">{'💜'}</div>
          <h1 className="text-2xl font-semibold tracking-normal">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/50">Continue your SoulMate AI journey.</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-purple-400"
            type="email" placeholder="Email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-purple-400"
            type="password" placeholder="Password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          {status ? (
            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">{status}</p>
          ) : null}
          <button className="w-full rounded-full bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button className="mt-4 w-full rounded-full border border-white/10 px-5 py-3 text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading} onClick={signInWithGoogle} type="button">
          Continue with Google
        </button>

        <button className="mt-6 w-full text-sm text-white/60 transition hover:text-white"
          onClick={() => { setStatus(null); setMode(mode === "login" ? "signup" : "login"); }} type="button">
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
