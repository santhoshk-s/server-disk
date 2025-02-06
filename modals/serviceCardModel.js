const mongoose = require("mongoose");

const serviceCardSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    description: {
      paragraph: { type: String },
      features: [{ type: String }],
      listType: { type: String},
    },
    imageurl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceCard = mongoose.model("ServiceCard", serviceCardSchema);

module.exports = ServiceCard;
