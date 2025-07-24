const mongoose = require("mongoose");
const path = require("path");
const coverImageBasePath = "uploads/bookCovers";
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // The name was used without FilePond
  // coverImageName: {
  //   type: String,
  //   require: true,
  // },
  coverImage: {
    type: Buffer,
    require: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    // # Used for filesystem stored files
    // return path.join("/", coverImageBasePath, this.coverImageName);
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

// # Used for filesystem stored files
// bookSchema.virtual("coverImagePath").get(function () {
//   if (this.coverImageName != null) {
//     return path.join("/", coverImageBasePath, this.coverImageName);
//   }
// });

module.exports = mongoose.model("Book", bookSchema);
// # Used for filesystem stored files
// module.exports.coverImageBasePath = coverImageBasePath;
