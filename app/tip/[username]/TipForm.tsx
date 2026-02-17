"use client";

import { useState } from "react";

const PRESETS = [100, 500, 1000, 3000];

export default function TipForm({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePreset = (value: number) => {
    setAmount(value);
    setError("");
  };

  const handleSubmit = async () => {
    const num = Number(amount);
    if (!num || num < 50) {
      setError("50円以上を入力してください");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: num, username }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "エラーが発生しました");
        setLoading(false);
      }
    } catch {
      setError("通信エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-retro-dark px-4">
      <div className="w-full max-w-md border-4 border-retro-green bg-retro-card p-8">
        <h1 className="mb-2 text-center text-sm text-retro-green">
          TIP TO {displayName}
        </h1>
        <p className="mb-6 text-center text-xs text-retro-dim/70">
          SELECT AMOUNT
        </p>

        <div className="mb-4 grid grid-cols-2 gap-3">
          {PRESETS.map((value) => (
            <button
              key={value}
              onClick={() => handlePreset(value)}
              className={`border-2 py-3 text-sm transition ${
                amount === value
                  ? "border-retro-amber bg-retro-amber text-retro-dark"
                  : "border-retro-green bg-retro-dark text-retro-green hover:border-retro-amber hover:text-retro-amber"
              }`}
            >
              {value.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-retro-amber">
              ¥
            </span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="CUSTOM"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value === "" ? "" : Number(e.target.value));
                setError("");
              }}
              className="w-full border-2 border-retro-green bg-retro-dark py-3 pl-10 pr-4 text-sm text-retro-green outline-none transition placeholder:text-retro-green/30 focus:border-retro-amber"
            />
          </div>
        </div>

        {error && (
          <p className="mb-4 text-center text-xs text-retro-red">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !amount}
          className="w-full border-2 border-retro-green bg-retro-green py-3 text-xs text-retro-dark transition hover:bg-retro-amber hover:border-retro-amber disabled:opacity-50"
        >
          {loading ? ">> PROCESSING..." : ">> PAY >>"}
        </button>
      </div>
    </div>
  );
}
