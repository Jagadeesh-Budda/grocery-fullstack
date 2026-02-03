import React from "react";

/**
 * GardenMesh / SceneryBackground
 *
 * Goal: ethereal, out-of-focus garden scenery using only code.
 *
 * Requirements satisfied:
 * - Full-screen fixed-position SVG, pointer-events: none
 * - 5–7 overlapping circles as color nodes (7 used), asymmetrically positioned
 * - Heavy blur (stdDeviation=90) to turn nodes into atmospheric mist
 * - feTurbulence noise layer at 0.02 frequency, blended using overlay
 * - Vignette via radialGradient mask
 */
export default function SceneryBackground() {
  return (
    <div className="scenery-container" aria-hidden="true">
      <svg
        className="scenery-svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle base gradient (keeps scene readable) */}
          <linearGradient id="gmSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfe7ef" />
            <stop offset="55%" stopColor="#eaf6f1" />
            <stop offset="100%" stopColor="#d8efe2" />
          </linearGradient>

          {/* Heavy blur + printed-paper noise blended with overlay */}
          <filter id="gmMist" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="90" result="mist" />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              seed="11"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.14 0"
              result="grain"
            />
            <feBlend in="mist" in2="grain" mode="overlay" />
          </filter>

          {/* Vignette mask */}
          <radialGradient id="gmV" cx="50%" cy="55%" r="78%">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="62%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="1" />
          </radialGradient>
          <mask id="gmVignette">
            <rect width="100%" height="100%" fill="url(#gmV)" />
          </mask>
        </defs>

        {/* Base sky */}
        <rect x="0" y="0" width="1920" height="1080" fill="url(#gmSky)" />

        {/* Garden mesh color nodes (7 circles) */}
        <g filter="url(#gmMist)" opacity="1">
          {/* Sun flare */}
          <circle cx="384" cy="108" r="620" fill="#fffde7" opacity="0.95" />
          {/* Mint mid-right depth */}
          <circle cx="1536" cy="486" r="740" fill="#e8f5e9" opacity="0.70" />
          {/* Soft cyan atmosphere */}
          <circle cx="1248" cy="162" r="640" fill="#bfe7ef" opacity="0.55" />
          {/* Sage mist near horizon */}
          <circle cx="768" cy="594" r="760" fill="#dcfce7" opacity="0.55" />
          {/* Deep foliage bottom-right */}
          <circle cx="1650" cy="990" r="720" fill="#86efac" opacity="0.42" />
          {/* Cool shadow pocket bottom-left */}
          <circle cx="240" cy="900" r="680" fill="#99d4c8" opacity="0.42" />
          {/* Warm diffusion mid-left */}
          <circle cx="560" cy="420" r="560" fill="#fff7cf" opacity="0.42" />
        </g>

        {/* Vignette */}
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="rgba(30,60,50,0.20)"
          mask="url(#gmVignette)"
        />
      </svg>
    </div>
  );
}
