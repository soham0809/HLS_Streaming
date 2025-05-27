## HLS Video Streaming with Video.js and HLS.js

This project demonstrates how to implement adaptive HTTP Live Streaming (HLS) playback using Video.js as the user interface and HLS.js as the playback engine for full cross-browser compatibility. It also includes a Docker-based FFmpeg setup to transcode and segment videos into HLS format.

## Project Overview

Video Playback:
Uses Video.js for a polished, customizable video player interface and HLS.js for seamless playback of .m3u8 streams on browsers without native HLS support (e.g., Chrome, Firefox, Edge). Safari and iOS use native HLS support as a fallback.

## Video Transcoding & Segmentation:

Uses FFmpeg inside a Docker container to convert standard video files (e.g., MP4) into segmented HLS playlists (.m3u8 and .ts files) optimized for streaming. This supports adaptive bitrate streaming with segment durations set for smooth playback.

## Storage:

Transcoded videos and HLS segments are stored locally (or can be uploaded to cloud storage like Amazon S3 for scalable public delivery).

## How It Works

Transcoding with FFmpeg + Docker:

The Docker container runs FFmpeg to take an input video and output segmented .ts files alongside an .m3u8 playlist.

Segments are typically 10 seconds each, making it suitable for smooth streaming with adaptive bitrates.

Serving the HLS Stream:

The .m3u8 playlist and .ts segments can be served via HTTP from a static file server or cloud storage like Amazon S3.

Proper CORS configuration is essential on the storage/server side to allow web players to fetch the stream.

Playback in Browser:

The web app loads the .m3u8 URL into Video.js combined with HLS.js, ensuring wide browser compatibility.

The player UI offers standard video controls with fullscreen, volume, and progress bar.

## Key Features

Cross-browser HLS Playback using HLS.js for browsers without native support.

Dockerized FFmpeg pipeline for easy video transcoding and HLS packaging.

Amazon S3 Integration for hosting and delivering HLS streams with correct CORS policies.

Simple Web UI built on Video.js for user-friendly playback experience.

Error Handling & Fallbacks to gracefully support unsupported browsers.

Setup Instructions
Build and run the Docker container for FFmpeg video transcoding.

Place your source videos in the mounted folder on your host system.

Run FFmpeg commands inside the container to generate HLS streams.

Upload output .m3u8 and .ts files to your storage solution (e.g., S3) with CORS configured.

Deploy the web page with Video.js + HLS.js player, pointing to your public .m3u8 URL.

## Troubleshooting Tips

CORS Errors: Verify your storage bucket has the correct CORS configuration allowing GET requests from your domain or from \* origins if testing publicly.

Playback Issues: Confirm the .m3u8 playlist and .ts segment URLs are accessible via browser (try opening the .m3u8 URL directly).

Autoplay Restrictions: Modern browsers may block autoplay. Use user interaction or muted playback to avoid this.

File Permissions: Make sure your transcoded files have proper read permissions.

Future Enhancements
Add adaptive bitrate transcoding with multiple quality levels for bandwidth optimization.

Integrate DRM or encryption for secure streaming.

Add analytics for viewer engagement and playback statistics.

Build a backend service to automate transcoding and deployment pipelines.

## Author

Soham Joshi
Software Engineering Student | Streaming & Video Tech Enthusiast

docker build -t video_transcoder .
docker run -it -v C:/Users/soham/Desktop/HLS_STREAMING/videos:/home/app/videos video_transcoder

ffmpeg -i videos/sample.mp4 \
 -codec:v libx264 -codec:a aac \
 -hls_time 10 -hls_playlist_type vod \
 -hls_segment_filename videos/outputs/segment%03d.ts \
 -start_number 0 videos/outputs/index.m3u8
