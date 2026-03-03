import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// POST /api/v1/audio/extract - Extract audio URL from sharing link
export async function POST(request) {
  try {
    const { shareUrl } = await request.json();

    if (!shareUrl) {
      return NextResponse.json(
        { error: "Share URL is required" },
        { status: 400 },
      );
    }

    let audioUrl = null;

    // Handle Google Drive URLs
    if (shareUrl.includes("drive.google.com")) {
      audioUrl = await extractGoogleDriveUrl(shareUrl);
    } else {
      // Handle other sharing platforms
      audioUrl = await extractFromSharingPage(shareUrl);
    }

    if (!audioUrl) {
      return NextResponse.json(
        {
          error: "No audio URL found in the sharing page",
          message:
            "Unable to extract direct audio URL from the provided sharing link",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      audioUrl,
      originalUrl: shareUrl,
      extractedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[api/audio/extract] error:", error.message);
    return NextResponse.json(
      {
        error: "Failed to extract audio URL",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

async function extractGoogleDriveUrl(shareUrl) {
  try {
    const fileIdMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (!fileIdMatch) throw new Error("Invalid Google Drive URL format");

    const fileId = fileIdMatch[1];
    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const response = await axios.head(directDownloadUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const contentType = response.headers["content-type"];
    if (contentType && contentType.includes("audio")) {
      return directDownloadUrl;
    } else {
      throw new Error("Google Drive file is not an audio file");
    }
  } catch (error) {
    console.error("[extractGoogleDriveUrl] error:", error.message);
    return null;
  }
}

async function extractFromSharingPage(shareUrl) {
  try {
    const response = await axios.get(shareUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    let audioUrl = null;

    const selectors = [
      "audio source",
      'meta[property="og:audio"]',
      'meta[name="twitter:audio:source"]',
      "[data-audio-url]",
      ".audio-player audio",
      "audio",
    ];

    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        audioUrl =
          element.attr("src") ||
          element.attr("content") ||
          element.data("audio-url");
        if (audioUrl) break;
      }
    }

    if (!audioUrl) {
      $('script[type="application/ld+json"]').each((i, elem) => {
        try {
          const data = JSON.parse($(elem).html());
          if (
            data.contentUrl &&
            data.contentUrl.match(/\.(mp3|wav|m4a|ogg)$/i)
          ) {
            audioUrl = data.contentUrl;
          }
        } catch (e) {}
      });
    }

    if (!audioUrl) {
      const scripts = $("script").html();
      const audioMatches = scripts
        ? scripts.match(/['"](https?:\/\/[^'"]*\.(mp3|wav|m4a|ogg))['"]/gi)
        : null;
      if (audioMatches && audioMatches.length > 0) {
        audioUrl = audioMatches[0].replace(/['"]/g, "");
      }
    }

    if (audioUrl && audioUrl.startsWith("/")) {
      const url = new URL(shareUrl);
      audioUrl = `${url.protocol}//${url.host}${audioUrl}`;
    }

    return audioUrl;
  } catch (error) {
    console.error("[extractFromSharingPage] error:", error.message);
    return null;
  }
}
