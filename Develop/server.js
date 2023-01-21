
// Importing modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
// Helper method for generating unique ids
const uuid = require('uuid');

// const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants"); //check this - is a constant used to check whether the prime number is safe or not.

// Initialize express
const app = express();

// SET PORT - access to the proceess .env for Heroku
var PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api); //changed api for notes 

// Authorized to make it public
app.use(express.static("public"));

//----Setting routes for APIs---

// Gets notes saved and joins it in db.json
app.get("/api/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "/db/db.json"))
);

// Add new notes to db.json
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
});

// Deleting notes
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
    res.json(delNote);
})


//  This will call home page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// ---- notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//--- Start listen
app.listen(PORT, function () {
    // console.log("App listening on PORT: " + PORT);
    console.log(`Example app listening at http://localhost:${PORT} 🚀`)
});