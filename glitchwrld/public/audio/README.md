# Audio Files Directory

This directory contains audio files for the galaxy visualization.

## Setup Instructions

### Download Space Ambient Audio from YouTube

1. **Go to the YouTube video**: https://www.youtube.com/watch?v=k3UevKvP9RU&t=29801s

2. **Download the audio** using one of these methods:

   **Method A: Using a YouTube Downloader Website**
   - Visit: https://ytmp3.nu/ or https://yt1s.com/
   - Paste the YouTube URL
   - Select "MP3" format
   - Click Download
   - Save the file as `space-ambient.mp3`

   **Method B: Using yt-dlp (Command Line)**
   ```bash
   # Install yt-dlp (if not installed)
   pip install yt-dlp

   # Download as MP3
   yt-dlp -x --audio-format mp3 -o "space-ambient.mp3" "https://www.youtube.com/watch?v=k3UevKvP9RU"
   ```

   **Method C: Using youtube-dl (Command Line)**
   ```bash
   # Install youtube-dl (if not installed)
   pip install youtube-dl

   # Download as MP3
   youtube-dl -x --audio-format mp3 -o "space-ambient.mp3" "https://www.youtube.com/watch?v=k3UevKvP9RU"
   ```

3. **Place the downloaded file here**:
   - Copy/move `space-ambient.mp3` to this directory
   - Path should be: `glitchwrld/public/audio/space-ambient.mp3`

4. **Verify the file**:
   - File name: `space-ambient.mp3`
   - Location: `glitchwrld/public/audio/space-ambient.mp3`
   - The audio will automatically play when you load the galaxy scene

## File Structure

```
glitchwrld/
└── public/
    └── audio/
        ├── README.md (this file)
        └── space-ambient.mp3 (your downloaded file)
```

## Troubleshooting

### Audio doesn't play
- Make sure the file is named exactly `space-ambient.mp3`
- Check browser console for errors
- Try clicking anywhere on the page (browser autoplay policy)
- Check that audio controls are not muted

### File format issues
- Ensure the file is in MP3 format
- Most browsers support MP3, but you can also use:
  - `.ogg` (Ogg Vorbis)
  - `.wav` (WAV - larger file size)
  - `.m4a` (AAC)

### Copyright Notice
- This is for personal use only
- The audio is from: "Deep Space Sounds - Ambient Space Music" by NASA/ESA
- Please respect copyright and terms of use

## Notes

- The audio will loop continuously
- Volume can be controlled using the audio controls in the bottom-right corner
- The audio will automatically play for the galaxy home page
- Other scenes (planets, black hole) use procedural audio
