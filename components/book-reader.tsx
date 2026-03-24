"use client";

import Link from "next/link";
import { useState } from "react";

type ReaderPage = {
  id: string;
  content: string;
  optionalImageUrl: string | null;
  pageNumber: number;
};

type BookReaderProps = {
  title: string;
  pages: ReaderPage[];
};

export function BookReader({ title, pages }: BookReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPage = pages[currentIndex];

  return (
    <div className="section-grid">
      <div className="panel">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Lecture</p>
            <h1 className="title-font text-3xl">{title}</h1>
          </div>
          <span className="pill">
            Page {currentPage.pageNumber} / {pages.length}
          </span>
        </div>

        <div className="rounded-[28px] bg-[rgba(255,252,248,0.95)] p-4 shadow-soft">
          {currentPage?.optionalImageUrl ? (
            <img
              alt={`${title} - page ${currentPage.pageNumber}`}
              className="max-h-[75vh] w-full rounded-[20px] object-contain"
              src={currentPage.optionalImageUrl}
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-[24px] bg-[rgba(255,252,248,0.82)] text-[var(--muted)]">
              Page indisponible.
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="button-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
            type="button"
          >
            Précédent
          </button>
          <button
            className="button-primary"
            disabled={currentIndex === pages.length - 1}
            onClick={() => setCurrentIndex((value) => Math.min(pages.length - 1, value + 1))}
            type="button"
          >
            Suivant
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/livres" className="button-secondary">
            Retour galerie
          </Link>
        </div>
      </div>
    </div>
  );
}
