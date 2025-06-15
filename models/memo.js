const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema({
  title: String,
  content: String,
  // date: Date,
});

module.exports = mongoose.model("Memo", memoSchema);
