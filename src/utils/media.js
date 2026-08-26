/**
 * @file media.js
 * @description Media helper utilities for video embed URL resolution, thumbnails, and sanitization.
 */

/**
 * Extracts the YouTube Video ID from any standard, short, or shorts YouTube URL.
 * @param {string} url - YouTube URL or ID
 * @returns {string|null} - YouTube Video ID or null
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  
  // Match youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // Match standard youtube.com/watch?v=ID or /embed/ID or /v/ID
  const standardMatch = trimmed.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([a-zA-Z0-9_-]{11})/);
  if (standardMatch) return standardMatch[1];

  // Match youtu.be/ID
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Returns a high quality thumbnail URL for a YouTube video.
 * @param {string} urlOrId 
 * @returns {string|null}
 */
export function getYouTubeThumbnailUrl(urlOrId) {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Returns a secure autoplay-ready YouTube embed URL using the official youtube.com domain.
 * @param {string} urlOrId - YouTube video URL or ID.
 * @param {boolean} autoplay - Whether to autoplay in loop/mute mode.
 * @returns {string|null}
 */
export function getYouTubeEmbedUrl(urlOrId, autoplay = true) {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;

  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: autoplay ? '1' : '0',
    loop: '1',
    playlist: videoId,
    playsinline: '1',
    rel: '0',
    controls: '1'
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
