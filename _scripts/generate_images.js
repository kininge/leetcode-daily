const fs = require("fs");
const path = require("path");

// Load problem data
const dataPath = path.join(__dirname, "../data.json");
const { totalSolved, easy, medium, hard } = require(dataPath);

// SVG size
const width = 400;
const barWidth = 300;
const barHeight = 20;
const barX = 50;
const barY = 150;

// Calculate widths
const easyW = (easy / totalSolved) * barWidth;
const medW = (medium / totalSolved) * barWidth;
const hardW = (hard / totalSolved) * barWidth;

// Generate SVG
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="220" viewBox="0 0 ${width} 220">
  <rect x="0" y="0" width="${width}" height="220" rx="8" fill="#282828" />
  
  <!-- Problem solved numbers -->
  <g transform="translate(160, 120)" text-anchor="middle">
    <text font-size="70" font-weight="600" font-family="Inter, Arial, Helvetica, sans-serif" fill="#ffffff" dominant-baseline="end">${totalSolved}</text>
    <text font-size="25" font-weight="600" font-family="Inter, Arial, Helvetica, sans-serif" fill="#868686" dominant-baseline="end" dx="80">/ 3647</text>
  </g>

  <!-- Progress bar -->
  <rect x="${barX}" y="${barY}" width="${easyW}" height="${barHeight}" fill="#4CAF50" />
  <rect x="${barX + easyW}" y="${barY}" width="${medW}" height="${barHeight}" fill="#FFC107" />
  <rect x="${barX + easyW + medW}" y="${barY}" width="${hardW}" height="${barHeight}" fill="#F44336" />
</svg>
`;

// Save SVG
fs.writeFileSync(path.join(__dirname, "../leetcodeCard.svg"), svg);
console.log("✅ LeetCode card generated!");
