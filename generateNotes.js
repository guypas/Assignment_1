const fs = require('fs');
const path = require('path');

function generateNotes(N) {
  const notes = [];

  for (let i = 1; i <= N; i++) {
    notes.push({
      id: i,
      title: `Note ${i}`,
      author: {
        name: `Author ${i}`,
        email: `mail_${i}@gmail.com`
      },
      content: `Content for note ${i}`
    });
  }

  return { notes };
}

function saveNotesToFile(notes, filePath) {
  fs.writeFile(filePath, JSON.stringify(notes, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log(`Notes saved to ${filePath}`);
    }
  });
}

const args = process.argv.slice(2);
const N = parseInt(args[0], 10);

if (isNaN(N)) {
  console.error('Please provide a valid number for N');
  process.exit(1);
}

const notes = generateNotes(N);
const filePath = path.join(__dirname, 'data', 'notes.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

saveNotesToFile(notes, filePath);