import { PageIntro } from "@/components/page-intro";
import { WorldJourney } from "@/components/world-journey";
import { readVisitedPlaces } from "@/lib/visited-places";

export default async function PlacesPage() {
  const visitedPlaces = await readVisitedPlaces();

  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Trajet"
        title="Nos endroits"
        description="Une carte pour voir où quelques souvenirs se sont posés. Pas pour compter les kilomètres, plutôt pour garder une trace sensible des endroits qui nous ont marqués."
      />
      <WorldJourney places={visitedPlaces} />
    </div>
  );
}
