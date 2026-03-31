import sharp from "sharp";
import { writeFileSync } from "fs";

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d1b4e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="72" fill="#ffffff">
    Cambodia Floral
  </text>
  <text x="600" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-weight="400" font-size="32" fill="#e8b4f8" opacity="0.9">
    Send Flowers to Cambodia
  </text>
  <text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-weight="300" font-size="22" fill="#ffffff" opacity="0.6">
    Same-Day Delivery in Phnom Penh
  </text>
  <text x="600" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-weight="500" font-size="26" fill="#e8b4f8">
    cambodiafloral.com
  </text>
</svg>`;

const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync("public/og-image.png", buffer);
console.log("Generated public/og-image.png (1200x630)");
