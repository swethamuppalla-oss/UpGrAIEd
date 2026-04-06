const axios = require('axios');
const fs = require('fs');

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME;
const BASE_URL = 'https://video.bunnycdn.com';

const headers = () => ({
  AccessKey: BUNNY_API_KEY,
  'Content-Type': 'application/json',
});

/**
 * Create a video entry in Bunny.net and upload the file.
 * Returns the Bunny video object.
 */
const uploadVideo = async (title, filePath) => {
  // Step 1: Create the video entry
  const createRes = await axios.post(
    `${BASE_URL}/library/${LIBRARY_ID}/videos`,
    { title },
    { headers: headers() }
  );
  const bunnyVideoId = createRes.data.guid;

  // Step 2: Upload the file binary
  const fileStream = fs.createReadStream(filePath);
  const stat = fs.statSync(filePath);

  await axios.put(
    `${BASE_URL}/library/${LIBRARY_ID}/videos/${bunnyVideoId}`,
    fileStream,
    {
      headers: {
        AccessKey: BUNNY_API_KEY,
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    }
  );

  return createRes.data;
};

/**
 * Fetch video metadata from Bunny.net (includes duration, status, etc.)
 */
const getVideoInfo = async (bunnyVideoId) => {
  const res = await axios.get(
    `${BASE_URL}/library/${LIBRARY_ID}/videos/${bunnyVideoId}`,
    { headers: headers() }
  );
  return res.data;
};

/**
 * Delete a video from Bunny.net.
 */
const deleteVideo = async (bunnyVideoId) => {
  await axios.delete(
    `${BASE_URL}/library/${LIBRARY_ID}/videos/${bunnyVideoId}`,
    { headers: headers() }
  );
};

/**
 * Build the HLS stream URL for a video.
 */
const getStreamUrl = (bunnyVideoId) =>
  `https://${CDN_HOSTNAME}/${bunnyVideoId}/playlist.m3u8`;

/**
 * Build the iframe embed URL for a video.
 */
const getEmbedUrl = (bunnyVideoId) =>
  `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${bunnyVideoId}`;

/**
 * Build the thumbnail URL for a video.
 */
const getThumbnailUrl = (bunnyVideoId) =>
  `https://${CDN_HOSTNAME}/${bunnyVideoId}/thumbnail.jpg`;

module.exports = {
  uploadVideo,
  getVideoInfo,
  deleteVideo,
  getStreamUrl,
  getEmbedUrl,
  getThumbnailUrl,
};
