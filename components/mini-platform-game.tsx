"use client";

import { useEffect, useRef, useState } from "react";

const WORLD_WIDTH = 340;
const WORLD_HEIGHT = 640;
const PLAYER_SIZE = 28;
const gravity = 0.72;
const moveSpeed = 3.4;
const jumpVelocity = -11.4;

const platforms = [
  { x: 0, y: 608, width: 340, height: 32 },
  { x: 18, y: 528, width: 120, height: 16 },
  { x: 176, y: 462, width: 126, height: 16 },
  { x: 36, y: 392, width: 124, height: 16 },
  { x: 192, y: 320, width: 108, height: 16 },
  { x: 42, y: 246, width: 132, height: 16 },
  { x: 202, y: 170, width: 98, height: 16 },
  { x: 96, y: 98, width: 150, height: 16 }
];

const obstacles = [
  { x: 74, y: 510, width: 22, height: 18 },
  { x: 220, y: 444, width: 26, height: 18 },
  { x: 108, y: 374, width: 22, height: 18 },
  { x: 234, y: 302, width: 24, height: 18 },
  { x: 110, y: 228, width: 24, height: 18 }
];

function ConfettiLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 34 }).map((_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            left: `${(index * 11) % 100}%`,
            animationDelay: `${(index % 6) * 0.18}s`,
            animationDuration: `${3.1 + (index % 5) * 0.3}s`,
            background:
              index % 4 === 0
                ? "#f6b6a8"
                : index % 4 === 1
                  ? "#f3dd95"
                  : index % 4 === 2
                    ? "#d0b0f0"
                    : "#9ed7cc"
          }}
        />
      ))}
    </div>
  );
}

function RoyalFigure() {
  return (
    <div className="absolute right-7 top-8 h-28 w-24">
      <div className="absolute left-1/2 top-0 h-5 w-8 -translate-x-1/2 rounded-b-full bg-[#f1e4b8]" />
      <div className="absolute left-1/2 top-3 h-11 w-11 -translate-x-1/2 rounded-full bg-[#f4d9bf]" />
      <div className="absolute left-1/2 top-1 h-6 w-12 -translate-x-1/2 rounded-t-full bg-[#ebc95c]" />
      <div className="absolute left-1/2 top-12 h-14 w-16 -translate-x-1/2 rounded-t-[22px] rounded-b-[18px] bg-[linear-gradient(180deg,#fff4ea,#e4b8b1)]" />
      <div className="absolute left-1/2 top-[68px] h-5 w-20 -translate-x-1/2 rounded-full bg-[rgba(255,255,255,0.55)] blur-sm" />
    </div>
  );
}

export function MiniPlatformGame() {
  const [position, setPosition] = useState({ x: 26, y: 580, vy: 0 });
  const [message, setMessage] = useState(
    "Monte jusqu’à Alicia. Deux étages de plus t’attendent maintenant."
  );
  const [won, setWon] = useState(false);
  const [pressed, setPressed] = useState({ left: false, right: false });
  const canJump = useRef(true);

  function resetGame(text = "On repart du bas, mais avec une meilleure humeur.") {
    setPosition({ x: 26, y: 580, vy: 0 });
    setWon(false);
    canJump.current = true;
    setMessage(text);
  }

  function triggerJump() {
    if (!canJump.current || won) return;
    canJump.current = false;
    setPosition((current) => ({ ...current, vy: jumpVelocity }));
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPosition((current) => {
        if (won) return current;

        const horizontal = pressed.left ? -moveSpeed : pressed.right ? moveSpeed : 0;
        let nextX = Math.min(WORLD_WIDTH - PLAYER_SIZE, Math.max(0, current.x + horizontal));
        let nextY = current.y + current.vy;
        let nextVy = current.vy + gravity;
        let grounded = false;

        for (const platform of platforms) {
          const playerBottom = nextY + PLAYER_SIZE;
          const previousBottom = current.y + PLAYER_SIZE;
          const withinHorizontal =
            nextX + PLAYER_SIZE > platform.x && nextX < platform.x + platform.width;

          if (
            withinHorizontal &&
            previousBottom <= platform.y &&
            playerBottom >= platform.y &&
            nextVy >= 0
          ) {
            nextY = platform.y - PLAYER_SIZE;
            nextVy = 0;
            grounded = true;
          }
        }

        if (nextY > WORLD_HEIGHT) {
          window.setTimeout(() => resetGame("Petit saut raté, grand plongeon comique."), 0);
          return { x: 26, y: 580, vy: 0 };
        }

        for (const obstacle of obstacles) {
          const hit =
            nextX < obstacle.x + obstacle.width &&
            nextX + PLAYER_SIZE > obstacle.x &&
            nextY < obstacle.y + obstacle.height &&
            nextY + PLAYER_SIZE > obstacle.y;

          if (hit) {
            window.setTimeout(() => resetGame("Obstacle touché. La dignité suit plus tard."), 0);
            return { x: 26, y: 580, vy: 0 };
          }
        }

        if (nextX > 214 && nextY < 72) {
          window.setTimeout(() => {
            setWon(true);
            setMessage("Victoire. Alicia sourit, Léo arrive, et tout le niveau part en fête.");
          }, 0);
        }

        canJump.current = grounded;

        return { x: nextX, y: nextY, vy: nextVy };
      });
    }, 16);

    return () => window.clearInterval(interval);
  }, [pressed.left, pressed.right, won]);

  return (
    <div className="section-grid">
      {won ? <ConfettiLayer /> : null}

      <div className="panel">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Mini-jeu</p>
            <h1 className="title-font text-3xl">Monter vers Alicia</h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              Le parcours est plus haut, plus joyeux et la victoire déclenche maintenant une pluie
              de confettis.
            </p>
          </div>
          <button className="button-secondary" onClick={() => resetGame()} type="button">
            Recommencer
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="relative overflow-hidden rounded-[34px] border border-[var(--border)]"
            style={{
              height: WORLD_HEIGHT,
              width: WORLD_WIDTH,
              maxWidth: "100%",
              background:
                "linear-gradient(180deg,#fff7ef 0%, #ffe5d5 22%, #f8dcbf 45%, #d7f0ee 100%)"
            }}
          >
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_58%)]" />
            <div className="absolute left-8 top-10 h-16 w-16 rounded-full bg-[rgba(255,241,192,0.9)] blur-[2px]" />
            <div className="absolute left-14 top-32 h-10 w-24 rounded-full bg-[rgba(255,255,255,0.7)] blur-sm" />
            <div className="absolute right-24 top-[4.5rem] h-8 w-20 rounded-full bg-[rgba(255,255,255,0.66)] blur-sm" />

            {platforms.map((platform, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  left: platform.x,
                  top: platform.y,
                  width: platform.width,
                  height: platform.height,
                  background: "linear-gradient(180deg,#f7f1e5,#e2c7b8)",
                  boxShadow: "0 10px 18px rgba(77,49,43,0.12)"
                }}
              />
            ))}

            {obstacles.map((obstacle, index) => (
              <div
                key={index}
                className="absolute rounded-2xl"
                style={{
                  left: obstacle.x,
                  top: obstacle.y,
                  width: obstacle.width,
                  height: obstacle.height,
                  background: "linear-gradient(180deg,#c48b86,#8f544f)"
                }}
              />
            ))}

            <div
              className="absolute"
              style={{
                left: position.x,
                top: position.y,
                width: PLAYER_SIZE,
                height: PLAYER_SIZE
              }}
            >
              <div className="relative h-full w-full">
                <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#efceb4]" />
                <div
                  className="absolute left-1/2 top-[-1px] h-2.5 w-4 -translate-x-1/2 rounded-t-full bg-[#71442f]"
                  style={{
                    boxShadow:
                      "-3px 1px 0 rgba(113,68,47,0.9), 3px 1px 0 rgba(113,68,47,0.75), 0 -2px 0 rgba(113,68,47,0.55)"
                  }}
                />
                <div className="absolute left-1/2 top-[10px] h-8 w-5 -translate-x-1/2 rounded-t-[10px] rounded-b-[8px] bg-[linear-gradient(180deg,#6d7c8e,#495666)]" />
                <div className="absolute left-[9px] top-[18px] h-7 w-1.5 rounded-full bg-[#4a3832]" />
                <div className="absolute right-[9px] top-[18px] h-7 w-1.5 rounded-full bg-[#4a3832]" />
              </div>
            </div>

            <RoyalFigure />

            {won ? (
              <div className="absolute inset-x-6 top-20 rounded-[26px] bg-[rgba(255,255,255,0.78)] px-5 py-4 text-center shadow-soft">
                <p className="title-font text-3xl text-[var(--accent)]">Tu l’as rejointe.</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Et cette fois, le niveau se termine dans une vraie petite fête.
                </p>
              </div>
            ) : null}
          </div>

          <p className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.58)] px-4 py-4 text-center text-sm leading-6 text-[var(--muted)]">
            {message}
          </p>

          <div className="mt-5 grid w-full max-w-[340px] grid-cols-3 gap-3">
            <button
              className="button-secondary min-h-16 text-lg"
              onMouseDown={() => setPressed((state) => ({ ...state, left: true }))}
              onMouseLeave={() => setPressed((state) => ({ ...state, left: false }))}
              onMouseUp={() => setPressed((state) => ({ ...state, left: false }))}
              onTouchEnd={() => setPressed((state) => ({ ...state, left: false }))}
              onTouchStart={() => setPressed((state) => ({ ...state, left: true }))}
              type="button"
            >
              Gauche
            </button>
            <button className="button-primary min-h-16 text-lg" onClick={triggerJump} type="button">
              Saut
            </button>
            <button
              className="button-secondary min-h-16 text-lg"
              onMouseDown={() => setPressed((state) => ({ ...state, right: true }))}
              onMouseLeave={() => setPressed((state) => ({ ...state, right: false }))}
              onMouseUp={() => setPressed((state) => ({ ...state, right: false }))}
              onTouchEnd={() => setPressed((state) => ({ ...state, right: false }))}
              onTouchStart={() => setPressed((state) => ({ ...state, right: true }))}
              type="button"
            >
              Droite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
