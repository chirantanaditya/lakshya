const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = 'c:/Users/chira/Downloads/Copy of Lakshaya Counselling - Firo-Bs.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (simple parser - assumes no commas in quoted fields for now)
const lines = csvContent.split('\n').slice(1).filter(l => l.trim());

const questions = [];

lines.forEach((line, idx) => {
  // Split by comma, but handle quoted fields
  const cols = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cols.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cols.push(current.trim()); // Add last column
  
  if (cols.length >= 18) {
    const qNum = cols[10] || String(idx + 1);
    const qText = cols[11] || '';
    const opts = [
      cols[12], cols[13], cols[14], cols[15], cols[16], cols[17]
    ].filter(o => o && o.trim());
    
    if (qText) {
      questions.push({
        id: `firob-q${qNum}`,
        questionNumber: parseInt(qNum) || idx + 1,
        questionText: qText,
        options: opts
      });
    }
  }
});

// Sort by question number
questions.sort((a, b) => a.questionNumber - b.questionNumber);

// Write to JSON file
const outputPath = path.join(__dirname, '../data/firo-b-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf-8');

console.log(`Created ${questions.length} questions in ${outputPath}`);
