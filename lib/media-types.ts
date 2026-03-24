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

export const imageContentTypes = Object.values(imageTypesByExtension);
export const mediaContentTypes = [...imageContentTypes, ...Object.values(videoTypesByExtension)];

export function getFileExtension(fileName: string) {
  const extension = fileName.split(".").pop();
  return extension ? extension.toLowerCase() : "";
}

export function inferClientMediaType(file: File) {
  const normalizedType = (file.type || "").toLowerCase().trim();
  if (normalizedType.startsWith("image/") || normalizedType.startsWith("video/")) {
    return normalizedType;
  }

  const extension = getFileExtension(file.name);
  return imageTypesByExtension[extension] || videoTypesByExtension[extension] || "";
}

export function isSupportedImageType(mediaType: string) {
  return imageContentTypes.includes(mediaType);
}

export function isSupportedMediaType(mediaType: string) {
  return mediaContentTypes.includes(mediaType);
}
