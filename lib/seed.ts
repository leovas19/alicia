import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { initialVisitedPlaces } from "@/lib/visited-places";

const truthSeed = [
  {
    question: "Ce que j’ai compris",
    answer:
      "Que les gestes calmes, réguliers et concrets valent plus que les grandes promesses dites trop vite."
  },
  {
    question: "Ce que j’aurais dû faire",
    answer:
      "Écouter sans vouloir me défendre tout de suite, et te laisser de l’air sans disparaître émotionnellement."
  },
  {
    question: "Ce que je regrette",
    answer:
      "Les moments où j’ai laissé la confusion prendre plus de place que la clarté et la douceur."
  },
  {
    question: "Ce que je veux aujourd’hui",
    answer:
      "Construire quelque chose de plus paisible, plus vrai, plus stable, même si cela demande du temps."
  },
  {
    question: "Ce que je veux faire différemment",
    answer:
      "Être plus cohérent, plus présent dans les détails, et te laisser garder le rythme qui te protège."
  }
];

const wordsSeed = [
  ["lumiere", 5],
  ["douceur", 4],
  ["calme", 3],
  ["regard", 5],
  ["or", 2],
  ["rire", 4],
  ["jolie", 4],
  ["feu", 2],
  ["dimanche", 3],
  ["courage", 3],
  ["cinema", 2],
  ["sincere", 4],
  ["tendre", 5],
  ["musique", 3],
  ["reine", 5],
  ["rare", 4]
] as const;

export async function ensureSeedData() {
  const [userCount, barsCount, truthCount, playlistCount, wordsCount, messagesCount, challengesCount, booksCount, visitedPlacesCount] =
    await Promise.all([
      prisma.aliciaUser.count(),
      prisma.progressBars.count(),
      prisma.truthQuestion.count(),
      prisma.playlistItem.count(),
      prisma.word.count(),
      prisma.freeSpaceMessage.count(),
      prisma.challenge.count(),
      prisma.book.count(),
      prisma.visitedPlace.count()
    ]);

  const targetUsername = process.env.ALICIA_USERNAME || "alicia";
  const targetPassword = process.env.ALICIA_PASSWORD || "alicia";

  if (userCount === 0) {
    await prisma.aliciaUser.create({
      data: {
        username: targetUsername,
        passwordHash: hashPassword(targetPassword),
        barsInitialized: false
      }
    });
  } else {
    const user = await prisma.aliciaUser.findFirstOrThrow();

    if (user.username !== targetUsername || !verifyPassword(targetPassword, user.passwordHash)) {
      await prisma.aliciaUser.update({
        where: {
          id: user.id
        },
        data: {
          username: targetUsername,
          passwordHash: hashPassword(targetPassword)
        }
      });
    }
  }

  if (barsCount === 0) {
    await prisma.progressBars.create({
      data: {
        trustValue: 34,
        relationshipValue: 12
      }
    });
  }

  if (truthCount === 0) {
    await prisma.truthQuestion.createMany({
      data: truthSeed.map((item, index) => ({ ...item, orderIndex: index + 1 }))
    });
  }

  if (wordsCount === 0) {
    await prisma.word.createMany({
      data: wordsSeed.map(([word, weight], index) => ({
        word,
        weight,
        orderIndex: index + 1
      }))
    });
  }

  if (visitedPlacesCount === 0) {
    await prisma.visitedPlace.createMany({
      data: initialVisitedPlaces.map((place, index) => ({
        ...place,
        orderIndex: index + 1
      }))
    });
  }

}
