'use strict';

const fs = require('fs');
const path = require('path');

function infoLog(msg) { console.log('INFO:', msg); }
function errorLog(msg) { console.error('ERROR:', msg); process.exit(1); }
const normalizeLine = l => (l || '').replace(/\uFEFF/g, '').replace(/\u00A0/g, ' ').trim();
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

try{

    let workingDirectory = path.resolve(process.cwd(), '..');

    // STEP 1: get 'problems' forlder path
    const problemFolderPath = path.join(workingDirectory, 'problems');

    // STEP 2: get all problem file paths
    const allProblmePaths = fs.readdirSync(problemFolderPath).filter(file => file.endsWith('.md'));

    // STEP 3: read each problem file and collect important data
    const problemData = [];
    const topicsMap = new Map();
    let easyCount = 0, mediumCount = 0, hardCount = 0;
    allProblmePaths.forEach((file, index) => {
        const filePath = path.join(problemFolderPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        const top4NonEmptyLines = [];
        for(let i=0; i<lines.length && top4NonEmptyLines.length<4; i++){
            const line = normalizeLine(lines[i]);
            if(line.length > 0){
                top4NonEmptyLines.push(line);
            }
        }
        if(top4NonEmptyLines.length < 4) errorLog(`File ${file} does not have enough non-empty lines.`);
        else{

            // STEP 4: extract problem number and title
            const headerRegex = /^#.*?Problem\s*#?(\d+)\s*[–—-]\s*(.+)$/u;
            const firstLineMatch = top4NonEmptyLines[0].match(headerRegex);
            if(!firstLineMatch) errorLog(`File ${file} ---> ${top4NonEmptyLines[0]} incorrect.`);
            const problemNumber = parseInt(firstLineMatch[1], 10);
            const problemTitle = firstLineMatch[2].trim();

            // STEP 5: extract difficulty
            const diffRegex = /\*\*Difficulty:\*\*\s*(Easy|Medium|Hard)/i;
            const secondLineMatch = top4NonEmptyLines[1].match(diffRegex);
            if(!secondLineMatch) errorLog(`File ${file} ---> ${top4NonEmptyLines[1]} incorrect.`);
            const difficulty = secondLineMatch[1].toLowerCase();

            // STEP 6: extract problem tags
            const topicsRegex = /^\*\*Topics:\*\*\s*(.+)/i;
            const tagsRegex = /^\*\*Tags:\*\*\s*(.+)/i;
            let thirdLineMatch = top4NonEmptyLines[2].match(topicsRegex);
            if(!thirdLineMatch) thirdLineMatch = top4NonEmptyLines[2].match(tagsRegex);
            if(!thirdLineMatch) errorLog(`File ${file} ---> ${top4NonEmptyLines[2]} incorrect.`);
            const topics = thirdLineMatch[1].split(', ').map(t => t.replace(/`/g, '').trim()).filter(Boolean);

            // STEP 7: generate badge and link
            const difficultyColorsMap = { easy: "brightgreen", medium: "yellow", hard: "red" };
            const badgeSlug = slugifyTitle(problemTitle);
            const badgeColor = difficultyColorsMap[difficulty];
            const badgeMarkdown = `- [![${problemNumber}](https://img.shields.io/badge/${problemNumber}-${encodeURIComponent(badgeSlug)}-${badgeColor})](/problems/${problemNumber}.md)`;

            const _problemData = {
                number: problemNumber,
                title: problemTitle,
                difficulty: difficulty,
                topics: topics,
                badge: badgeMarkdown
            }

            // SETP 8: split problems in topics
            topics.forEach(topic => {
                const topicLower = topic.toLowerCase().trim();
                if(!topicsMap.has(topicLower)) topicsMap.set(topicLower, []);
                const existingProblmes = topicsMap.get(topicLower);
                topicsMap.set(topicLower, [...existingProblmes, _problemData]);
            });

            problemData.push(_problemData);
            if(difficulty === 'easy') easyCount++;
            else if(difficulty === 'medium') mediumCount++;
            else if(difficulty === 'hard') hardCount++; 
        }  
    });
    
    // STEP 9: sort problems by number
    problemData.sort((a, b) => a.number - b.number);

    // STEP 10: clear easy, medium, hard files
    function emptyFile(filePath){
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        const top3Lines = lines.slice(0, 3);
        top3Lines.push('\n'); // add a blank line
        const updatedContent = top3Lines.join('\n');
        fs.writeFileSync(filePath, updatedContent);
    }
    const easyFilePath = path.join(workingDirectory, 'easy.md');
    emptyFile(easyFilePath);
    const mediumFilePath = path.join(workingDirectory, 'medium.md');
    emptyFile(mediumFilePath);
    const hardFilePath = path.join(workingDirectory, 'hard.md');
    emptyFile(hardFilePath);

    // STEP 11: append problems to easy, medium, hard files
    function appendToFile(filePath, problem){
        fs.appendFileSync(filePath, problem+'\n');
    }
    problemData.forEach(problem => {
        if(problem.difficulty === 'easy') appendToFile(easyFilePath, problem.badge);
        else if(problem.difficulty === 'medium') appendToFile(mediumFilePath, problem.badge);
        else if(problem.difficulty === 'hard') appendToFile(hardFilePath, problem.badge);
    });

    // STEP 12: remove all topic files from 'skills' folder
    const skillsFolderPath = path.join(workingDirectory, 'skills');
    const existingSkillFiles = fs.readdirSync(skillsFolderPath).filter(file => file.endsWith('.md'));
    existingSkillFiles.forEach(file => {
        const filePath = path.join(skillsFolderPath, file);
        fs.unlinkSync(filePath);
    });
    
    // STEP 13: create new topic files in 'skills' folder
    const topics = Array.from(topicsMap.keys());
    topics.forEach(topic => {
        const problems = topicsMap.get(topic);
        problems.sort((a, b) => a.number - b.number);
        const topicFileName = `${topic.split(" ").join("_")}.md`;
        const topicFilePath = path.join(skillsFolderPath, topicFileName);

        let lines = "";
        const capsizedTopic = topic.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        lines+= `# [⬅️](../README.md) ${capsizedTopic} \n\n`; // file header and blank line
        lines+= "Click a problem to view your notes & solution\n\n"; // general line and blank line
        
        // add each problems 1 by 1
        problems.forEach(problem => {
            lines+= `${problem.badge}\n`;
        });

        fs.writeFileSync(topicFilePath, lines);
    });
        
    // STEP 14: update README.md - remove all tags under section '## Skills'
    const readmeFilePath = path.resolve(workingDirectory, 'README.md');
    if (!fs.existsSync(readmeFilePath)) errorLog(`README.md not found at: ${readmeFilePath}`);
    let readmeContent = fs.readFileSync(readmeFilePath, 'utf8').replace(/\r\n/g, '\n');
    const readmeLines = readmeContent.split('\n');
    let skillsIndex = readmeLines.findIndex(line => line.trim() === '## Skills');
    infoLog(`'## Skills' found at line ${skillsIndex}`);
    if (skillsIndex !== -1) {
        // find all topic badge lines after header
        let badgeLineIndex = skillsIndex + 1;
        while (badgeLineIndex < readmeLines.length && readmeLines[badgeLineIndex].trim() === '') badgeLineIndex++;
        
        // collect existing topics from badges
        const existingTopicsBadges = (readmeLines[badgeLineIndex] || '').split(') ');
        const existingTopics = new Set();
        existingTopicsBadges.forEach(badge => {
            if(badge){
                const topic = badge.split("[![")[1]?.split("](")[0];
                if (topic) existingTopics.add(topic?.toLocaleLowerCase());
            }
        });
    
        // check our topics exist - if missing add the topic add end
        topics.forEach(topic => {
            const topicLower = topic.toLowerCase().trim();
            if (!existingTopics.has(topicLower)) {
                const capsizedTopic = topic.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                const topicFileName = `${topicLower.split(" ").join("_")}.md`;
                const topicFilePath = path.join('skills', topicFileName);
                const newBadge = `[![${capsizedTopic}](https://img.shields.io/badge/${capsizedTopic.split(" ").join("_")}-gray)](./${topicFilePath}) `;
                
                readmeLines[badgeLineIndex] = (readmeLines[badgeLineIndex] || '') + newBadge;
                
                fs.writeFileSync(readmeFilePath, readmeLines.join('\n'), 'utf8');
                infoLog(`Appended missing topic badge for "${topic}" to README.md`);
            } else {
                infoLog(`Topic "${topic}" already present in README.md. Skipping.`);
            }
        });
    }

    // STEP 16: update data.json - update total problems, easy, medium, hard counts
    const dataJsonFilePath = path.join(workingDirectory, '_scripts/data.json');
    if(!fs.existsSync(dataJsonFilePath)) errorLog(`data.json file not found at: ${dataJsonFilePath}`);
    const dataJsonContent = fs.readFileSync(dataJsonFilePath, 'utf-8');
    let data = {};
    try{
        data = JSON.parse(dataJsonContent);
    }catch(parseError){
        errorLog(`data.json content is not a valid json: ${parseError.message}`);
    }
    data.totalSolvedProblems = problemData.length;
    data.solvedEasyProblems = easyCount;
    data.solvedMediumProblems = mediumCount;
    data.solvedHardProblems = hardCount;
    fs.writeFileSync(dataJsonFilePath, JSON.stringify(data, null, 4));

    infoLog('Update completed successfully.');

}catch(error){
    errorLog(`${error.message}`);
}