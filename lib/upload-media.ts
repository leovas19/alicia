import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

const execFileAsync = promisify(execFile);

const imageTypesByExtension: Record<string, string> = {
  avif: "image/avif",
  bmp: "image/bmp",
  dng: "image/x-adobe-dng",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  jfif: "image/jpeg",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  tif: "image/tiff",
  tiff: "image/tiff",
  webp: "image/webp"
};

const videoTypesByExtension: Record<string, string> = {
  '3gp': "video/3gpp",
  avi: "video/x-msvideo",
  m4v: "video/x-m4v",
  mkv: "video/x-matroska",
  mov: "video/quicktime",
  mpe: "video/mpeg",
  mpeg: "video/mpeg",
  mpg: "video/mpeg",
  mp4: "video/mp4",
  mts: "video/mp2t",
  m2ts: "video/mp2t",
  webm: "video/webm"
};

export function getLowercaseExtension(fileName: string) {
  const extension = fileName.split(".").pop();
  return extension ? extension.toLowerCase() : "";
}

export function decodeUploadFileName(rawFileName: string | null) {
  if (!rawFileName) return "media";

  try {
    return decodeURIComponent(rawFileName);
  } catch {
    return rawFileName;
  }
}

export function inferMediaType(contentType: string | null, fileName: string) {
  const normalized = (contentType || "").toLowerCase().trim();
  if (normalized.startsWith("image/") || normalized.startsWith("video/")) {
    return normalized;
  }

  const extension = getLowercaseExtension(fileName);
  return imageTypesByExtension[extension] || videoTypesByExtension[extension] || "";
}

export function isImageType(mediaType: string) {
  return mediaType.startsWith("image/");
}

export function isVideoType(mediaType: string) {
  return mediaType.startsWith("video/");
}

export function isHeicFamily(fileName: string, mediaType: string) {
  const extension = getLowercaseExtension(fileName);
  return extension === "heic" || extension === "heif" || mediaType === "image/heic" || mediaType === "image/heif";
}

export function validateMediaUpload(mediaType: string, size: number, kind: "image" | "media") {
  if (!mediaType || size === 0) {
    return kind === "image" ? "Aucune image reçue." : "Aucun média reçu.";
  }

  if (kind === "image" && !isImageType(mediaType)) {
    return "Le livre doit être composé d’images.";
  }

  if (kind === "media" && !isImageType(mediaType) && !isVideoType(mediaType)) {
    return "Le fichier doit être une image ou une vidéo.";
  }

  if (isImageType(mediaType) && size > 10 * 1024 * 1024) {
    return kind === "image"
      ? "Image trop lourde. Maximum 10 Mo par page."
      : "Image trop lourde. Maximum 10 Mo.";
  }

  if (isVideoType(mediaType) && size > 80 * 1024 * 1024) {
    return "Vidéo trop lourde. Maximum 80 Mo.";
  }

  return null;
}

export async function writeUploadedFile({
  bytes,
  fileName,
  mediaType,
  targetDirectory
}: {
  bytes: Buffer;
  fileName: string;
  mediaType: string;
  targetDirectory: string;
}) {
  await mkdir(targetDirectory, { recursive: true });

  if (isHeicFamily(fileName, mediaType)) {
    const tempInput = path.join(os.tmpdir(), `${randomUUID()}.${getLowercaseExtension(fileName) || "heic"}`);
    const tempOutput = path.join(os.tmpdir(), `${randomUUID()}.jpg`);

    await writeFile(tempInput, bytes);

    try {
      await execFileAsync("/usr/bin/sips", ["-s", "format", "jpeg", tempInput, "--out", tempOutput]);
      const convertedBytes = await readFile(tempOutput);
      const finalName = `${randomUUID()}.jpg`;
      const finalPath = path.join(targetDirectory, finalName);
      await writeFile(finalPath, convertedBytes);

      return {
        savedFileName: finalName,
        savedMediaType: "image/jpeg"
      };
    } finally {
      await rm(tempInput, { force: true });
      await rm(tempOutput, { force: true });
    }
  }

  const extension = getLowercaseExtension(fileName) || (isImageType(mediaType) ? "jpg" : "bin");
  const finalName = `${randomUUID()}.${extension}`;
  await writeFile(path.join(targetDirectory, finalName), bytes);

  return {
    savedFileName: finalName,
    savedMediaType: mediaType
  };
}
