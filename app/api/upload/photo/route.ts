import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";
import {
  decodeUploadFileName,
  inferMediaType,
  validateMediaUpload,
  writeUploadedFile
} from "@/lib/upload-media";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await ensureSeedData();
  const rawFileName = decodeUploadFileName(request.headers.get("x-file-name"));
  const bytes = Buffer.from(await request.arrayBuffer());
  const mediaType = inferMediaType(request.headers.get("content-type"), rawFileName);

  const validationError = validateMediaUpload(mediaType, bytes.byteLength, "media");
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const directory = path.join(process.cwd(), "public/uploads/photos");
  const { savedFileName, savedMediaType } = await writeUploadedFile({
    bytes,
    fileName: rawFileName,
    mediaType,
    targetDirectory: directory
  });

  const url = `/uploads/photos/${savedFileName}`;
  const id = randomUUID();

  await prisma.$executeRawUnsafe(
    `
      INSERT INTO Photo (id, imageUrl, mediaType)
      VALUES (?, ?, ?)
    `,
    id,
    url,
    savedMediaType
  );

  const [photo] = (await prisma.$queryRawUnsafe(
    `
      SELECT id, imageUrl, mediaType, createdAt
      FROM Photo
      WHERE id = ?
      LIMIT 1
    `,
    id
  )) as Array<{
    id: string;
    imageUrl: string;
    mediaType: string | null;
    createdAt: string;
  }>;

  return NextResponse.json(photo, { status: 201 });
}
