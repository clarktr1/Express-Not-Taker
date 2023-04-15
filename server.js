const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const fs = require('fs');
const {v4: uuidv4} = require('uuid')


// Serve the files in the 'public' directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'public.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while reading the notes.');
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

app.post('/api/post', (req, res)=> {

  const notes = req.body;
  notes.id = uuidv4()

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while reading the db.json file.');
      return;
    }

  let noteArr = JSON.parse(data || '[]')
  noteArr.push(notes)

  
  fs.writeFile("./db/db.json", JSON.stringify(noteArr), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while writing the notes.');
    } else {
      res.json(notes);
    }
  })
})
})


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
