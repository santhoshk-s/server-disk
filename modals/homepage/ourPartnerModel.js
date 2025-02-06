const mongoose = require("mongoose");

const ourPartnersSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OurPartners = mongoose.model("OurPartners", ourPartnersSchema);
module.exports = OurPartners;
