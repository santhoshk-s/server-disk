const mongoose = require("mongoose");

const HeroContentSchema = new mongoose.Schema({
  img: { type: String, required: true }, // Store image URL
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const HeroContent = mongoose.model("HeroContent", HeroContentSchema);
module.exports = HeroContent;
