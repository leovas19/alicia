"use client";

type WordItem = {
  id: string;
  word: string;
  weight: number;
  top: number;
  left: number;
  size: number;
  rotate: number;
};

export function WordCloud({ words }: { words: readonly WordItem[] }) {
  return (
    <div className="panel relative overflow-hidden">
      <p className="mb-4 text-xs uppercase tracking-[0.36em] text-[var(--muted)]">
        Mots qui me font penser à elle
      </p>
      <div className="relative min-h-[820px]">
        {words.map((word, index) => {
          return (
            <span
              key={word.id}
              className="title-font absolute animate-float"
              style={{
                top: `${word.top}%`,
                left: `${word.left}%`,
                fontSize: `clamp(${word.size * 0.58}rem, ${word.size * 0.38}rem + 1vw, ${word.size}rem)`,
                animationDelay: `${index * 0.2}s`,
                opacity: 0.52 + word.weight * 0.07,
                color: "var(--foreground)",
                transform: `translate(-50%, -50%) rotate(${word.rotate}deg)`,
                whiteSpace: "nowrap"
              }}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
