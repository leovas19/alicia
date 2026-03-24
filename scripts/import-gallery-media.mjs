import { copyFile, mkdir, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

const projectRoot = process.cwd();
const sourceArg = process.argv[2];

if (!sourceArg) {
  console.error("Usage: npm run import:gallery -- /chemin/vers/dossier");
  process.exit(1);
}

const sourceDirectory = path.resolve(projectRoot, sourceArg);
const destinationDirectory = path.join(projectRoot, "public/uploads/photos");
const databasePath = path.join(projectRoot, "prisma/dev.db");

const imageTypesByExtension = {
  avif: "image/avif",
  bmp: "image/bmp",
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

const videoTypesByExtension = {
  "3gp": "video/3gpp",
  avi: "video/x-msvideo",
  m2ts: "video/mp2t",
  m4v: "video/x-m4v",
  mkv: "video/x-matroska",
  mov: "video/quicktime",
  mp4: "video/mp4",
  mpe: "video/mpeg",
  mpeg: "video/mpeg",
  mpg: "video/mpeg",
  mts: "video/mp2t",
  webm: "video/webm"
};

function inferMediaType(fileName) {
  const extension = path.extname(fileName).slice(1).toLowerCase();
  return imageTypesByExtension[extension] || videoTypesByExtension[extension] || null;
}

function escapeSql(value) {
  return value.replaceAll("'", "''");
}

async function collectFilesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFilesRecursively(fullPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function sha256FromFile(filePath) {
  const buffer = await readFile(filePath);
  return createHash("sha256").update(buffer).digest("hex");
}

function runSql(query) {
  return execFileSync("sqlite3", [databasePath, query]).toString().trim();
}

async function main() {
  await mkdir(destinationDirectory, { recursive: true });

  const sourceFiles = await collectFilesRecursively(sourceDirectory);
  const destinationEntries = await readdir(destinationDirectory);
  const sourceIsDestination =
    path.resolve(sourceDirectory) === path.resolve(destinationDirectory);
  const knownHashes = new Set();
  const knownUrls = new Set(
    runSql("select imageUrl from Photo;")
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean)
  );
  const imported = [];
  const skipped = [];
  const duplicates = [];

  for (const entry of destinationEntries) {
    const destinationPath = path.join(destinationDirectory, entry);
    const destinationStat = await stat(destinationPath);

    if (!destinationStat.isFile()) {
      continue;
    }

    knownHashes.add(await sha256FromFile(destinationPath));
  }

  for (const sourcePath of sourceFiles) {
    const entry = path.relative(sourceDirectory, sourcePath);

    const mediaType = inferMediaType(entry);
    if (!mediaType) {
      skipped.push(entry);
      continue;
    }

    const extension = path.extname(entry).slice(1).toLowerCase() || "bin";
    const hash = await sha256FromFile(sourcePath);

    let publicUrl;

    if (sourceIsDestination) {
      publicUrl = `/uploads/photos/${path.basename(sourcePath)}`;
      if (knownUrls.has(publicUrl)) {
        duplicates.push(entry);
        continue;
      }
    } else {
      if (knownHashes.has(hash)) {
        duplicates.push(entry);
        continue;
      }

      const fileName = `${randomUUID()}.${extension}`;
      const destinationPath = path.join(destinationDirectory, fileName);
      publicUrl = `/uploads/photos/${fileName}`;

      await copyFile(sourcePath, destinationPath);
      knownHashes.add(hash);
    }

    const sql = `
      INSERT INTO Photo (id, imageUrl, mediaType, createdAt)
      VALUES ('${randomUUID()}', '${escapeSql(publicUrl)}', '${escapeSql(mediaType)}', CURRENT_TIMESTAMP);
    `;

    runSql(sql);
    knownUrls.add(publicUrl);
    imported.push(entry);
  }

  console.log(`Imported: ${imported.length}`);
  if (imported.length > 0) {
    console.log(imported.join("\n"));
  }

  console.log(`Duplicates skipped: ${duplicates.length}`);
  if (duplicates.length > 0) {
    console.log(duplicates.join("\n"));
  }

  console.log(`Skipped: ${skipped.length}`);
  if (skipped.length > 0) {
    console.log(skipped.join("\n"));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
