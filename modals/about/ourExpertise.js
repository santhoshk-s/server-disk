const mongoose = require("mongoose");

const OurExpertiseSchema = new mongoose.Schema({
  img: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: [String], required: true },
});
const OurExpertise = mongoose.model("OurExpertise", OurExpertiseSchema);
module.exports = OurExpertise;