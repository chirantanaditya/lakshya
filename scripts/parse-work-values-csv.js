import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CSV file - user will need to provide the path
const csvPath = process.argv[2] || 'c:/Users/chira/Downloads/Lakshayas Counselling- Assessment Test - Work Values.csv';

if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found. Please provide the path as an argument:');
  console.error('node scripts/parse-work-values-csv.js "path/to/file.csv"');
  process.exit(1);
}

const csv = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV - handle quoted fields
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

const lines = csv.split('\n').filter(l => l.trim());
const headers = parseCSVLine(lines[0]);

// Find column indices
const questionNumIndex = headers.indexOf('S NO');
const questionTextIndex = headers.indexOf('Questions');
const statusIndex = headers.indexOf('Status');

// Attribute columns
const attributes = [
  'Intellectual Stimulation',
  'Altruism',
  'Economic Returns',
  'Variety',
  'Independence',
  'Prestige',
  'Aesthetic',
  'Associates',
  'Security',
  'Way of Life',
  'Supervisory Relations',
  'Surrounding',
  'Achievement',
  'Management',
  'Creativity'
];

// Parse questions
const questions = [];
let currentQuestion = null;
let questionNumber = 0;

for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  
  // Check if this is a new question (has a number in S NO column)
  const qNum = values[questionNumIndex];
  if (qNum && qNum.match(/^\d+$/)) {
    // Save previous question if exists
    if (currentQuestion && currentQuestion.options.length === 2) {
      questions.push(currentQuestion);
    }
    
    questionNumber = parseInt(qNum);
    currentQuestion = {
      questionNumber: questionNumber.toString(),
      itemId: `wv-q${questionNumber}`,
      options: []
    };
  }
  
  // Check if this is option a) or b)
  const optionLabel = values[questionNumIndex + 1] || ''; // The column after S NO
  if ((optionLabel === 'a)' || optionLabel === 'b)') && currentQuestion) {
    const questionText = values[questionTextIndex] || '';
    const status = values[statusIndex] || '';
    
    // Find which attributes this option contributes to
    const contributingAttributes = [];
    attributes.forEach((attr) => {
      const attrIndex = headers.indexOf(attr);
      if (attrIndex !== -1 && values[attrIndex] === '1') {
        contributingAttributes.push(attr);
      }
    });
    
    if (questionText) {
      currentQuestion.options.push({
        label: optionLabel.replace(')', ''), // 'a' or 'b'
        text: questionText,
        status: status,
        attributes: contributingAttributes
      });
    }
  }
}

// Save the last question
if (currentQuestion && currentQuestion.options.length === 2) {
  questions.push(currentQuestion);
}

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'data', 'work-values-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));

console.log(`✅ Parsed ${questions.length} questions`);
console.log(`✅ Saved to ${outputPath}`);
console.log(`\nSample question:`, JSON.stringify(questions[0], null, 2));
