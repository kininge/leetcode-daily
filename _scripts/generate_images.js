const fs = require("fs");
const path = require("path");

function infoLog(msg) { console.log('INFO:', msg); }
function errorLog(msg) { console.error('ERROR:', msg); process.exit(1); }

// Load problem data
const dataPath = path.join(__dirname, "./data.json");
infoLog(`got data.json at ${dataPath}`);


const { totalCardWidth, totalCardHeight, totalCardBorderRadius, totalCardBackgroundColor, totalSolvedProblems, totalProblems, primaryTextColor, secondaryTextColor, 
easyBackgroundColor, mediumBackgroundColor, hardBackgroundColor, solvedEasyProblems, totalEasyProblems, solvedMediumProblems, totalMediumProblems, 
solvedHardProblems, totalHardProblems, totalCardEachBarBorderRadius, totalCardPrimaryTextFontSize, totalCardSecondaryTextFontSize, sectionCardWidth, 
sectionCardHeight, sectionTitleTextFontSize, easyTextColor, fontfamily, sectionCardPrimaryTextFontSize, sectionCardSecondaryTextFontSize, 
mediumTextColor, hardTextColor} = require(dataPath);
infoLog(`data for print: ${JSON.stringify({'totalSolvedProblems': totalSolvedProblems, 'solvedEasyProblems': solvedEasyProblems, 'solvedMediumProblems': solvedMediumProblems, 'solvedHardProblems': solvedHardProblems})}`);

// generate total card
const availabaleTotalCardWidth = totalCardWidth-40;
const easyBarWidth = (solvedEasyProblems/totalSolvedProblems)*availabaleTotalCardWidth;
const mediumBarWidth = (solvedMediumProblems/totalSolvedProblems)*availabaleTotalCardWidth;
const hardBarWidth = (solvedHardProblems/totalSolvedProblems)*availabaleTotalCardWidth;

const totalCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalCardWidth}" height="${totalCardHeight}" viewBox="0 0 ${totalCardWidth} ${totalCardHeight}">
  <!-- card background -->
  <rect x="0" y="0" width="${totalCardWidth}" height="${totalCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- All problem solved data -->
  <g transform="translate(280, 120)" text-anchor="middle">
    <!-- total problems solved -->
    <text font-size="${totalCardPrimaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${primaryTextColor}" dominant-baseline="end">${totalSolvedProblems}</text>
    <!-- total problems -->
    <text font-size="${totalCardSecondaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${secondaryTextColor}" dominant-baseline="end" dx="80">/ ${totalProblems}</text>
  </g>

  <!-- horizontal bar represents each section problem solved -->
  <g transform="translate(16, ${totalCardHeight-36})">
    <rect x="0" y="0" width="${easyBarWidth}" height="20" fill="${easyBackgroundColor}" rx="${totalCardEachBarBorderRadius}" /> 
    <rect x="${easyBarWidth+4}" y="0" width="${mediumBarWidth}" height="20" fill="${mediumBackgroundColor}" rx="${totalCardEachBarBorderRadius}" />
    <rect x="${easyBarWidth+mediumBarWidth+8}" y="0" width="${hardBarWidth}" height="20" fill="${hardBackgroundColor}" rx="${totalCardEachBarBorderRadius}" />
  </g>
</svg>`

fs.writeFileSync(path.join(__dirname, "../assets/totalCard.svg"), totalCardImage);
infoLog(`totalCardImage is generated --> ${totalSolvedProblems}/${totalProblems}`);


// generate easy card 
const easyCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${sectionCardWidth+4}" height="${sectionCardHeight+4}" viewBox="0 0 ${sectionCardWidth+4} ${sectionCardHeight+4}">
  <!-- card -->
  <rect x="0" y="0" width="${sectionCardWidth}" height="${sectionCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- card title -->
  <text x="16" y="28" font-size="${sectionTitleTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${easyTextColor}">Easy</text>
  
  <g transform="translate(${70-((solvedEasyProblems.toString().length-1)*10)}, 90)" text-anchor="middle">
    <!-- section problems solved -->
    <text font-size="${sectionCardPrimaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${primaryTextColor}" dominant-baseline="end">${solvedEasyProblems}</text>
    <!-- section problems available -->
    <text font-size="${sectionCardSecondaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${secondaryTextColor}" dominant-baseline="end" dx="${45+((solvedEasyProblems.toString().length-1)*18)}">/ ${totalEasyProblems}</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, "../assets/easyCard.svg"), easyCardImage);
infoLog(`easyCardImage is generated --> ${solvedEasyProblems}/${totalEasyProblems}`);

// generate medium card 
const mediumCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${sectionCardWidth+4}" height="${sectionCardHeight+4}" viewBox="0 0 ${sectionCardWidth+4} ${sectionCardHeight+4}">
  <!-- card -->
  <rect x="0" y="0" width="${sectionCardWidth}" height="${sectionCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- card title -->
  <text x="16" y="28" font-size="${sectionTitleTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${mediumTextColor}">Medium</text>
  
  <g transform="translate(${70-((solvedMediumProblems.toString().length-1)*10)}, 90)" text-anchor="middle">
    <!-- section problems solved -->
    <text font-size="${sectionCardPrimaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${primaryTextColor}" dominant-baseline="end">${solvedMediumProblems}</text>
    <!-- section problems available -->
    <text font-size="${sectionCardSecondaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${secondaryTextColor}" dominant-baseline="end" dx="${45+((solvedMediumProblems.toString().length-1)*18)}">/ ${totalMediumProblems}</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, "../assets/mediumCard.svg"), mediumCardImage);
infoLog(`mediumCardImage is generated --> ${solvedMediumProblems}/${totalMediumProblems}`);

// generate hard card 
const hardCardImage = `<svg xmlns="http://www.w3.org/2000/svg" width="${sectionCardWidth+4}" height="${sectionCardHeight+4}" viewBox="0 0 ${sectionCardWidth+4} ${sectionCardHeight+4}">
  <!-- card -->
  <rect x="0" y="0" width="${sectionCardWidth}" height="${sectionCardHeight}" rx="${totalCardBorderRadius}" fill="${totalCardBackgroundColor}" />
  
  <!-- card title -->
  <text x="16" y="28" font-size="${sectionTitleTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${hardTextColor}">Hard</text>
  
  <g transform="translate(${70-((solvedHardProblems.toString().length-1)*10)}, 90)" text-anchor="middle">
    <!-- section problems solved -->
    <text font-size="${sectionCardPrimaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${primaryTextColor}" dominant-baseline="end">${solvedHardProblems}</text>
    <!-- section problems available -->
    <text font-size="${sectionCardSecondaryTextFontSize}" font-weight="600" font-family="${fontfamily}" fill="${secondaryTextColor}" dominant-baseline="end" dx="${45+((solvedHardProblems.toString().length-1)*18)}">/ ${totalHardProblems}</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, "../assets/hardCard.svg"), hardCardImage);
infoLog(`hardCardImage is generated --> ${solvedHardProblems}/${totalHardProblems}`);

