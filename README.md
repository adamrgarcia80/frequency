# FREQUENCY

A web-based creative tool that turns uploaded audio into striking, brand-worthy audio-reactive visuals. Built for campaign imagery, posters, packaging explorations, and brand-world building.

## Features

- **Audio upload** — Drop or click to load any audio file
- **Real-time analysis** — Waveform, FFT, low/mid/high band energy, transients
- **Haze / Pulse Field visual** — Atmospheric, signal-distortion, spectral bloom aesthetic
- **Timeline scrubbing** — Scrub through the song to find the perfect frame
- **High-res export** — Capture the current frame as a 2x PNG
- **Visual controls** — Intensity, bloom, haze density, distortion, motion speed, grain
- **Color palettes** — Toxic green, warm ember, ultraviolet, monochrome smoke

## Tech Stack

- React + TypeScript + Vite
- Three.js (WebGL)
- Web Audio API
- Modular structure ready for Tauri wrapping

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/frequency.git
cd frequency

# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy the `dist` folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Project Structure

```
src/
  components/     — React UI (Header, Canvas, Controls, UploadZone, PlaybackBar)
  audio/          — Web Audio analyzer, types
  visuals/        — Three.js visual systems (HazePulseField)
  hooks/          — useAudio, useVisualParams
  export/         — PNG export utility
  utils/          — Visual params, palettes
```

## License

MIT
