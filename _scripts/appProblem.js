#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/addProblem.js problems/235.md
 *
 * What it does:
 *  - Reads the problem .md (first line for number & title, second line for Difficulty)
 *  - Appends badge line to easy.md / medium.md / hard.md in repository root (as you described)
 *  - Updates _scripts/data.json counters: totalSolvedProblems and solved{Easy|Medium|Hard}Problems
 *  - Makes a backup of data.json as data.json.bak before writing
 */

const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node scripts/addProblem.js <path-to-problem-md>');
  process.exit(1);
}

const problemPath = process.argv[2];
if (!fs.existsSync(problemPath)) {
  console.error('File not found:', problemPath);
  process.exit(1);
}

const content = fs.readFileSync(problemPath, 'utf8').split(/\r?\n/);
if (content.length < 2) {
  console.error('Problem file must have at least two lines (title and difficulty).');
  process.exit(1);
}

// Parse first line: "# 🧩 Problem #118 – Pascal's Triangle"
const firstLine = content[0].trim();
const firstLineRegex = /#.*?Problem\s*#?(\d+)\s*[–-]\s*(.+)$/u;
const m = firstLine.match(firstLineRegex);
if (!m) {
  console.error('First line not in expected format. Example: "# 🧩 Problem #118 – Pascal\\'s Triangle"');
  process.exit(1);
}
const num = m[1];
let title = m[2].trim();

// Parse difficulty from second line: "**Difficulty:** Easy"
const secondLine = content[1].trim();
const diffRegex = /\*\*Difficulty:\*\*\s*(Easy|Medium|Hard)/i;
const md = secondLine.match(diffRegex);
if (!md) {
  console.error('Second line must contain difficulty: "**Difficulty:** Easy|Medium|Hard"');
  process.exit(1);
}
const difficulty = md[1].toLowerCase(); // "easy" | "medium" | "hard"

// Quick sanity: file name vs number
const fileName = path.basename(problemPath);
const fileNumFromName = fileName.replace(/\D/g, '');
if (fileNumFromName && fileNumFromName !== num) {
  console.warn(`Warning: filename number (${fileNumFromName}) and header number (${num}) differ. Using header number (${num}).`);
}

// Slugify title similar to your examples: spaces -> _, remove non-word except _
const slug = title.replace(/\s+/g, '_').replace(/[^\w_]/g, '');

// Choose badge color (match your examples)
const badgeColor = difficulty === 'easy' ? 'brightgreen' : difficulty === 'medium' ? 'yellow' : 'red';

// Construct badge line
const badgeLine = `- [![${num}](https://img.shields.io/badge/${num}-${encodeURIComponent(slug)}-${badgeColor})](/problems/${num}.md)`;

// Paths for lists and data.json
const lists = {
  easy: 'easy.md',
  medium: 'medium.md',
  hard: 'hard.md'
};
const dataJsonPath = path.join('_scripts', 'data.json');

// Append badge line to corresponding list file
const targetListFile = lists[difficulty];
if (!targetListFile) {
  console.error('Unknown difficulty:', difficulty);
  process.exit(1);
}
try {
  // Ensure file exists; create if not
  if (!fs.existsSync(targetListFile)) {
    fs.writeFileSync(targetListFile, `# ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Problems\n\n`);
  }
  // Append with newline
  fs.appendFileSync(targetListFile, `${badgeLine}\n`);
  console.log(`Appended badge to ${targetListFile}:`);
  console.log(badgeLine);
} catch (e) {
  console.error('Failed to update list file:', e);
  process.exit(1);
}

// Update _scripts/data.json
if (!fs.existsSync(dataJsonPath)) {
  console.error('data.json not found at _scripts/data.json');
  process.exit(1);
}
try {
  const raw = fs.readFileSync(dataJsonPath, 'utf8');
  const json = JSON.parse(raw);

  // Backup
  fs.writeFileSync(dataJsonPath + '.bak', raw, 'utf8');

  json.totalSolvedProblems = (Number(json.totalSolvedProblems) || 0) + 1;

  if (difficulty === 'easy') {
    json.solvedEasyProblems = (Number(json.solvedEasyProblems) || 0) + 1;
  } else if (difficulty === 'medium') {
    json.solvedMediumProblems = (Number(json.solvedMediumProblems) || 0) + 1;
  } else if (difficulty === 'hard') {
    json.solvedHardProblems = (Number(json.solvedHardProblems) || 0) + 1;
  }

  // Optionally update colors if missing (keeps existing)
  json.easyBackgroundColor = json.easyBackgroundColor || "#1cbaba";
  json.easyTextColor = json.easyTextColor || "#1cbaba";
  json.mediumBackgroundColor = json.mediumBackgroundColor || "#ffb700";
  json.mediumTextColor = json.mediumTextColor || "#ffb700";
  json.hardBackgroundColor = json.hardBackgroundColor || "#f63737";
  json.hardTextColor = json.hardTextColor || "#f63737";

  fs.writeFileSync(dataJsonPath, JSON.stringify(json, null, 4), 'utf8');
  console.log('Updated', dataJsonPath);
  console.log('New totals:', {
    totalSolvedProblems: json.totalSolvedProblems,
    solvedEasyProblems: json.solvedEasyProblems,
    solvedMediumProblems: json.solvedMediumProblems,
    solvedHardProblems: json.solvedHardProblems
  });
} catch (e) {
  console.error('Failed to update data.json:', e);
  process.exit(1);
}

console.log('\nDone. Consider committing the changes:');
console.log(`  git add ${targetListFile} ${dataJsonPath} && git commit -m "Add problem #${num}: ${title}"`);
