// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files (your HLS segments and playlists)
app.use('/hls', express.static(path.join(__dirname, 'outputs'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.m3u8')) {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else if (path.endsWith('.ts')) {
            res.setHeader('Content-Type', 'video/mp2t');
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

// Generate master playlist dynamically
app.get('/hls/master.m3u8', (req, res) => {
    const masterPlaylist = `#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=854x480,NAME="480p"
480p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=1280x720,NAME="720p"
720p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1920x1080,NAME="1080p"
1080p/index.m3u8
`;

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(masterPlaylist);
});

// Serve the HTML player
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get video info
app.get('/api/video-info', (req, res) => {
    const videoInfo = {
        qualities: [
            { name: '1080p', resolution: '1920x1080', bitrate: '2800 kbps' },
            { name: '720p', resolution: '1280x720', bitrate: '1400 kbps' },
            { name: '480p', resolution: '854x480', bitrate: '800 kbps' }
        ],
        masterPlaylist: '/hls/master.m3u8'
    };
    res.json(videoInfo);
});

app.listen(PORT, () => {
    console.log(`🚀 HLS Server running on http://localhost:${PORT}`);
    console.log(`📺 Video player available at: http://localhost:${PORT}`);
    console.log(`🎬 Master playlist at: http://localhost:${PORT}/hls/master.m3u8`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Server shutting down...');
    process.exit(0);
});