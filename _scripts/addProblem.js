// _scripts/addProblem.js
// Usage: node _scripts/addProblem.js problems/235.md [--dry-run]

const fs = require('fs');
const path = require('path');

function fail(msg) { console.error(msg); process.exit(1); }

if (process.argv.length < 3) {
  fail('Usage: node _scripts/addProblem.js <path-to-problem-md> [--dry-run]');
}

const problemPath = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

if (!fs.existsSync(problemPath)) {
  fail('File not found: ' + problemPath);
}

const raw = fs.readFileSync(problemPath, 'utf8');
const lines = raw.split(/\r?\n/);

if (lines.length < 2) fail('Problem file must have at least two lines (title and difficulty).');

// Parse first line: "# 🧩 Problem #118 – Pascal's Triangle"
const firstLine = lines[0].trim();
const firstLineRegex = /#.*?Problem\s*#?(\d+)\s*[–-]\s*(.+)$/u;
const m = firstLine.match(firstLineRegex);
if (!m) fail("First line not in expected format. Example: \"# 🧩 Problem #118 – Pascal's Triangle\"");

const num = m[1];
let title = m[2].trim();

// Parse difficulty from second line: "**Difficulty:** Easy"
const secondLine = lines[1].trim();
const diffRegex = /\*\*Difficulty:\*\*\s*(Easy|Medium|Hard)/i;
const md = secondLine.match(diffRegex);
if (!md) fail('Second line must contain difficulty: "**Difficulty:** Easy|Medium|Hard"');
const difficulty = md[1].toLowerCase(); // easy|medium|hard

// sanitize title for badge (replace spaces with _, remove bad chars)
const slug = title.replace(/\s+/g, '_').replace(/[^\w_]/g, '');

// choose color
const badgeColor = difficulty === 'easy' ? 'brightgreen' : difficulty === 'medium' ? 'yellow' : 'red';
const badgeLine = `- [![${num}](https://img.shields.io/badge/${num}-${encodeURIComponent(slug)}-${badgeColor})](/problems/${num}.md)`;

// list files
const lists = { easy: 'easy.md', medium: 'medium.md', hard: 'hard.md' };
const targetListFile = lists[difficulty];
if (!targetListFile) fail('Unknown difficulty: ' + difficulty);

function fileContainsLine(filePath, line) {
  if (!fs.existsSync(filePath)) return false;
  const txt = fs.readFileSync(filePath, 'utf8');
  return txt.split(/\r?\n/).some(l => l.trim() === line.trim());
}

// Dry run: show what would change
console.log(`Problem #${num}: "${title}" (${difficulty})`);
console.log('Badge:', badgeLine);
if (dryRun) {
  console.log('--dry-run enabled. Not modifying files.');
  console.log(`Would append to ${targetListFile} if not present.`);
  if (fs.existsSync('_scripts/data.json')) {
    const j = JSON.parse(fs.readFileSync('_scripts/data.json','utf8') || '{}');
    console.log('Current totals (data.json):', {
      totalSolvedProblems: j.totalSolvedProblems,
      solvedEasyProblems: j.solvedEasyProblems,
      solvedMediumProblems: j.solvedMediumProblems,
      solvedHardProblems: j.solvedHardProblems
    });
  } else {
    console.log('_scripts/data.json not found.');
  }
  process.exit(0);
}

// Ensure list file exists
if (!fs.existsSync(targetListFile)) {
  fs.writeFileSync(targetListFile, `# ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Problems\n\n`);
}

// Avoid duplicates
if (fileContainsLine(targetListFile, badgeLine)) {
  console.log(`Badge already present in ${targetListFile}. Skipping append.`);
} else {
  fs.appendFileSync(targetListFile, badgeLine + '\n', 'utf8');
  console.log(`Appended badge to ${targetListFile}`);
}

// Update data.json
const dataJsonPath = path.join('_scripts', 'data.json');
if (!fs.existsSync(dataJsonPath)) {
  fail('data.json not found at _scripts/data.json');
}

const rawData = fs.readFileSync(dataJsonPath, 'utf8');
let json;
try { json = JSON.parse(rawData); } catch (err) { fail('Invalid JSON in data.json'); }

// Backup
fs.writeFileSync(dataJsonPath + '.bak', rawData, 'utf8');

json.totalSolvedProblems = (Number(json.totalSolvedProblems) || 0) + 1;
if (difficulty === 'easy') json.solvedEasyProblems = (Number(json.solvedEasyProblems) || 0) + 1;
if (difficulty === 'medium') json.solvedMediumProblems = (Number(json.solvedMediumProblems) || 0) + 1;
if (difficulty === 'hard') json.solvedHardProblems = (Number(json.solvedHardProblems) || 0) + 1;

fs.writeFileSync(dataJsonPath, JSON.stringify(json, null, 4), 'utf8');
console.log('Updated', dataJsonPath);
console.log('New totals:', {
  totalSolvedProblems: json.totalSolvedProblems,
  solvedEasyProblems: json.solvedEasyProblems,
  solvedMediumProblems: json.solvedMediumProblems,
  solvedHardProblems: json.solvedHardProblems
});
