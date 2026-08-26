import fs from 'fs';
import path from 'path';

const imgBuffer = fs.readFileSync(path.join('public', 'logo.jpg'));
const base64Img = imgBuffer.toString('base64');
const dataUri = 'data:image/jpeg;base64,' + base64Img;

// 1. Create fully self-contained logo.svg with embedded base64
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF2DB" />
      <stop offset="25%" stop-color="#D4AF37" />
      <stop offset="50%" stop-color="#F5E5C0" />
      <stop offset="75%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#E5C158" />
    </linearGradient>
    <clipPath id="circularLogoClip">
      <circle cx="250" cy="250" r="247" />
    </clipPath>
  </defs>

  <circle cx="250" cy="250" r="250" fill="#000000" />

  <!-- Embedded Self-Contained High-Res Official Logo -->
  <g clip-path="url(#circularLogoClip)">
    <image href="${dataUri}" x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid slice" />
  </g>

  <!-- Outer Double Gold Ring Frame -->
  <circle cx="250" cy="250" r="246" fill="none" stroke="url(#goldRingGrad)" stroke-width="5" />
  <circle cx="250" cy="250" r="236" fill="none" stroke="url(#goldRingGrad)" stroke-width="2" opacity="0.9" />
</svg>`;

fs.writeFileSync(path.join('public', 'logo.svg'), logoSvg);
fs.writeFileSync(path.join('public', 'favicon.svg'), logoSvg);
fs.copyFileSync(path.join('public', 'logo.jpg'), path.join('public', 'favicon.png'));

console.log('Successfully generated self-contained base64 SVG logo and favicon!');
