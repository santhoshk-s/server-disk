const HeroContent = require("../modals/homepage/heroContentModel");
const HomeContent = require("../modals/homepage/homeContentModel");
const uploadImageToS3 = require("../middlewares/awsStorage");
const OurPartners = require("../modals/homepage/ourPartnerModel");



// Generic function to handle both models
const handleContentOperation = async (req, res, Model, operation) => {
  try {
    if (operation === "create" || operation === "update") {
      if (!req.file && operation === "create") {
        return res.status(400).json({ message: "No image uploaded" });
      }

      let imageUrl;
      if (req.file) {
        imageUrl = await uploadImageToS3(req.file);
      }

      const { title, description } = req.body;
      let updateData = { title, description };

      if (imageUrl) updateData.img = imageUrl;

      if (operation === "create") {
        const newContent = new Model(updateData);
        await newContent.save();
        return res.status(201).json({
          message: "Content created successfully",
          content: newContent,
        });
      } else if (operation === "update") {
        const { id } = req.params;
        const updatedContent = await Model.findByIdAndUpdate(id, updateData, {
          new: true,
        });
        if (!updatedContent)
          return res.status(404).json({ message: "Content not found" });
        return res.status(200).json({
          message: "Content updated successfully",
          content: updatedContent,
        });
      }
    } else if (operation === "fetch") {
      const content = await Model.find().sort({ createdAt: -1 });
      return res.status(200).json({ message: "Content fetched", content });
    } else if (operation === "delete") {
      const { id } = req.params;
      const deletedContent = await Model.findByIdAndDelete(id);
      if (!deletedContent)
        return res.status(404).json({ message: "Content not found" });
      return res.status(200).json({ message: "Content deleted successfully" });
    }
  } catch (error) {
    console.error("Error processing content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// CRUD Operations for HeroContent
exports.createHeroContent = (req, res) =>
  handleContentOperation(req, res, HeroContent, "create");
exports.getHeroContent = (req, res) =>
  handleContentOperation(req, res, HeroContent, "fetch");
exports.updateHeroContent = (req, res) =>
  handleContentOperation(req, res, HeroContent, "update");
exports.deleteHeroContent = (req, res) =>
  handleContentOperation(req, res, HeroContent, "delete");

// CRUD Operations for HomeContent
exports.createHomeContent = (req, res) =>
  handleContentOperation(req, res, HomeContent, "create");
exports.getHomeContent = (req, res) =>
  handleContentOperation(req, res, HomeContent, "fetch");
exports.updateHomeContent = (req, res) =>
  handleContentOperation(req, res, HomeContent, "update");
exports.deleteHomeContent = (req, res) =>
  handleContentOperation(req, res, HomeContent, "delete");



// Upload a new partner image
exports.createPartner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadImageToS3(req.file);
  }
    const newPartner = new OurPartners({
      image: imageUrl,
    });

    await newPartner.save();
    res
      .status(201)
      .json({
        message: "Partner image uploaded successfully",
        data: newPartner,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading partner image", error: error.message });
  }
};

// Get all partner images
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await OurPartners.find();
    res
      .status(200)
      .json({ message: "Partners fetched successfully", data: partners });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching partners", error: error.message });
  }
};

// Delete a partner image
exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPartner = await OurPartners.findByIdAndDelete(id);

    if (!deletedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting partner", error: error.message });
  }
};