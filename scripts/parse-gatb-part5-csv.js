import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CSV file
const csvPath = 'c:/Users/chira/Downloads/Lakshya Counselling - GATB P5 Questions.csv';
const csv = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
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
  .filter(row => row['Question No.'] && row['Question No.'] !== '');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write JSON file
const jsonPath = path.join(dataDir, 'gatb-part-5-questions.json');
fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2));

console.log(`✅ Created JSON file with ${questions.length} questions`);
console.log(`📁 Saved to: ${jsonPath}`);

