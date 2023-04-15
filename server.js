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


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

app.post('/api/notes', (req, res)=> {

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

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  
    const dbData = JSON.parse(data);
  
    const objectIdToRemove = req.params.id;
    const objectIndexToRemove = dbData.findIndex(obj => obj.id === objectIdToRemove);
    if (objectIndexToRemove !== -1) {
      dbData.splice(objectIndexToRemove, 1);
    }
  
    fs.writeFile('./db/db.json', JSON.stringify(dbData), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return;
      }
  
      console.log(`Object with ID ${objectIdToRemove} has been deleted.}.`);
    });
  });
})


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
