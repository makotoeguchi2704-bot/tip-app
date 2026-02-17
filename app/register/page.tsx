"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const slug = username.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (slug.length < 3) {
      setError("ユーザー名は3文字以上の英数字で入力してください");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", slug)
      .single();

    if (existing) {
      setError("このユーザー名は既に使われています");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        username: slug,
        display_name: displayName,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-retro-dark px-4">
      <div className="w-full max-w-md border-4 border-retro-green bg-retro-card p-8">
        <h1 className="mb-8 text-center text-lg text-retro-green">
          {">"} REGISTER
        </h1>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs text-retro-amber">
              USERNAME:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="makoto"
              required
              className="w-full border-2 border-retro-green bg-retro-dark px-4 py-3 text-xs text-retro-green outline-none transition placeholder:text-retro-green/30 focus:border-retro-amber"
            />
            <p className="mt-1 text-xs text-retro-dim/50">
              /tip/{username.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "username"}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs text-retro-amber">
              DISPLAY NAME:
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Makoto"
              required
              className="w-full border-2 border-retro-green bg-retro-dark px-4 py-3 text-xs text-retro-green outline-none transition placeholder:text-retro-green/30 focus:border-retro-amber"
            />
          </div>

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
              minLength={6}
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
            {loading ? ">> LOADING..." : ">> REGISTER >>"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-retro-dim">
          HAVE ACCOUNT?{" "}
          <Link href="/login" className="text-retro-amber hover:underline">
            LOGIN
          </Link>
        </p>
      </div>
    </div>
  );
}
