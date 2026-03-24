import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { imageContentTypes, mediaContentTypes } from "@/lib/media-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: pathname.startsWith("books/") ? imageContentTypes : mediaContentTypes,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({
          folder: pathname.startsWith("books/") ? "books" : "photos"
        })
      }),
      onUploadCompleted: async () => {}
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Impossible de préparer l’upload."
      },
      { status: 400 }
    );
  }
}
