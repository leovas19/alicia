"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function PhotoUploader() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const files = formData
      .getAll("photos")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) {
      setMessage("Choisis au moins une image ou une vidéo.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setProgress({ current: 0, total: files.length });

    try {
      let successCount = 0;
      const failed: string[] = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const response = await fetch("/api/upload/photo", {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "x-file-name": encodeURIComponent(file.name)
          },
          body: file
        });

        if (response.ok) {
          successCount += 1;
        } else {
          const json = (await response.json()) as { error?: string };
          failed.push(`${file.name}: ${json.error || "échec d’upload"}`);
        }

        setProgress({ current: index + 1, total: files.length });
      }

      formRef.current?.reset();
      if (successCount > 0) {
        router.refresh();
      }

      if (failed.length === 0) {
        setMessage(
          successCount === 1 ? "Média ajouté." : `${successCount} médias ajoutés avec succès.`
        );
      } else if (successCount > 0) {
        setMessage(
          `${successCount} média(x) ajouté(s), ${failed.length} refusé(s). ${failed.slice(0, 3).join(" | ")}`
        );
      } else {
        setMessage(failed.slice(0, 3).join(" | "));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="panel flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          Ajouter des médias
        </p>
        <h2 className="title-font mt-2 text-2xl">Images et vidéos de souvenirs</h2>
      </div>
      <input
        className="input-field cursor-pointer"
        name="photos"
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif,.tif,.tiff,.heic,.heif,.JPG,.JPEG,.PNG,.WEBP,.GIF,.BMP,.AVIF,.TIF,.TIFF,.HEIC,.HEIF,video/*,.mp4,.mov,.m4v,.webm,.avi,.mkv,.mpeg,.mpg,.mts,.m2ts,.3gp,.MP4,.MOV,.M4V,.WEBM,.AVI,.MKV,.MPEG,.MPG,.MTS,.M2TS,.3GP"
        type="file"
        multiple
        required
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          Tu peux envoyer un gros lot en une fois, y compris 83 fichiers, tant que chaque fichier respecte sa limite.
        </p>
        <button className="button-primary" disabled={loading} type="submit">
          {loading ? "Ajout..." : "Ajouter un média"}
        </button>
      </div>
      {progress ? (
        <p className="text-sm text-[var(--muted)]">
          Envoi en cours: {progress.current} / {progress.total}
        </p>
      ) : null}
      {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
    </form>
  );
}
