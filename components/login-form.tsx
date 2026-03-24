"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: String(formData.get("password") || "")
        })
      });

      if (!response.ok) {
        const json = (await response.json()) as { error?: string };
        throw new Error(json.error || "Connexion impossible.");
      }

      const json = (await response.json()) as { redirectTo?: string };
      router.push(json.redirectTo || "/confiance");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel mx-auto max-w-md space-y-4">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Accès discret</p>
        <h1 className="title-font mt-2 text-4xl">Connexion Alicia</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          La seule clef visible du site. Rien d’autre n’a besoin de ressembler à un panneau
          d’administration.
        </p>
      </div>

      <div className="rounded-[20px] border border-[var(--border)] bg-[rgba(255,252,248,0.88)] px-4 py-3 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Compte fixe</p>
        <p className="title-font mt-1 text-2xl">Alicia</p>
      </div>
      <input
        className="input-field"
        name="password"
        placeholder="Mot de passe"
        type="password"
        required
      />

      <button className="button-primary w-full" disabled={loading} type="submit">
        {loading ? "Connexion..." : "Entrer"}
      </button>

      {error ? <p className="text-center text-sm text-[var(--accent)]">{error}</p> : null}
    </form>
  );
}
