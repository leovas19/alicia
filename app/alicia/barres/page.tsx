import { AliciaSpaceManager } from "@/components/alicia-space-manager";
import { BarsManager } from "@/components/bars-manager";
import { ProgressBar } from "@/components/progress-bar";
import { requireAlicia } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export default async function AliciaBarsPage() {
  await ensureSeedData();
  const username = await requireAlicia();

  const alicia = await prisma.aliciaUser.findUniqueOrThrow({
    where: {
      username
    }
  });
  const [bars, messages, challenges] = await Promise.all([
    prisma.progressBars.findFirstOrThrow(),
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
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <BarsManager
          hasInitialized={alicia.barsInitialized}
          trustValue={bars.trustValue}
          relationshipValue={bars.relationshipValue}
        />
        <section className="panel space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Aperçu public</p>
          <ProgressBar
            label="Confiance"
            value={bars.trustValue}
            hint="Ce que le reste du site montrera publiquement."
          />
          <ProgressBar
            label="Rapprochement"
            value={bars.relationshipValue}
            tone="gold"
            hint="Visible publiquement, mais modifiable uniquement ici."
          />
        </section>
      </div>
      <AliciaSpaceManager challenges={challenges} messages={messages} />
    </div>
  );
}
