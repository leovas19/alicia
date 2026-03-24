import { HourglassCounter } from "@/components/hourglass-counter";
import { PageIntro } from "@/components/page-intro";

export default function MoreOfUsPage() {
  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Temps"
        title="Plus de nous"
        description="Une page presque silencieuse. Un grand sablier, une boucle infinie, et le temps qui continue de s’afficher seconde après seconde."
      />
      <HourglassCounter fromDate={process.env.COUNT_FROM_DATE || "2026-03-22T14:02:00+01:00"} />
    </div>
  );
}
