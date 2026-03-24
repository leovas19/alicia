import Link from "next/link";
import { GugusGame } from "@/components/gugus-game";
import { PageIntro } from "@/components/page-intro";

export default function GugusPage() {
  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Fun"
        title="Jeu Gugus"
        description="Un moment volontairement léger. Pas de violence, pas de complexité: juste un petit chaos comique pour relâcher la pression."
        actions={
          <Link href="/mini-jeu" className="button-secondary">
            Aller au mini-jeu
          </Link>
        }
      />
      <GugusGame />
    </div>
  );
}
