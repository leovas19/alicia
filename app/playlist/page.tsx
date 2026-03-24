import { PlaylistManager } from "@/components/playlist-manager";
import { PageIntro } from "@/components/page-intro";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

type PlaylistRow = {
  id: string;
  title: string;
  artist: string;
  url: string | null;
  rating: number | bigint | null;
  orderIndex: number | bigint;
};

function normalizePlaylistRow(row: PlaylistRow) {
  return {
    ...row,
    rating: Number(row.rating ?? 0),
    orderIndex: Number(row.orderIndex)
  };
}

export default async function PlaylistPage() {
  await ensureSeedData();
  const items = ((await prisma.$queryRawUnsafe(`
    SELECT id, title, artist, url, COALESCE(rating, 0) AS rating, orderIndex
    FROM PlaylistItem
    ORDER BY orderIndex ASC
  `)) as PlaylistRow[]).map(normalizePlaylistRow);

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
