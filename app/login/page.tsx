"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-retro-dark px-4">
      <div className="w-full max-w-md border-4 border-retro-green bg-retro-card p-8">
        <h1 className="mb-8 text-center text-lg text-retro-green">
          {">"} LOGIN
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs text-retro-amber">
              EMAIL:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-retro-green bg-retro-dark px-4 py-3 text-xs text-retro-green outline-none transition focus:border-retro-amber"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-retro-amber">
              PASSWORD:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-retro-green bg-retro-dark px-4 py-3 text-xs text-retro-green outline-none transition focus:border-retro-amber"
            />
          </div>

          {error && (
            <p className="text-center text-xs text-retro-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-retro-green bg-retro-green py-3 text-xs text-retro-dark transition hover:bg-retro-amber hover:border-retro-amber disabled:opacity-50"
          >
            {loading ? ">> LOADING..." : ">> LOGIN >>"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-retro-dim">
          NO ACCOUNT?{" "}
          <Link href="/register" className="text-retro-amber hover:underline">
            REGISTER
          </Link>
        </p>
      </div>
    </div>
  );
}
