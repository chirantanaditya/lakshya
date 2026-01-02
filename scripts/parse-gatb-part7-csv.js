import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all three CSV files
const csvPaths = [
  'c:/Users/chira/Downloads/Lakshya Counselling - GATB P7 Images.csv',
  'c:/Users/chira/Downloads/Lakshya Counselling - GATB - P7 - set 2s.csv',
  'c:/Users/chira/Downloads/Lakshya Counselling - GATB - P7 - set 3 Images.csv',
];

const allQuestions = [];

csvPaths.forEach((csvPath, setIndex) => {
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const lines = csv.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim());

  const questions = lines.slice(1)
    .map(line => {
      // Handle CSV parsing with quoted fields
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
      
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] || '';
      });
      return obj;
    })
    .filter(row => {
      // Filter based on available fields
      const hasImage = row['Image'] || row['Question Image'];
      const hasNumber = row['Number'] || row['Question No.'];
      return hasImage && hasNumber;
    })
    .map(row => ({
      ...row,
      part: setIndex + 1, // Part 1, 2, or 3
      imageUrl: row['Image'] || row['Question Image'],
      number: row['Number'] || row['Question No.'],
    }));

  allQuestions.push(...questions);
});

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write JSON file
const jsonPath = path.join(dataDir, 'gatb-part-7-questions.json');
fs.writeFileSync(jsonPath, JSON.stringify(allQuestions, null, 2));

console.log(`✅ Created JSON file with ${allQuestions.length} questions`);
console.log(`📁 Saved to: ${jsonPath}`);
console.log(`📊 Part 1: ${allQuestions.filter(q => q.part === 1).length} images`);
console.log(`📊 Part 2: ${allQuestions.filter(q => q.part === 2).length} images`);
console.log(`📊 Part 3: ${allQuestions.filter(q => q.part === 3).length} images`);

