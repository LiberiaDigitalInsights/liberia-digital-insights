import { NextResponse } from "next/server";
import axios from "axios";

// GET /api/v1/audio/proxy/[...url] - Proxy audio file to avoid CORS
export async function GET(request, { params }) {
  try {
    const { url } = await params;
    const audioUrl = Array.isArray(url) ? url.join("/") : url;

    if (!audioUrl) {
      return NextResponse.json(
        { error: "Audio URL is required" },
        { status: 400 },
      );
    }

    // Fetch the audio file as a stream
    const response = await axios.get(audioUrl, {
      responseType: "stream",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 30000,
    });

    // Create a readable stream from the response
    const readable = response.data;
    const headers = new Headers();

    headers.set(
      "Content-Type",
      response.headers["content-type"] || "audio/mpeg",
    );
    headers.set("Content-Length", response.headers["content-length"]);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("Access-Control-Allow-Origin", "*");

    // Note: Complex range handling from legacy is omitted for basic proxying simplicity
    // unless explicitly needed, as Next.js might handle some streaming nuances.
    // We return the full stream for now.

    return new NextResponse(readable, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[api/audio/proxy] error:", error.message);
    return NextResponse.json(
      {
        error: "Failed to proxy audio file",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
