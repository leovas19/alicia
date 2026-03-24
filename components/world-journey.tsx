"use client";

import { useState } from "react";
import type { VisitedPlace } from "@/lib/visited-places";

type WorldJourneyProps = {
  places: VisitedPlace[];
};

const WORLD_MAP_URL =
  "https://upload.wikimedia.org/wikipedia/commons/9/9f/BlankMap-World-Equirectangular.svg";

function toMapPosition(latitude: number, longitude: number) {
  return {
    left: ((longitude + 180) / 360) * 100,
    top: ((90 - latitude) / 180) * 100
  };
}

export function WorldJourney({ places }: WorldJourneyProps) {
  const [items, setItems] = useState(places);
  const [activePlaceId, setActivePlaceId] = useState(places[0]?.id ?? null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [note, setNote] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activePlace = items.find((place) => place.id === activePlaceId) ?? items[0];

  async function addPlace() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          country,
          note,
          latitude: Number(latitude),
          longitude: Number(longitude)
        })
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error || "Impossible d’ajouter ce lieu.");
      }

      const created = (await response.json()) as VisitedPlace;
      setItems((current) => [...current, created]);
      setActivePlaceId(created.id);
      setName("");
      setCountry("");
      setNote("");
      setLatitude("");
      setLongitude("");
      setMessage("Lieu ajouté.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  async function deletePlace(id: string) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/places/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error || "Impossible de supprimer ce lieu.");
      }

      const nextItems = items.filter((item) => item.id !== id);
      setItems(nextItems);
      setActivePlaceId(nextItems[0]?.id ?? null);
      setMessage("Lieu supprimé.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="panel overflow-hidden">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Nos endroits visités</p>
            <h2 className="title-font mt-2 text-3xl md:text-4xl">Quelques points qui comptent déjà</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
            Une vraie base de carte, avec des points placés selon les coordonnées des endroits visités.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-[var(--border)] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),rgba(244,233,220,0.92))] p-3 md:p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(198,164,108,0.18),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(143,84,79,0.12),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0))]" />

          <div className="relative aspect-[1.7/1] w-full overflow-hidden rounded-[24px] border border-[rgba(77,49,43,0.08)] bg-[linear-gradient(180deg,rgba(248,243,237,0.95),rgba(242,232,221,0.88))]">
            <img
              alt="Carte du monde"
              className="absolute inset-0 h-full w-full object-cover opacity-92"
              src={WORLD_MAP_URL}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))]" />

            <div className="absolute inset-0">
              {items.map((place) => {
                const isActive = activePlace?.id === place.id;
                const position = toMapPosition(place.latitude, place.longitude);

                return (
                  <button
                    key={place.id}
                    aria-label={`${place.name}, ${place.country}`}
                    className="group absolute"
                    onClick={() => setActivePlaceId(place.id)}
                    style={{
                      left: `${position.left}%`,
                      top: `${position.top}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                    type="button"
                  >
                    <span
                      className={`absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                        isActive ? "bg-[rgba(143,84,79,0.18)]" : "bg-[rgba(198,164,108,0.12)]"
                      } blur-md transition duration-300`}
                    />
                    <span
                      className={`relative flex h-4 w-4 items-center justify-center rounded-full border ${
                        isActive
                          ? "border-[var(--accent)] bg-[var(--accent)]"
                          : "border-[rgba(143,84,79,0.32)] bg-[rgba(255,251,247,0.96)]"
                      } transition duration-300 group-hover:scale-110`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-white" : "bg-[var(--gold)]"
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <article className="panel">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Message</p>
          <h2 className="title-font mt-2 text-3xl">Nos endroits visités</h2>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            Nos endroits visités, en espérant que cela ne s&apos;arrête pas là.
          </p>
          {activePlace ? (
            <div className="mt-5 rounded-[24px] border border-[var(--border)] bg-[rgba(255,252,248,0.82)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{activePlace.country}</p>
              <h3 className="title-font mt-2 text-2xl">{activePlace.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{activePlace.note}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                {activePlace.latitude.toFixed(4)} / {activePlace.longitude.toFixed(4)}
              </p>
            </div>
          ) : null}
        </article>

        <section className="panel space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Ajouter</p>
            <h2 className="title-font mt-2 text-3xl">Modifier la liste</h2>
          </div>

          <div className="grid gap-3">
            <input
              className="input-field"
              onChange={(event) => setName(event.target.value)}
              placeholder="Lieu"
              value={name}
            />
            <input
              className="input-field"
              onChange={(event) => setCountry(event.target.value)}
              placeholder="Pays"
              value={country}
            />
            <textarea
              className="input-field min-h-28 resize-none"
              onChange={(event) => setNote(event.target.value)}
              placeholder="Petit message"
              value={note}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="input-field"
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="Latitude"
                value={latitude}
              />
              <input
                className="input-field"
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="Longitude"
                value={longitude}
              />
            </div>
            <button className="button-primary" disabled={loading} onClick={addPlace} type="button">
              Ajouter le lieu
            </button>
            {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
          </div>
        </section>

        <section className="panel space-y-3">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Liste</p>
          <div className="space-y-3">
            {items.map((place, index) => {
              const isActive = activePlace?.id === place.id;

              return (
                <div
                  key={place.id}
                  className={`rounded-[22px] border px-4 py-4 transition ${
                    isActive
                      ? "border-[rgba(143,84,79,0.28)] bg-[rgba(143,84,79,0.09)]"
                      : "border-[var(--border)] bg-[rgba(255,252,248,0.74)]"
                  }`}
                >
                  <button
                    className="flex w-full items-start gap-3 text-left"
                    onClick={() => setActivePlaceId(place.id)}
                    type="button"
                  >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(198,164,108,0.14)] title-font text-base text-[var(--accent)]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="title-font text-xl">{place.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{place.country}</p>
                  </div>
                  </button>
                  <div className="mt-3 flex justify-end">
                    <button
                      className="button-secondary px-4 py-2 text-sm"
                      disabled={loading}
                      onClick={() => deletePlace(place.id)}
                      type="button"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </div>
  );
}
