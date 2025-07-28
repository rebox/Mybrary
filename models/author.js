const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("findOneAndDelete", async function (next) {
  console.log("entra en la findOneAndDelete function");
  try {
    const query = this.getFilter();
    const hasBook = await Book.exists({ author: query._id });

    if (hasBook) {
      console.log("entra en hasBook");
      next(new Error("This author still has books."));
    } else {
      console.log("entra en success");
      next();
    }
  } catch (err) {
    console.log("entra en err");
    next(err);
  }

  // Book.find({ author: this.id }, (err, books) => {
  //   console.log("entra en la funcion");

  //   if (err) {
  //     console.log("entra en err");

  //     next(err);
  //   } else if (books.length > 0) {
  //     console.log("entra en length");

  //     next(new Error("This author has books still"));
  //   } else {
  //     console.log("entra en success");

  //     next();
  //   }
  // });
});

module.exports = mongoose.model("Author", authorSchema);
