const fs = require("fs");
const path = require("path");

// Load problem data
const dataPath = path.join(__dirname, "./data.json");


const { totalCardWidth, totalCardHeight, totalCardBorderRadius, totalCardBackgroundColor, totalSolvedProblmes, primaryTextColor, secondaryTextColor, 
easyBackgroundColor, mediumBackgroundColor, hardBackgroundColor, solvedEasyProblems, solvedMediumProblems, solvedHardProblems, 
totalCardEachBarBorderRadius, totalCardPrimaryTextFontSize, totalCardSecondaryTextFontSize } = require(dataPath);

// generate total card
const availabaleTotalCardWidth = totalCardWidth-40;
const easyBarWidth = (solvedEasyProblems/totalSolvedProblmes)*availabaleTotalCardWidth;
const mediumBarWidth = (solvedMediumProblems/totalSolvedProblmes)*availabaleTotalCardWidth;
const hardBarWidth = (solvedHardProblems/totalSolvedProblmes)*availabaleTotalCardWidth;

const totalCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalCardWidth}" height="${totalCardHeight}" viewBox="0 0 ${totalCardWidth} ${totalCardHeight}">
  <!-- card background -->
  <rect x="0" y="0" width="${totalCardWidth}" height="${totalCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- All problem solved data -->
  <g transform="translate(160, 120)" text-anchor="middle">
    <!-- total problems solved -->
    <text font-size="${totalCardPrimaryTextFontSize}" font-weight="600" font-family="Inter, Arial, Helvetica, sans-serif" fill="${primaryTextColor}" dominant-baseline="end">${totalSolvedProblmes}</text>
    <!-- total problems -->
    <text font-size="${totalCardSecondaryTextFontSize}" font-weight="600" font-family="Inter, Arial, Helvetica, sans-serif" fill="${secondaryTextColor}" dominant-baseline="end" dx="80">/ ${totalProblems}</text>
  </g>

  <!-- horizontal bar represent each section problem solved -->
  <g transform="translate(16, 184)">
    <rect x="0" y="0" width="${easyBarWidth}" height="20" fill="${easyBackgroundColor}" rx="${totalCardEachBarBorderRadius}" /> 
    <rect x="${easyBarWidth+4}" y="0" width="${mediumBarWidth}" height="20" fill="${mediumBackgroundColor}" rx="${totalCardEachBarBorderRadius}" />
    <rect x="${easyBarWidth+mediumBarWidth+8}" y="0" width="${hardBarWidth}" height="20" fill="${hardBackgroundColor}" rx="${totalCardEachBarBorderRadius}" />
  </g>
</svg>`

fs.writeFileSync(path.join(__dirname, "../assets/totalCard.svg"), totalCardImage);
