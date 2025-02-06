const mongoose = require("mongoose");

const WeSpecializeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String, // Store image URL or path
    required: true,
  },
  points: {
    type: [String], // Array of bullet points
    required: true,
  },
});

const WeSpecialize = mongoose.model("WeSpecialize", WeSpecializeSchema);
module.exports = WeSpecialize;
