"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function BookForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData
      .getAll("pages")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    setLoading(true);
    setMessage(null);

    try {
      if (files.length === 0) {
        throw new Error("Ajoute au moins une image.");
      }

      const typedTitle = String(formData.get("title") || "").trim();
      const inferredTitle = files[0]?.name
        ? files[0].name.replace(/\.[^.]+$/, "")
        : "";
      const title = typedTitle || inferredTitle;
      const pageUrls: string[] = [];

      for (const file of files) {
        const uploadResponse = await fetch("/api/upload/book-page", {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "x-file-name": encodeURIComponent(file.name)
          },
          body: file
        });

        if (!uploadResponse.ok) {
          const json = (await uploadResponse.json()) as { error?: string };
          throw new Error(json.error || "Impossible d’envoyer les images.");
        }

        const uploadJson = (await uploadResponse.json()) as {
          url: string;
        };
        pageUrls.push(uploadJson.url);
      }

      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          dateLabel: String(formData.get("dateLabel") || ""),
          coverImageUrl: pageUrls[0] || null,
          pages: pageUrls
        })
      });

      if (!response.ok) {
        const json = (await response.json()) as { error?: string };
        throw new Error(json.error || "Impossible d’ajouter le livre.");
      }

      formRef.current?.reset();
      setMessage("Livre ajouté.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="panel space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Ajouter un livre</p>
        <h2 className="title-font mt-2 text-2xl">Un livre en images</h2>
      </div>

      <input className="input-field" name="title" placeholder="Titre du livre (optionnel)" />
      <input className="input-field" name="dateLabel" placeholder="Date éventuelle" />
      <input
        className="input-field cursor-pointer"
        name="pages"
        accept="image/*,.heic,.heif,.HEIC,.HEIF"
        type="file"
        multiple
        required
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          Ajoute plusieurs images. Elles seront rangées dans l’ordre d’arrivée comme les pages d’un livre.
        </p>
        <button className="button-primary" disabled={loading} type="submit">
          {loading ? "Enregistrement..." : "Ajouter un livre"}
        </button>
      </div>

      {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
    </form>
  );
}
