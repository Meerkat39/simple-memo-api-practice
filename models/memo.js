const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memo", memoSchema);
