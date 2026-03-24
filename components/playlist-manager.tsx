"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PlaylistItem = {
  id: string;
  title: string;
  artist: string;
  url: string | null;
  rating: number;
};

type PlaylistManagerProps = {
  items: PlaylistItem[];
};

function Stars({
  rating,
  editable,
  onRate
}: {
  rating: number;
  editable: boolean;
  onRate?: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        return (
          <button
            key={value}
            className={`text-xl ${value <= rating ? "text-[var(--gold)]" : "text-[rgba(77,49,43,0.22)]"} ${editable ? "" : "cursor-default"}`}
            disabled={!editable}
            onClick={() => onRate?.(value)}
            type="button"
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export function PlaylistManager({ items: initialItems }: PlaylistManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function addItem() {
    if (!title.trim() || !artist.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          artist,
          url,
          rating: 0
        })
      });

      if (!response.ok) {
        throw new Error("Impossible d’ajouter cette musique.");
      }

      const created = (await response.json()) as PlaylistItem;
      setItems((current) => [...current, created]);
      setTitle("");
      setArtist("");
      setUrl("");
      setMessage("Musique ajoutée.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  async function rateItem(id: string, rating: number) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/playlist/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ rating })
      });

      if (!response.ok) {
        throw new Error("Impossible d’enregistrer la note.");
      }

      setItems((current) => current.map((item) => (item.id === id ? { ...item, rating } : item)));
      setMessage("Note enregistrée.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/playlist/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Impossible de supprimer cette musique.");
      }

      setItems((current) => current.filter((item) => item.id !== id));
      setMessage("Musique supprimée.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="panel space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Partager une musique</p>
          <h2 className="title-font mt-2 text-3xl">Ajouter une musique</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="input-field"
            placeholder="Titre"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            className="input-field"
            placeholder="Artiste"
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
          />
          <input
            className="input-field"
            placeholder="Lien (optionnel)"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <button className="button-primary" disabled={loading} onClick={addItem} type="button">
          Ajouter la musique
        </button>
        {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
      </section>

      <section className="grid gap-4">
        {items.map((item, index) => (
          <article key={item.id} className="panel flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(143,84,79,0.1)] title-font text-xl text-[var(--accent)]">
                {index + 1}
              </div>
              <div>
                <h2 className="title-font text-2xl">{item.title}</h2>
                <p className="text-sm text-[var(--muted)]">{item.artist}</p>
                <div className="mt-2">
                  <Stars editable={true} onRate={(value) => rateItem(item.id, value)} rating={item.rating} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {item.url ? (
                <a className="button-secondary" href={item.url} rel="noreferrer" target="_blank">
                  Écouter
                </a>
              ) : null}
              <button
                className="button-secondary"
                disabled={loading}
                onClick={() => deleteItem(item.id)}
                type="button"
              >
                Supprimer
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
