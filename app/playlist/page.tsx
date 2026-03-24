import { PlaylistManager } from "@/components/playlist-manager";
import { PageIntro } from "@/components/page-intro";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function PlaylistPage() {
  await ensureSeedData();
  const items = await prisma.playlistItem.findMany({
    orderBy: {
      orderIndex: "asc"
    }
  });

  return (
    <div className="space-y-6 pb-4 pt-6">
      <PageIntro
        eyebrow="Ambiance"
        title="Playlist"
        description="La musique donne une texture émotionnelle au reste. Ici, chaque morceau reste simple à voir, sans surcharger la page."
      />
      <PlaylistManager items={items} />
    </div>
  );
}
