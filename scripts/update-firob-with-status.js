const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = 'c:/Users/chira/Downloads/Lakshayas Counselling- Assessment Test - Firo-B.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Read existing JSON
const jsonPath = path.join(__dirname, '../data/firo-b-questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Parse CSV
const lines = csvContent.split('\n').slice(1).filter(l => l.trim());

const csvData = [];
lines.forEach((line) => {
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
  cols.push(current.trim());
  
  if (cols.length >= 15) {
    const num = parseInt(cols[1]) || 0;
    if (num > 0) {
      csvData.push({
        number: num,
        question: cols[2],
        options: [
          { text: cols[3] || '', status: cols[4] || 'none' },
          { text: cols[5] || '', status: cols[6] || 'none' },
          { text: cols[7] || '', status: cols[8] || 'none' },
          { text: cols[9] || '', status: cols[10] || 'none' },
          { text: cols[11] || '', status: cols[12] || 'none' },
          { text: cols[13] || '', status: cols[14] || 'none' },
        ]
      });
    }
  }
});

// Update questions with status
const updatedQuestions = existingQuestions.map((q) => {
  const csvRow = csvData.find(row => row.number === q.questionNumber);
  if (csvRow) {
    // Map options with status
    const optionsWithStatus = q.options.map((opt, idx) => {
      // Try to find matching option from CSV
      let csvOpt = csvRow.options[idx];
      
      // If direct index doesn't match, try to find by text (handle typos)
      if (!csvOpt || csvOpt.text.toLowerCase().replace(/somtimes/g, 'sometimes') !== opt.toLowerCase()) {
        csvOpt = csvRow.options.find(co => {
          const normalizedCsv = co.text.toLowerCase().replace(/somtimes/g, 'sometimes').trim();
          const normalizedOpt = opt.toLowerCase().trim();
          return normalizedCsv === normalizedOpt;
        });
      }
      
      return {
        text: opt,
        status: csvOpt ? (csvOpt.status || 'none') : 'none'
      };
    });
    
    return {
      ...q,
      options: optionsWithStatus
    };
  }
  return q;
});

// Write updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(updatedQuestions, null, 2), 'utf-8');
console.log(`Updated ${updatedQuestions.length} questions with status information`);
