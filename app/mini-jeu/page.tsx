import { MiniPlatformGame } from "@/components/mini-platform-game";
import { PageIntro } from "@/components/page-intro";

export default function MiniGamePage() {
  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Jeu"
        title="Mini-jeu plateforme"
        description="Un petit parcours mobile-first. Léo part d’en bas, Alicia attend en haut, et les boutons tactiles restent visibles directement sur l’écran."
      />
      <MiniPlatformGame />
    </div>
  );
}
