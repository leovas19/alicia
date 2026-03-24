"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const teasingMessages = [
  "Le bouton Non manque un peu de conviction.",
  "On dirait qu’il essaie de fuir son destin.",
  "Même lui commence à douter de sa réponse.",
  "Le Oui a pris la confiance, visiblement.",
  "t’as hésité un peu quand même non ?",
  "non ? on va faire comme si t’avais dit oui",
  "bug détecté… recommence",
  "erreur système 😅",
  "réponse invalide, merci de réessayer",
  "ce bouton est décoratif en fait",
  "je vais ignorer ça",
  "on va dire que c’est un faux non",
  "ce non est très douteux",
  "tu testes juste je pense",
  "c’était pour voir si ça marchait hein",
  "ok… mais j’abandonne pas",
  "je vais essayer encore un peu",
  "j’ai peut-être encore mes chances",
  "je suis patient",
  "je vais faire mieux alors",
  "je prends ça comme un défi",
  "c’est pas fini",
  "je vais te faire changer d’avis",
  "je reste là quand même",
  "je continue doucement",
  "tu dis ça maintenant",
  "on en reparle bientôt",
  "je suis pas inquiet",
  "ça va changer",
  "je te laisse un peu de temps",
  "je connais la fin de l’histoire",
  "spoiler : tu vas changer d’avis",
  "je parie sur moi",
  "on verra bien",
  "je reste confiant",
  "gugus refuse ce non",
  "gugus pas d’accord 😤",
  "gugus va recommencer",
  "gugus insiste un peu",
  "gugus comprend pas 😅",
  "gugus pense que c’est un oui caché",
  "gugus va faire mieux alors",
  "gugus triste mais motivé",
  "gugus relance la partie",
  "gugus croit en lui",
  "je comprends… mais j’abandonne pas",
  "ok… mais j’espère encore un peu",
  "je vais essayer de mériter un oui",
  "c’est pas fini pour moi",
  "je prends le temps qu’il faut",
  "je veux juste faire mieux",
  "je suis encore là",
  "je vais te le prouver autrement",
  "je peux faire mieux que ça",
  "la suite reste à écrire"
];

export function LandingChoice() {
  const router = useRouter();
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teasing, setTeasing] = useState<string | null>(null);

  const yesScale = 1 + noClicks * 0.08;
  const noScale = Math.max(0.72, 1 - noClicks * 0.05);

  async function unlockAndEnter() {
    if (loading) return;
    setAccepted(true);
    setLoading(true);

    try {
      await fetch("/api/unlock", {
        method: "POST"
      });
      window.setTimeout(() => {
        router.push("/photos");
        router.refresh();
      }, 700);
    } finally {
      setLoading(false);
    }
  }

  function handleNoClick() {
    setNoClicks((value) => value + 1);
    setTeasing(teasingMessages[Math.floor(Math.random() * teasingMessages.length)]);
  }

  return (
    <section className="panel fade-up flex min-h-[85vh] flex-col items-center justify-center text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Accueil</p>
      <h1 className="title-font max-w-2xl text-5xl leading-none md:text-7xl">Alicia aime Léo ?</h1>
      <p className="mt-4 max-w-md text-base leading-7 text-[var(--muted)]">
        Une expérience douce, un peu drôle, pleine de souvenirs, de sincérité et de petits
        signes.
      </p>

      <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          className="button-primary min-h-16 flex-1 text-lg"
          style={{ transform: `scale(${yesScale})` }}
          onClick={unlockAndEnter}
          type="button"
        >
          {loading ? "..." : "Oui"}
        </button>
        <button
          className="button-secondary min-h-16 flex-1 text-lg"
          style={{ transform: `scale(${noScale})` }}
          onClick={handleNoClick}
          type="button"
        >
          Non
        </button>
      </div>

      <div className="mt-8 min-h-20">
        {accepted ? (
          <div className="mx-auto max-w-md rounded-[24px] bg-[rgba(143,84,79,0.1)] px-5 py-4 text-[var(--accent)] animate-fade-up">
            <p className="title-font text-2xl">Bonne réponse.</p>
            <p className="mt-2 text-sm leading-6">
              Alors entre. Le reste du site s’ouvre seulement à partir d’ici.
            </p>
          </div>
        ) : teasing ? (
          <p className="mx-auto max-w-sm rounded-full bg-[rgba(255,255,255,0.54)] px-4 py-3 text-sm text-[var(--muted)]">
            {teasing}
          </p>
        ) : null}
      </div>
    </section>
  );
}
