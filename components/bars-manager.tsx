"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BarsManagerProps = {
  trustValue: number;
  relationshipValue: number;
  hasInitialized: boolean;
};


export function BarsManager({
  trustValue,
  relationshipValue,
  hasInitialized
}: BarsManagerProps) {
  const router = useRouter();
  const [trust, setTrust] = useState(trustValue);
  const [relationship, setRelationship] = useState(relationshipValue);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveBars() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/bars", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trustValue: trust,
          relationshipValue: relationship
        })
      });

      if (!response.ok) {
        throw new Error("Impossible d’enregistrer les barres.");
      }

      setMessage("Barres enregistrées.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Zone privée</p>
        <h1 className="title-font mt-2 text-4xl">Gestion des barres</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
          {hasInitialized
            ? "Les barres sont déjà définies. Tu peux les laisser comme elles sont, ou les ajuster seulement si tu en as envie."
            : "Première mise en place: tu peux régler les barres une fois ici, puis le site arrêtera de te le redemander automatiquement."}
        </p>
      </div>

      <label className="block">
        <div className="mb-2 flex items-center justify-between">
          <span className="title-font text-xl">Confiance</span>
          <span className="pill">{trust}%</span>
        </div>
        <input
          className="w-full accent-[var(--accent)]"
          max={100}
          min={0}
          type="range"
          value={trust}
          onChange={(event) => setTrust(Number(event.target.value))}
        />
      </label>

      <label className="block">
        <div className="mb-2 flex items-center justify-between">
          <span className="title-font text-xl">Rapprochement</span>
          <span className="pill">{relationship}%</span>
        </div>
        <input
          className="w-full accent-[var(--gold)]"
          max={100}
          min={0}
          type="range"
          value={relationship}
          onChange={(event) => setRelationship(Number(event.target.value))}
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button className="button-primary" disabled={loading} onClick={saveBars} type="button">
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
        <form action="/api/auth/logout" method="post">
          <button className="button-secondary" type="submit">
            Se déconnecter
          </button>
        </form>
      </div>

      {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
    </div>
  );
}
