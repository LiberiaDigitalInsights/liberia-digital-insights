import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

// POST /v1/audio/extract - Extract audio URL from sharing link
router.post('/extract', async (req, res) => {
  try {
    const { shareUrl } = req.body;

    if (!shareUrl) {
      return res.status(400).json({ error: 'Share URL is required' });
    }

    console.log('Extracting audio from:', shareUrl);

    let audioUrl = null;

    // Handle Google Drive URLs
    if (shareUrl.includes('drive.google.com')) {
      audioUrl = await extractGoogleDriveUrl(shareUrl);
    } else {
      // Handle other sharing platforms
      audioUrl = await extractFromSharingPage(shareUrl);
    }

    if (!audioUrl) {
      return res.status(404).json({ 
        error: 'No audio URL found in the sharing page',
        message: 'Unable to extract direct audio URL from the provided sharing link'
      });
    }

    console.log('Extracted audio URL:', audioUrl);

    res.json({
      audioUrl,
      originalUrl: shareUrl,
      extractedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Audio extraction error:', error.message);
    res.status(500).json({ 
      error: 'Failed to extract audio URL',
      message: error.message
    });
  }
});

// Extract direct download URL from Google Drive
async function extractGoogleDriveUrl(shareUrl) {
  try {
    // Extract file ID from Google Drive URL
    const fileIdMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (!fileIdMatch) {
      throw new Error('Invalid Google Drive URL format');
    }

    const fileId = fileIdMatch[1];
    
    // Construct direct download URL
    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Verify the file exists and is accessible
    const response = await axios.head(directDownloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    // Check if the response contains an audio file
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('audio')) {
      return directDownloadUrl;
    } else {
      throw new Error('Google Drive file is not an audio file');
    }

  } catch (error) {
    console.error('Google Drive extraction error:', error.message);
    return null;
  }
}

// Extract audio URL from general sharing pages
async function extractFromSharingPage(shareUrl) {
  try {
    // Fetch the sharing page
    const response = await axios.get(shareUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    let audioUrl = null;

    // Try different methods to extract audio URL
    const selectors = [
      'audio source',
      'meta[property="og:audio"]',
      'meta[name="twitter:audio:source"]',
      '[data-audio-url]',
      '.audio-player audio',
      'audio'
    ];

    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        audioUrl = element.attr('src') || element.attr('content') || element.data('audio-url');
        if (audioUrl) break;
      }
    }

    // Also check for JSON-LD structured data
    if (!audioUrl) {
      $('script[type="application/ld+json"]').each((i, elem) => {
        try {
          const data = JSON.parse($(elem).html());
          if (data.contentUrl && data.contentUrl.match(/\.(mp3|wav|m4a|ogg)$/i)) {
            audioUrl = data.contentUrl;
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      });
    }

    // Check for inline JavaScript that might contain audio URLs
    if (!audioUrl) {
      const scripts = $('script').html();
      const audioMatches = scripts.match(/['"](https?:\/\/[^'"]*\.(mp3|wav|m4a|ogg))['"]/gi);
      if (audioMatches && audioMatches.length > 0) {
        audioUrl = audioMatches[0].replace(/['"]/g, '');
      }
    }

    // Convert relative URLs to absolute
    if (audioUrl && audioUrl.startsWith('/')) {
      const url = new URL(shareUrl);
      audioUrl = `${url.protocol}//${url.host}${audioUrl}`;
    }

    return audioUrl;

  } catch (error) {
    console.error('Sharing page extraction error:', error.message);
    return null;
  }
}

// GET /v1/audio/proxy/:url - Proxy audio file to avoid CORS issues
router.get('/proxy/*', async (req, res) => {
  try {
    // Get the full URL after /proxy/ without decoding
    const audioUrl = req.params[0];
    
    if (!audioUrl) {
      return res.status(400).json({ error: 'Audio URL is required' });
    }

    console.log('Proxying audio from:', audioUrl);
    console.log('Full request URL:', req.originalUrl);

    // Fetch the audio file
    const response = await axios.get(audioUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });

    console.log('Response status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);

    // Set appropriate headers with CORS
    res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
    res.setHeader('Content-Length', response.headers['content-length']);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Range');

    // Handle range requests for audio seeking
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : response.data.length - 1;

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${response.data.length}`);
      res.setHeader('Accept-Ranges', 'bytes');

      response.data.pipe(res, { start, end });
    } else {
      response.data.pipe(res);
    }

  } catch (error) {
    console.error('Audio proxy error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to proxy audio file',
      message: error.message
    });
  }
});

export default router;
