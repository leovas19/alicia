import { PageIntro } from "@/components/page-intro";
import { ProgressBar } from "@/components/progress-bar";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function TrustPage() {
  await ensureSeedData();
  const bars = await prisma.progressBars.findFirstOrThrow();

  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Symbole"
        title="Confiance"
        description="Une page sensible, presque rituelle. Les efforts se voient, mais le contrôle reste clairement du côté d’Alicia."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <ProgressBar
          label="Confiance"
          value={bars.trustValue}
          hint="Ce qui se reconstruit par les détails, la régularité et la cohérence."
        />
        <ProgressBar
          label="Rapprochement"
          value={bars.relationshipValue}
          tone="gold"
          hint="Ce qui n’avance que si le rythme est juste, et seulement si elle le veut."
        />
      </section>
    </div>
  );
}
