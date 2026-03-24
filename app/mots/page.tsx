import { PageIntro } from "@/components/page-intro";
import { WordCloud } from "@/components/word-cloud";
import { curatedWords } from "@/lib/word-list";

export default function WordsPage() {
  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Paysage mental"
        title="Mots qui me font penser à elle"
        description="Pas de structure rigide, pas d’explication. Juste des mots, dispersés comme des morceaux d’une même impression."
      />
      <WordCloud words={curatedWords} />
    </div>
  );
}
