const fs = require('fs');
const path = require('path');

// create notes and put it inside json format and return it
const generateNotes = (numOfNotes) => {
  const notes = [];

  for (let i = 1; i <= numOfNotes; i++) {
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

// save the notes inside the notes.json
const saveNotesToFile = (notes, filePath) => {
  fs.writeFile(filePath, JSON.stringify(notes, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log(`Notes saved to ${filePath}`);
    }
  });
}

const args = process.argv.slice(2);
const numOfNotes = parseInt(args[0], 10);

// check valid input
if (isNaN(numOfNotes)) {
  console.error('Please provide a valid number');
  process.exit(1);
}

const notes = generateNotes(numOfNotes);
const filePath = path.join(__dirname, 'data', 'notes.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

saveNotesToFile(notes, filePath);