const mongoose = require("mongoose");

const ourVisionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of 3 image URLs
    validate: {
      validator: function (arr) {
        return arr.length === 3; // Ensure exactly 3 images
      },
      message: "You must provide exactly three images.",
    },
    required: true,
  },
});

const OurVision = mongoose.model("OurVision", ourVisionSchema);
module.exports = OurVision;
