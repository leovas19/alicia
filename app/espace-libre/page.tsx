import { PageIntro } from "@/components/page-intro";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export default async function FreeSpacePage() {
  await ensureSeedData();
  const [messages, challenges] = await Promise.all([
    prisma.freeSpaceMessage.findMany({
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.challenge.findMany({
      orderBy: {
        createdAt: "asc"
      }
    })
  ]);

  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Humain"
        title="Espace libre + défis"
        description="Une seule page pour les notes et les défis. Quelque chose de vivant, chaleureux, sans jamais ressembler à un back-office."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="panel">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Espace libre</p>
          <div className="mt-4 grid gap-4">
            {messages.length === 0 ? (
              <article className="rounded-[24px] bg-[rgba(255,252,248,0.88)] p-5">
                <p className="text-sm leading-7 text-[var(--muted)]">
                  Rien pour l’instant.
                </p>
              </article>
            ) : (
              messages.map((message) => (
                <article key={message.id} className="rounded-[24px] bg-[rgba(255,252,248,0.88)] p-5">
                  <p className="text-sm leading-7 text-[var(--foreground)]">{message.content}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    {formatDate(message.createdAt)}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Défis</p>
          <div className="mt-4 grid gap-4">
            {challenges.length === 0 ? (
              <article className="rounded-[24px] bg-[rgba(255,252,248,0.88)] p-5">
                <p className="text-sm leading-7 text-[var(--muted)]">
                  Aucun défi pour l’instant.
                </p>
              </article>
            ) : (
              challenges.map((challenge) => (
                <article
                  key={challenge.id}
                  className="flex items-center justify-between gap-4 rounded-[24px] bg-[rgba(255,252,248,0.88)] p-5"
                >
                  <div>
                    <h2 className="title-font text-2xl">{challenge.title}</h2>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      {formatDate(challenge.createdAt)}
                    </p>
                  </div>
                  <span className="pill">{challenge.status}</span>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
