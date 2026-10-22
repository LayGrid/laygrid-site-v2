"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nextPath = searchParams.get("next") || "/planer";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Login fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Login fehlgeschlagen.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-black p-6 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">LayGrid Planer</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Testzugang für den Prototypen. Bitte E-Mail-Adresse und das
            gemeinsame Zugangspasswort eingeben.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
              placeholder="name@firma.ch"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              Zugangspasswort
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
              placeholder="Passwort"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/20 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Wird geprüft..." : "Planer öffnen"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-500">
          Hinweis: Die eingegebene E-Mail-Adresse und der Login-Zeitpunkt werden
          für die Testauswertung protokolliert.
        </div>
      </div>
    </section>
  );
}