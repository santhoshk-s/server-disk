const mongoose = require("mongoose");

const AboutHeroSchema = new mongoose.Schema({
  img: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: [String], required: true },
});
const AboutHero = mongoose.model("AboutHero", AboutHeroSchema);
module.exports = AboutHero;