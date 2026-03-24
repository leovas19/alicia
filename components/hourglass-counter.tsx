"use client";

import { useEffect, useState } from "react";

type DurationState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getDiff(fromDate: string): DurationState {
  const from = new Date(fromDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - from);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function HourglassCounter({ fromDate }: { fromDate: string }) {
  const [duration, setDuration] = useState(() => getDiff(fromDate));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDuration(getDiff(fromDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [fromDate]);

  return (
    <section className="panel flex flex-col items-center justify-center text-center">
      <div className="relative mb-10 h-[340px] w-[240px]">
        <div className="absolute inset-x-8 top-0 h-10 rounded-full border border-[rgba(77,49,43,0.14)] bg-[rgba(255,252,248,0.72)]" />
        <div className="absolute inset-x-8 bottom-0 h-10 rounded-full border border-[rgba(77,49,43,0.14)] bg-[rgba(255,252,248,0.72)]" />
        <div className="absolute inset-x-[46%] top-7 bottom-7 w-[8%] rounded-full bg-[rgba(143,84,79,0.14)]" />
        <div className="absolute left-8 right-8 top-8 h-[42%] rounded-b-[110px] rounded-t-[28px] border border-[rgba(77,49,43,0.14)] bg-[rgba(255,252,248,0.52)]" />
        <div className="absolute bottom-8 left-8 right-8 h-[42%] rounded-t-[110px] rounded-b-[28px] border border-[rgba(77,49,43,0.14)] bg-[rgba(255,252,248,0.52)]" />
        <div className="absolute left-[29%] right-[29%] top-[21%] h-[17%] rounded-b-full rounded-t-2xl bg-[linear-gradient(180deg,rgba(198,164,108,0.95),rgba(240,223,191,0.72))]" />
        <div className="absolute bottom-[15%] left-[20%] right-[20%] h-[23%] rounded-t-full bg-[linear-gradient(180deg,rgba(240,223,191,0.92),rgba(198,164,108,0.95))]" />
        <div className="absolute left-1/2 top-[45%] h-[24%] w-[10px] -translate-x-1/2 origin-top rounded-full bg-[linear-gradient(180deg,rgba(198,164,108,0),rgba(198,164,108,1),rgba(198,164,108,0))] animate-sand" />
      </div>

      <p className="mb-6 text-sm uppercase tracking-[0.36em] text-[var(--muted)]">Plus de nous</p>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Jours", duration.days],
          ["Heures", duration.hours],
          ["Minutes", duration.minutes],
          ["Secondes", duration.seconds]
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,252,248,0.84)] px-4 py-5"
          >
            <p className="title-font text-3xl md:text-4xl">{String(value)}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
