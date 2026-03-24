"use client";

import { useState } from "react";

function Character({
  variant,
  health
}: {
  variant: "leo" | "alicia";
  health?: number;
}) {
  const isLeo = variant === "leo";
  const tilt = isLeo ? `${(100 - (health || 100)) * 0.12}deg` : "-4deg";

  return (
    <div className="relative mx-auto h-52 w-36 [perspective:900px]">
      <div
        className="absolute inset-0 rounded-[34px] bg-[linear-gradient(180deg,rgba(255,251,247,0.95),rgba(240,225,213,0.86))] shadow-soft"
        style={{ transform: `rotateX(8deg) rotateY(${isLeo ? "-7deg" : "7deg"})` }}
      />
      <div
        className="absolute left-1/2 top-6 h-32 w-24 -translate-x-1/2 transition duration-500"
        style={{ transform: `translateX(-50%) rotate(${tilt})` }}
      >
        <div
          className={`absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full ${
            isLeo ? "bg-[#e4c4ab]" : "bg-[#f1d2b7]"
          }`}
        />
        <div
          className={`absolute left-1/2 top-[-2px] -translate-x-1/2 ${
            isLeo ? "h-8 w-14" : "h-9 w-16"
          } rounded-t-full ${
            isLeo ? "bg-[#6b412d]" : "bg-[#e7c35f]"
          }`}
          style={{
            boxShadow: isLeo
              ? "0 0 0 6px rgba(107,65,45,0.16), -10px 2px 0 rgba(107,65,45,0.9), 10px 3px 0 rgba(107,65,45,0.82), -5px -3px 0 rgba(107,65,45,0.72), 4px -4px 0 rgba(107,65,45,0.65)"
              : "0 0 0 7px rgba(231,195,95,0.12), -6px 3px 0 rgba(231,195,95,0.85), 6px 1px 0 rgba(231,195,95,0.85)"
          }}
        />
        {!isLeo ? (
          <div className="absolute left-1/2 top-[-10px] h-4 w-6 -translate-x-1/2 rounded-b-full bg-[#e9d8ab]" />
        ) : null}
        <div className="absolute left-[35%] top-[20px] h-1.5 w-1.5 rounded-full bg-[#2b1f1c]" />
        <div className="absolute right-[35%] top-[20px] h-1.5 w-1.5 rounded-full bg-[#2b1f1c]" />
        <div className="absolute left-1/2 top-[31px] h-1.5 w-6 -translate-x-1/2 rounded-full bg-[rgba(143,84,79,0.24)]" />
        <div
          className={`absolute left-1/2 top-[56px] h-16 w-20 -translate-x-1/2 rounded-t-[26px] rounded-b-[18px] ${
            isLeo ? "bg-[linear-gradient(180deg,#6d7c8e,#455261)]" : "bg-[linear-gradient(180deg,#f5e7d7,#d8a79f)]"
          }`}
        />
        <div className="absolute left-[26px] top-[68px] h-12 w-3 rounded-full bg-[#e7c6ac]" />
        <div className="absolute right-[26px] top-[68px] h-12 w-3 rounded-full bg-[#e7c6ac]" />
        <div className="absolute left-[39px] top-[118px] h-[4.5rem] w-4 rounded-full bg-[#4a3832]" />
        <div className="absolute right-[39px] top-[118px] h-[4.5rem] w-4 rounded-full bg-[#4a3832]" />
      </div>
      <div className="absolute bottom-4 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-[rgba(36,26,23,0.1)] blur-sm" />
    </div>
  );
}

export function GugusGame() {
  const [life, setLife] = useState(100);
  const [energy, setEnergy] = useState(0);
  const [message, setMessage] = useState("Léo entre dans l’arène avec tout son courage disponible.");

  function lowerLife(amount: number, text: string) {
    setLife((current) => {
      const next = Math.max(0, current - amount);
      setMessage(next === 0 ? "Gugus Léo s’est effondré avec panache." : text);
      return next;
    });
    setEnergy((current) => Math.min(100, current + 18));
  }

  function healLife() {
    setLife((current) => Math.min(100, current + 16));
    setEnergy((current) => Math.max(0, current - 10));
    setMessage("Alicia baisse un peu sa garde. Léo respire mieux.");
  }

  function specialMove() {
    if (energy < 50 || life === 0) {
      setMessage("Il faut un peu plus d’élan avant d’essayer son mouvement spécial.");
      return;
    }

    setEnergy((current) => Math.max(0, current - 50));
    setLife((current) => Math.max(0, current - 30));
    setMessage("Léo tente une esquive dramatique. C’est beau, un peu ridicule, mais ça marche.");
  }

  function fatalSilence() {
    if (life === 0) return;
    setLife(0);
    setEnergy((current) => Math.min(100, current + 30));
    setMessage("Plus me parler. Attaque fatale symbolique. Gugus Léo s’écroule immédiatement.");
  }

  function resetGame() {
    setLife(100);
    setEnergy(0);
    setMessage("Nouvelle tentative. Même coiffure courageuse, meilleure stratégie.");
  }

  return (
    <div className="panel section-grid">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div className="rounded-[28px] bg-[rgba(255,252,248,0.86)] p-5 text-center">
          <Character health={life} variant="leo" />
          <p className="title-font text-2xl">Gugus Léo</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Boucles courageuses, densité modérée.</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="rounded-full bg-[rgba(143,84,79,0.1)] px-4 py-2 text-sm text-[var(--accent)]">
            vs
          </div>
        </div>

        <div className="rounded-[28px] bg-[rgba(255,252,248,0.86)] p-5 text-center">
          <Character variant="alicia" />
          <p className="title-font text-2xl">Gugus Alicia</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Blonde, royale, pas vraiment impressionnée.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] bg-[rgba(255,252,248,0.9)] p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="title-font text-2xl">Barre de vie</span>
            <span className="pill">{life}%</span>
          </div>
          <div className="h-5 rounded-full bg-[rgba(77,49,43,0.08)] p-1">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${life}%`,
                background: life === 0 ? "#241a17" : "linear-gradient(90deg,#8f544f,#d9a7a0)"
              }}
            />
          </div>
        </div>

        <div className="rounded-[28px] bg-[rgba(255,252,248,0.9)] p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="title-font text-2xl">Énergie dramatique</span>
            <span className="pill">{energy}%</span>
          </div>
          <div className="h-5 rounded-full bg-[rgba(77,49,43,0.08)] p-1">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${energy}%`,
                background: "linear-gradient(90deg,#c6a46c,#f0dfbf)"
              }}
            />
          </div>
        </div>
      </div>

      <p
        className={`rounded-[24px] px-4 py-4 text-center text-sm leading-6 ${
          life === 0 ? "bg-[rgba(36,26,23,0.08)] animate-bounce" : "bg-[rgba(255,255,255,0.5)]"
        }`}
      >
        {message}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          className="button-secondary min-h-14"
          onClick={() => lowerLife(20, "Un regard d’Alicia. Dégâts critiques.")}
          type="button"
        >
          Regard fatal
        </button>
        <button
          className="button-secondary min-h-14"
          onClick={() => lowerLife(35, "Phrase sèche. Gugus vacille.")}
          type="button"
        >
          Phrase glaciale
        </button>
        <button className="button-primary min-h-14" onClick={healLife} type="button">
          Pardon doux
        </button>
        <button
          className="button-secondary min-h-14"
          onClick={() => lowerLife(18, "Coup de pied dans les roubignoles. Les boucles perdent un peu de tenue.")}
          type="button"
        >
          Coup de pied dans les roubignoles
        </button>
        <button
          className="button-secondary min-h-14"
          onClick={() => lowerLife(24, "Etouffement avec coussin. Dégâts faibles, humiliation excellente.")}
          type="button"
        >
          Etouffement avec coussin
        </button>
        <button
          className="button-secondary min-h-14"
          onClick={fatalSilence}
          type="button"
        >
          Plus me parler
        </button>
      </div>

      <button className="button-secondary min-h-14" onClick={specialMove} type="button">
        Mouvement spécial de Léo
      </button>

      {life === 0 ? (
        <button className="button-primary mx-auto" onClick={resetGame} type="button">
          Recommencer
        </button>
      ) : null}
    </div>
  );
}
