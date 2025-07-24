const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");
// const multer = require("multer"); #only needed without FilePond
// if not needed anymore run: npm uninstall multer
const path = require("path");
const fs = require("fs");
// const { coverImageBasePath } = require("../models/book");
// const uploadPath = path.join("public", Book.coverImageBasePath);
/**
 * This code was use without FilePond
 * >>>>>>>>>>>>>>>>>>>>
 */
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });
// <<<<<<<<<<<<<<<<<<<<

// All books route
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/index", {
      books,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect("/");
  }
});

// New book route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create Book route
// Upload is not needed when using FilePond because the req has a enc64 version of the image
// router.post("/", upload.single("cover"), async (req, res) => {
router.post("/", async (req, res) => {
  // const fileName = req.file != null ? req.file.filename : null; # Used for filesystem stored files
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    // coverImageName: fileName, # Used for filesystem stored files
    description: req.body.description,
  });

  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect("books");
  } catch (error) {
    // This code is used to remove files from the filesystem
    // if (book.coverImageName) {
    //   removeBookCover(book.coverImageName);
    // }
    renderNewPage(res, book, true);
  }
});

/**
 * This funtion was used to remove files store in the file system
 */
// function removeBookCover(fileName) {
//   fs.unlink(path.join(uploadPath, fileName), (err) => {
//     if (err) {
//       console.error(err);
//     }
//   });
// }

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book,
    };
    if (hasError) {
      params.errorMessage = "Error Creating Book";
    }
    res.render("books/new", params);
  } catch (error) {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) {
    return;
  }

  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
