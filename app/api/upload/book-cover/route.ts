import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function validateImage(file: File | null) {
  if (!file || file.size === 0) {
    return "Aucune image reçue.";
  }

  if (!file.type.startsWith("image/")) {
    return "Le fichier doit être une image.";
  }

  if (file.size > 6 * 1024 * 1024) {
    return "Image trop lourde. Maximum 6 Mo.";
  }

  return null;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const validationError = validateImage(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${randomUUID()}.${extension}`;
  const directory = path.join(process.cwd(), "public/uploads/books");

  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), bytes);

  return NextResponse.json({ url: `/uploads/books/${fileName}` });
}
