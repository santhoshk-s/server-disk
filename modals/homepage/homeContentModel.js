const mongoose = require("mongoose");

const HomeContentSchema = new mongoose.Schema({
  img: { type: String, required: true }, // Store image URL
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const HomeContent = mongoose.model("HomeContent", HomeContentSchema);
module.exports = HomeContent;
