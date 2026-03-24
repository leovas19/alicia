import { ensureSeedData } from "@/lib/seed";
import { LandingChoice } from "@/components/landing-choice";

export default async function HomePage() {
  await ensureSeedData();

  return (
    <div className="pb-4 pt-6">
      <LandingChoice />
    </div>
  );
}
