const fs = require("fs");
const path = require("path");

// Load problem data
const dataPath = path.join(__dirname, "./data.json");


const { totalCardWidth, totalCardHeight, totalCardBorderRadius, totalCardBackgroundColor, totalSolvedProblmes, totalProblems, primaryTextColor, secondaryTextColor, 
easyBackgroundColor, mediumBackgroundColor, hardBackgroundColor, solvedEasyProblems, totalEasyProblems, solvedMediumProblems, totalMediumProblems, 
solvedHardProblems, totalHardProblems, totalCardEachBarBorderRadius, totalCardPrimaryTextFontSize, totalCardSecondaryTextFontSize, sectionCardWidth, 
sectionCardHeight, sectionTitleTextFontSize, easyTextColor, fontfamily, sectionCardPrimaryTextFontSize, sectionCardSecondaryTextFontSize, 
mediumTextColor, hardTextColor} = require(dataPath);

// generate total card
const availabaleTotalCardWidth = totalCardWidth-40;
const easyBarWidth = (solvedEasyProblems/totalSolvedProblmes)*availabaleTotalCardWidth;
const mediumBarWidth = (solvedMediumProblems/totalSolvedProblmes)*availabaleTotalCardWidth;
const hardBarWidth = (solvedHardProblems/totalSolvedProblmes)*availabaleTotalCardWidth;

const totalCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalCardWidth+4}" height="${totalCardHeight+4}" viewBox="0 0 ${totalCardWidth+4} ${totalCardHeight+4}">
  <!-- card background -->
  <rect x="0" y="0" width="${totalCardWidth}" height="${totalCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- All problem solved data -->
  <g transform="translate(280, 120)" text-anchor="middle">
    <!-- total problems solved -->
    <text font-size="${totalCardPrimaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${primaryTextColor}" dominant-baseline="end">${totalSolvedProblmes}</text>
    <!-- total problems -->
    <text font-size="${totalCardSecondaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${secondaryTextColor}" dominant-baseline="end" dx="80">/ ${totalProblems}</text>
  </g>

  <!-- horizontal bar represent each section problem solved -->
  <g transform="translate(16, ${totalCardHeight-36})">
    <rect x="0" y="0" width="${easyBarWidth}" height="20" fill="${easyBackgroundColor}" rx="${totalCardEachBarBorderRadius}" /> 
    <rect x="${easyBarWidth+4}" y="0" width="${mediumBarWidth}" height="20" fill="${mediumBackgroundColor}" rx="${totalCardEachBarBorderRadius}" />
    <rect x="${easyBarWidth+mediumBarWidth+8}" y="0" width="${hardBarWidth}" height="20" fill="${hardBackgroundColor}" rx="${totalCardEachBarBorderRadius}" />
  </g>
</svg>`

fs.writeFileSync(path.join(__dirname, "../assets/totalCard.svg"), totalCardImage);


// generate easy card 
const easyCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${sectionCardWidth+4}" height="${sectionCardHeight+4}" viewBox="0 0 ${sectionCardWidth+4} ${sectionCardHeight+4}">
  <!-- card -->
  <rect x="0" y="0" width="${sectionCardWidth}" height="${sectionCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- card title -->
  <text x="16" y="28" font-size="${sectionTitleTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${easyTextColor}">Easy</text>
  
  <g transform="translate(70, 90)" text-anchor="middle">
    <!-- section problems solved -->
    <text font-size="${sectionCardPrimaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${primaryTextColor}" dominant-baseline="end">${solvedEasyProblems}</text>
    <!-- section problems available -->
    <text font-size="${sectionCardSecondaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${secondaryTextColor}" dominant-baseline="end" dx="45">/ ${totalEasyProblems}</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, "../assets/easyCard.svg"), easyCardImage);

// generate medium card 
const mediumCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${sectionCardWidth+4}" height="${sectionCardHeight+4}" viewBox="0 0 ${sectionCardWidth+4} ${sectionCardHeight+4}">
  <!-- card -->
  <rect x="0" y="0" width="${sectionCardWidth}" height="${sectionCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- card title -->
  <text x="16" y="28" font-size="${sectionTitleTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${mediumTextColor}">Medium</text>
  
  <g transform="translate(70, 90)" text-anchor="middle">
    <!-- section problems solved -->
    <text font-size="${sectionCardPrimaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${primaryTextColor}" dominant-baseline="end">${solvedMediumProblems}</text>
    <!-- section problems available -->
    <text font-size="${sectionCardSecondaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${secondaryTextColor}" dominant-baseline="end" dx="45">/ ${totalMediumProblems}</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, "../assets/mediumCard.svg"), mediumCardImage);

// generate hard card 
const hardCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${sectionCardWidth+4}" height="${sectionCardHeight+4}" viewBox="0 0 ${sectionCardWidth+4} ${sectionCardHeight+4}">
  <!-- card -->
  <rect x="0" y="0" width="${sectionCardWidth}" height="${sectionCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- card title -->
  <text x="16" y="28" font-size="${sectionTitleTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${hardTextColor}">Hard</text>
  
  <g transform="translate(70, 90)" text-anchor="middle">
    <!-- section problems solved -->
    <text font-size="${sectionCardPrimaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${primaryTextColor}" dominant-baseline="end">${solvedHardProblems}</text>
    <!-- section problems available -->
    <text font-size="${sectionCardSecondaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${secondaryTextColor}" dominant-baseline="end" dx="45">/ ${totalHardProblems}</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, "../assets/hardCard.svg"), hardCardImage);
