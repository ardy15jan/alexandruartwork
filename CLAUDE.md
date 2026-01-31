# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static portfolio website for Alexandru Artwork (alexandruartwork.co.uk), hosted on GitHub Pages. The site features a gallery of paintings with an animated header canvas background.

## Architecture

### Core Files

- [index.html](index.html) - Single-page HTML structure with header canvas, gallery section, and contact form
- [scripts.js](scripts.js) - All JavaScript functionality including gallery rendering, canvas animation, and form handling
- [styles.css](styles.css) - All styling with responsive layout
- [CNAME](CNAME) - Custom domain configuration for GitHub Pages

### Canvas Animation

The header features an animated grid-based pattern using SimplexNoise (loaded via CDN):
- Grid of 80×20 cells (configurable via `params.cols` and `params.rows` in [scripts.js](scripts.js:48-49))
- Each cell contains a rotating line whose angle and scale are determined by 3D simplex noise
- Animation runs at browser refresh rate via `requestAnimationFrame`
- Canvas auto-resizes to match its display dimensions

Key animation parameters in [scripts.js](scripts.js:47-58):
- `freq`: Controls noise frequency (speed of animation changes)
- `amp`: Controls rotation amplitude
- `scaleMin/scaleMax`: Line thickness range
- `color`: RGB values for line color

### Gallery System

Artworks are defined in a JavaScript array in [scripts.js](scripts.js:3-12) and dynamically rendered to the DOM on page load. Each artwork object contains:
- `title`: Display name
- `src`: Path to image file in `assets/paintings/`

The gallery renders as a single-column vertical list with titles below each image.

## Development Workflow

### Local Development

Open [index.html](index.html) directly in a browser - no build process or local server required.

### Adding New Artwork

1. Add image file to `assets/paintings/` directory
2. Add entry to the `artworks` array in [scripts.js](scripts.js:3-12):
   ```javascript
   { title: 'Artwork Name', src: 'assets/paintings/filename.jpg' }
   ```

### Deployment

The site is deployed via GitHub Pages. Changes to the `main` branch are automatically published to alexandruartwork.co.uk.

## External Dependencies

- SimplexNoise library: Loaded from CDN (https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/)
- Google Fonts: Roboto font family
