const express = require("express");
const path = require("path");
const router = express.Router();
const saveNotes = require("../util/writeFile.js");
const deleteNote = require("../util/deleteFile.js");
let notes = require("../db/db.json");

const filterByQuery = (query, arr) => {
  let titleArr = [];
  let filtered = arr;

  if (query.title) {
    if (typeof query.title === "string") {
      titleArr = [query.title];
    } else {
      titleArr = query.title;
    }
    titleArr.forEach((title) => {
      filtered = filtered.filter((note) => note.title.indexOf(title) !== -1);
    });
  }

  if (query.title) {
    filtered = filtered.filter((note) => note.title === query.title);
  }
  if (query.text) {
    filtered = filtered.filter((note) => note.text === query.text);
  }
  return filtered;
};

const findById = (id, arr) => {
  const result = arr.filter((note) => note.id === id)[0];
  return result;
};

router.get("/notes", (req, res) => {
  res.header("Content-Type", "application/json");
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

router.get("/notes/:id", (req, res) => {
  let result = findById(req.params.id, notes);
  try {
    if (result.id === req.params.id) {
      res.json(result);
    }
  } catch (error) {
    res.send("404 - Page Not Found");
  }
});

router.post("/notes", (req, res) => {
  const isValid = true;
  if (isValid) {
    console.log("Note sent!");
    saveNotes(req.body);
  }
  res.json(req.body);
});

router.delete("/notes/:id", (req, res) => {
  console.log("Removing Note...");
  deleteNote(req.params.id);
  res.send("Done");
});

module.exports = router;
