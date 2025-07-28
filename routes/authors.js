const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

// All author route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect("/");
  }
});

// New author route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create Author route
router.post("/", async (req, res) => {
  // save new author
  const author = new Author({
    name: req.body.name,
  });

  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (error) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating author",
    });
  }
  // res.send("Create");
  // res.send(req.body.name);
});

router.get("/:id", async (req, res) => {
  // res.send("Show author " + req.params.id);
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: books,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch (error) {
    res.redirect("/authors");
  }
});

// Update author
router.put("/:id", async (req, res) => {
  // res.send("Update author " + req.params.id);
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render(`authors/edit/${author.id}`, {
        author: author,
        errorMessage: "Error updating author",
      });
    }
  }
});

// Delete author
router.delete("/:id", async (req, res) => {
  // res.send("Delete author " + req.params.id);
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    res.redirect(`/authors`);
  } catch (err) {
    if (req.params.id == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${req.params.id}`);
    }
  }
});

module.exports = router;
