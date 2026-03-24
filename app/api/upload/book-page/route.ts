import path from "node:path";
import { NextResponse } from "next/server";
import {
  decodeUploadFileName,
  inferMediaType,
  validateMediaUpload,
  writeUploadedFile
} from "@/lib/upload-media";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawFileName = decodeUploadFileName(request.headers.get("x-file-name"));
  const bytes = Buffer.from(await request.arrayBuffer());
  const mediaType = inferMediaType(request.headers.get("content-type"), rawFileName);
  const validationError = validateMediaUpload(mediaType, bytes.byteLength, "image");
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const directory = path.join(process.cwd(), "public/uploads/books");
  const { savedFileName, savedMediaType } = await writeUploadedFile({
    bytes,
    fileName: rawFileName,
    mediaType,
    targetDirectory: directory
  });

  return NextResponse.json({
    url: `/uploads/books/${savedFileName}`,
    fileName: rawFileName,
    fileType: savedMediaType
  });
}
