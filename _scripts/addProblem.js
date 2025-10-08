#!/usr/bin/env node
'use strict';
/**
 * Annotated & refactored version of _scripts/addProblem.js
 * - clearer variable names
 * - unicode-aware slugify
 * - robust path resolution (tries script dir, then repo root)
 * - atomic write for data.json (write tmp then rename)
 * - safer JSON handling and better error messages
 *
 * Usage: node _scripts/addProblem.annotated.js problems/235.md [--dry-run]
 *
 * NOTE: This file is intended for review and educational purposes. It keeps
 * the original behaviour but improves readability, variable names and safety.
 */

const fs = require('fs'); // filesystem to read, write, modify and delete files
const path = require('path'); // to handle file paths

// handle logs and errors
function log(type="info", message) {
    if(type === "info") console.log("INFO: ", message);
    else if(type === "error"){
       console.error('ERROR: ', message); 
       process.exit(1); // end the process with error code 1
    }
}
function infoLog(msg) { console.log('INFO:', msg); }
function errorLog(msg) { console.error('ERROR:', msg); process.exit(1); }

// Atomic write: write to temp then rename (atomic on most OS filesystems)
function writeFileAtomic(filePath, content) {
    const tmp = filePath + '.tmp';
    fs.writeFileSync(tmp, content, 'utf8');
    fs.renameSync(tmp, filePath);
}

// Safe JSON read: empty file -> {}
function readJsonSafe(filePath) {
    const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : '';
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch (err) {
        log("error", `Invalid JSON in ${filePath}: ${err.message}`);
    }
}

// Unicode-aware slugify for badge text (keeps letters & numbers, replaces whitespace with _)
function slugifyTitle(title) {
    // Normalise unicode, strip diacritics, remove unsafe chars, and collapse spaces to '_'
    // Uses Unicode property escapes (Node >= 10+ with flag or modern versions)
    return title
        .normalize('NFKD')
        // remove diacritic marks
        .replace(/\p{Diacritic}/gu, '')
        // keep letters, numbers, spaces and hyphens; remove other punctuation
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .trim()
        .replace(/\s+/g, '_');
}

// Check if a file already contains an exact (trimmed) line
function fileHasExactLine(filePath, line) {
    if (!fs.existsSync(filePath)) return false;
    const contents = fs.readFileSync(filePath, 'utf8');
    const target = line.trim();
    return contents.split(/\r?\n/).some(l => l.trim() === target);
}


// Normalize function: remove BOM, replace NBSP with space, trim
const normalizeLine = l => (l || '').replace(/\uFEFF/g, '').replace(/\u00A0/g, ' ').trim();

// -----------------------------
// "process" is a global object in Node.js that represents the current running process. 
// Useful properties:
//.   1. process.argv — array of command-line arguments.
//.   2. process.env — environment variables.
//.   3. process.cwd() — current working directory.
//.   4. process.exit(code) — exit program.
//
//    In our case workflow triggering command like --> "node _scripts/addProblem.js problems/235.md"
//.   So, process.argv will be an array like:
//.   [ 'node', '/path/to/_scripts/addProblem.js', 'problems/235.md' ]
// -----------------------------

// STEP 1:  Take arguments and validate
const argus = process.argv.slice(2); // get all arguments to the process
infoLog(`script arguments: ${argus}`);
if (argus.length === 0) errorLog("error", `missing argument: ${argus}`);

// STEP 2: Seperate argument that seperates problem file name
const problemFileArgus = argus[0];
infoLog(`problem file argument: ${problemFileArgus}`);

// STEP 3: Get problem file path
const workingDirectory = process.cwd(); // get working directory
infoLog(`working directory: ${workingDirectory}`);
const scriptDirectory = path.dirname(__filename);
infoLog(`script directory: ${scriptDirectory}`);
const resolvedProblemFilePath = path.resolve(workingDirectory, problemFileArgus);
infoLog(`problem file path: ${resolvedProblemFilePath}`);

// STEP 4: Check problem file exists at path
if (!fs.existsSync(resolvedProblemFilePath)) errorLog("error", `problem file ${problemFileArgus} missing at: ${resolvedProblemFilePath}`);

// STEP 5: Read problem file
const problemFileContent = fs.readFileSync(resolvedProblemFilePath, 'utf8');
infoLog(`problem file content: ${problemFileContent}`);
const linesSplitedProblemFileContent = problemFileContent.split(/\r?\n/);
infoLog(`line splited problem file content: ${linesSplitedProblemFileContent}`);
// Build array of non-empty normalized lines
const nonEmptyLines = linesSplitedProblemFileContent.map(normalizeLine).filter(l => l.length > 0);

// STEP 6: Verify at least 2 lines of code exist in problem file
if (nonEmptyLines.length < 2) errorLog("error", `problem file contains less than 2 lines`);
infoLog(`top 2 lines of problem file content: ${nonEmptyLines.slice(0, 2)}`);


// -----------------------------
// Parse header (problem number and title)
// Example first line: "# 🧩 Problem #118 – Pascal's Triangle"
// Accepts hyphen, en-dash, em-dash
// -----------------------------

// STEP 7: Check problem file title match title format
const problemFileTitle = nonEmptyLines[0].trim();
infoLog(`problem file title: ${problemFileTitle}`);
const headerRegex = /^#.*?Problem\s*#?(\d+)\s*[–—-]\s*(.+)$/u;
const headerMatch = problemFileTitle.match(headerRegex);
infoLog(`problem file title header mactch: ${headerMatch}`);
if (!headerMatch) errorLog("error", `problem title does not match the format`);

// STEP 8: Get problem number and title
const problemNumber = headerMatch[1]; // string of digits
infoLog(`problem number: ${problemNumber}`);
const problemTitle = headerMatch[2].trim();
infoLog(`problem title: ${problemTitle}`);


// -----------------------------
// Parse difficulty from second line, expected: "**Difficulty:** Easy"
// -----------------------------

// STEP 9: check problem file difficulty match the format
const problemFileDifficultyLine = nonEmptyLines[1].trim();
infoLog(`problem diffuculty line: ${problemFileDifficultyLine}`);
const diffRegex = /\*\*Difficulty:\*\*\s*(Easy|Medium|Hard)/i;
const diffMatch = problemFileDifficultyLine.match(diffRegex);
infoLog(`problem diffuculty match: ${diffMatch}`);
if (!diffMatch) errorLog("error", `problem difficulty does not match the format`);

// STEP 10: Get difficulty in lowercase
const difficulty = diffMatch[1].toLowerCase(); // easy|medium|hard

// difficulty and associated colors
const difficultyColorsMap = {
    easy: "brightgreen",
    medium: "yellow",
    hard: "red"
};

// STEP 11: Make ready problem badge
const badgeSlug = slugifyTitle(problemTitle);
infoLog(`slugy problem title: ${badgeSlug}`);
const badgeColor = difficultyColorsMap[difficulty];
infoLog(`${difficulty} is ${badgeColor} color`);
const badgeMarkdown = `- [![${problemNumber}](https://img.shields.io/badge/${problemNumber}-${encodeURIComponent(badgeSlug)}-${badgeColor})](/problems/${problemNumber}.md)`;
infoLog(`problme badge: ${badgeMarkdown}`);

infoLog(`Problem ${problemNumber}: "${problemTitle}" (${difficulty})`);
infoLog(`Badge: ${badgeMarkdown}`);


// -----------------------------
// Determine target list file (easy.md, medium.md, hard.md)
// Paths are resolved relative to repo root (cwd)
// -----------------------------

// difficulty and associated file
const difficultyFileMap = { 
    easy: 'easy.md', 
    medium: 'medium.md', 
    hard: 'hard.md' 
};

// STEP 12: Get file based on problem difficulty
const difficultyFileName = difficultyFileMap[difficulty];
infoLog('difficulty file:', difficultyFileName);
if (!difficultyFileName) log("error", `${difficulty} is unknown difficulty`);
    
// STEP 13: Get file path
const difficultyFilePath = path.resolve(workingDirectory, difficultyFileName);
infoLog('difficulty file path:', difficultyFilePath);
if (!fs.existsSync(difficultyFilePath)) {
    const header = `# ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Problems\n\n`;
    fs.writeFileSync(difficultyFilePath, header, 'utf8');
    infoLog('Created difficulty file:', difficultyFilePath);
}


// STEP 14: Append badge if missing
if (fileHasExactLine(difficultyFilePath, badgeMarkdown)) {
    infoLog(`${badgeMarkdown} already present in ${difficultyFilePath}. Skipping append.`);
} else {
    fs.appendFileSync(difficultyFilePath, badgeMarkdown + '\n', 'utf8');
    infoLog(`Appended badge to ${difficultyFilePath}`);
}


// STEP 15: Locate data.json
let dataJsonFilePath = path.join(scriptDirectory, 'data.json');
infoLog(`data.json file by ${scriptDirectory}: ${dataJsonFilePath}`);
if (!fs.existsSync(dataJsonFilePath)) {
    const alt = path.join(workingDirectory, '_scripts', 'data.json');
    infoLog(`data.json file by ${workingDirectory}: ${alt}`);

    if (fs.existsSync(alt)) dataJsonFilePath = alt;
}
if (!fs.existsSync(dataJsonFilePath)) errorLog("error", `data.json not found at _scripts/data.json or script directory.`);

// STEP 16: Read data.json file
const dataJsonRaw = fs.readFileSync(dataJsonFilePath, 'utf8');
infoLog(`data.json raw content: ${dataJsonRaw}`);
const dataStats = readJsonSafe(dataJsonFilePath);
infoLog(`data.json parsed content: ${JSON.stringify(dataStats)}`);

// STEP 17: Backup data.json -> to avoid accidental overwrite of previous bak
const bakPath = dataJsonFilePath + '.bak.' + new Date().toISOString().replace(/[:.]/g, '-');
fs.writeFileSync(bakPath, dataJsonRaw || JSON.stringify({}, null, 4), 'utf8');
infoLog('Backed up data.json to', bakPath);

// STEP 18: Update data.json stats
infoLog(`Before data.json update: ${JSON.stringify({'totalSolvedProblems': dataStats.totalSolvedProblems, 'solvedEasyProblems': dataStats.solvedEasyProblems, 'solvedMediumProblems': dataStats.solvedMediumProblems, 'solvedHardProblems': dataStats.solvedHardProblems})}`);
dataStats.totalSolvedProblems = (Number(dataStats.totalSolvedProblems) || 0) + 1;
if (difficulty === 'easy') dataStats.solvedEasyProblems = (Number(dataStats.solvedEasyProblems) || 0) + 1;
if (difficulty === 'medium') dataStats.solvedMediumProblems = (Number(dataStats.solvedMediumProblems) || 0) + 1;
if (difficulty === 'hard') dataStats.solvedHardProblems = (Number(dataStats.solvedHardProblems) || 0) + 1;
infoLog(`After data.json update: ${JSON.stringify({'totalSolvedProblems': dataStats.totalSolvedProblems, 'solvedEasyProblems': dataStats.solvedEasyProblems, 'solvedMediumProblems': dataStats.solvedMediumProblems, 'solvedHardProblems': dataStats.solvedHardProblems})}`);

// Write updated JSON atomically
writeFileAtomic(dataJsonFilePath, JSON.stringify(dataStats, null, 4));
infoLog(`data.json updated successfully`);
// End of script
