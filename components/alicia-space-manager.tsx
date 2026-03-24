"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MessageItem = {
  id: string;
  content: string;
};

type ChallengeItem = {
  id: string;
  title: string;
  status: string;
};

type AliciaSpaceManagerProps = {
  messages: MessageItem[];
  challenges: ChallengeItem[];
};

const challengeStatuses = ["à faire", "en cours", "fait"] as const;

export function AliciaSpaceManager({
  messages: initialMessages,
  challenges: initialChallenges
}: AliciaSpaceManagerProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [note, setNote] = useState("");
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeStatus, setChallengeStatus] =
    useState<(typeof challengeStatuses)[number]>("à faire");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function addNote() {
    if (!note.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/free-space", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: note })
      });

      if (!response.ok) {
        throw new Error("Impossible d’ajouter la note.");
      }

      const created = (await response.json()) as MessageItem;
      setMessages((current) => [created, ...current]);
      setNote("");
      setMessage("Note ajoutée.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(id: string) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/free-space/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Impossible de supprimer la note.");
      }

      setMessages((current) => current.filter((item) => item.id !== id));
      setMessage("Note supprimée.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  async function addChallenge() {
    if (!challengeTitle.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: challengeTitle,
          status: challengeStatus
        })
      });

      if (!response.ok) {
        throw new Error("Impossible d’ajouter le défi.");
      }

      const created = (await response.json()) as ChallengeItem;
      setChallenges((current) => [...current, created]);
      setChallengeTitle("");
      setChallengeStatus("à faire");
      setMessage("Défi ajouté.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  async function updateChallengeStatus(id: string, status: string) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error("Impossible de mettre à jour le défi.");
      }

      setChallenges((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item))
      );
      setMessage("Statut mis à jour.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteChallenge(id: string) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Impossible de supprimer le défi.");
      }

      setChallenges((current) => current.filter((item) => item.id !== id));
      setMessage("Défi supprimé.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Espace Alicia</p>
        <h2 className="title-font mt-2 text-4xl">Défis et espace libre</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Cette zone est privée. Ici, Alicia seule peut ajouter, modifier ou supprimer les notes et
          les défis affichés publiquement.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4 rounded-[26px] bg-[rgba(255,252,248,0.86)] p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Espace libre</p>
            <h3 className="title-font mt-2 text-2xl">Ajouter une note</h3>
          </div>
          <textarea
            className="input-field min-h-32"
            placeholder="Ecrire une note..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <button className="button-primary" disabled={loading} onClick={addNote} type="button">
            Ajouter la note
          </button>
          <div className="grid gap-3">
            {messages.length === 0 ? (
              <p className="rounded-[20px] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                Aucune note pour l’instant.
              </p>
            ) : (
              messages.map((item) => (
                <article key={item.id} className="rounded-[20px] bg-white/70 p-4">
                  <p className="text-sm leading-7">{item.content}</p>
                  <button
                    className="mt-3 text-sm text-[var(--accent)]"
                    disabled={loading}
                    onClick={() => deleteNote(item.id)}
                    type="button"
                  >
                    Supprimer
                  </button>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-[26px] bg-[rgba(255,252,248,0.86)] p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Défis</p>
            <h3 className="title-font mt-2 text-2xl">Gérer les défis</h3>
          </div>
          <input
            className="input-field"
            placeholder="Titre du défi"
            value={challengeTitle}
            onChange={(event) => setChallengeTitle(event.target.value)}
          />
          <select
            className="input-field"
            value={challengeStatus}
            onChange={(event) =>
              setChallengeStatus(event.target.value as (typeof challengeStatuses)[number])
            }
          >
            {challengeStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button className="button-primary" disabled={loading} onClick={addChallenge} type="button">
            Ajouter le défi
          </button>
          <div className="grid gap-3">
            {challenges.length === 0 ? (
              <p className="rounded-[20px] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                Aucun défi pour l’instant.
              </p>
            ) : (
              challenges.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[20px] bg-white/70 p-4"
                >
                  <p className="title-font text-xl">{item.title}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <select
                      className="input-field max-w-40"
                      value={item.status}
                      onChange={(event) => updateChallengeStatus(item.id, event.target.value)}
                    >
                      {challengeStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-sm text-[var(--accent)]"
                      disabled={loading}
                      onClick={() => deleteChallenge(item.id)}
                      type="button"
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
    </section>
  );
}
