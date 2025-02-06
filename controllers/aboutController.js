const AboutHero = require("../modals/about/aboutHeroModel");
const OurVision = require("../modals/about/ourVisionModel");
const OurExpertise = require("../modals/about/ourExpertise");
const WeSpecialize = require("../modals/about/weSpecialize"); 
const {DeleteObjectCommand } = require("@aws-sdk/client-s3");
const process = require("process");
const uploadImageToS3 = require("../middlewares/awsStorage");
const { S3Client } = require("@aws-sdk/client-s3");


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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
        return res
          .status(201)
          .json({
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
        return res
          .status(200)
          .json({
            message: "Content updated successfully",
            content: updatedContent,
          });
      }
    } else if (operation === "fetch") {
      const content = await Model.find();
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
exports.createAboutHeroContent = (req, res) =>
  handleContentOperation(req, res, AboutHero, "create");
exports.getAboutHeroContent = (req, res) =>
  handleContentOperation(req, res, AboutHero, "fetch");
exports.updateAboutHeroContent = (req, res) =>
  handleContentOperation(req, res, AboutHero, "update");
exports.deleteAboutHeroContent = (req, res) =>
  handleContentOperation(req, res, AboutHero, "delete");

exports.createOurExpertiseContent = (req, res) =>
  handleContentOperation(req, res, OurExpertise, "create");
exports.getOurExpertiseContent = (req, res) =>
  handleContentOperation(req, res, OurExpertise, "fetch");
exports.updateOurExpertiseContent = (req, res) =>
  handleContentOperation(req, res, OurExpertise, "update");
exports.deleteOurExpertiseContent = (req, res) =>
  handleContentOperation(req, res, OurExpertise, "delete");


// Create Vision Entry
exports.createVision = async (req, res) => {
  try {
    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({ message: "Exactly three images are required." });
    }

    // Upload images to S3
    const imageUrls = await Promise.all(req.files.map(file => uploadImageToS3(file)));

    const newVision = new OurVision({
      title: req.body.title,
      description: req.body.description,
      images: imageUrls,
    });

    await newVision.save();
    res.status(201).json({ message: "Vision created successfully!", data: newVision });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Vision Entry
exports.updateVision = async (req, res) => {
  try {
    const { id } = req.params;
    const vision = await OurVision.findById(id);

    if (!vision) {
      return res.status(404).json({ message: "Vision entry not found." });
    }

    let imageUrls = vision.images;

    // If new images are uploaded, replace old ones
    if (req.files && req.files.length === 3) {
      imageUrls = await Promise.all(req.files.map(file => uploadImageToS3(file)));
    }

    vision.title = req.body.title || vision.title;
    vision.description = req.body.description || vision.description;
    vision.images = imageUrls;

    await vision.save();
    res.status(200).json({ message: "Vision updated successfully!", data: vision });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get vision content
exports.getOurVisionContent = async (req, res) => {
  try {
    const content = await OurVision.find();
    res.status(200).json(content);
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ message: "Server error while fetching content." });
  }
};

// 📌 Delete Our Vision Content
exports.deleteOurVisionContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await OurVision.findById(id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Delete images from S3
    const deleteImages = content.images.map((imageUrl) => {
      const fileKey = imageUrl.split(".amazonaws.com/")[1]; // Extract S3 file key
      return s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey,
        })
      );
    });
    await Promise.all(deleteImages);

    // Remove from DB
    await OurVision.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Our Vision content deleted successfully!" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error while deleting content." });
  }
};

//get specialization content
exports.getWeSpecialize = async (req, res) => {
  try {
    const specializations = await WeSpecialize.find();
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create WeSpecialize Entry
exports.createSpecialization = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "One image is required." });
    }

    // Upload image to S3
    const imageUrl = await uploadImageToS3(req.file);

    const newSpecialization = new WeSpecialize({
      title: req.body.title,
      points: req.body.points ? JSON.parse(req.body.points) : [],
      img: imageUrl,
    });

    await newSpecialization.save();
    res.status(201).json({ message: "Specialization created successfully!", data: newSpecialization });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update WeSpecialize Entry
exports.updateSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    const specialization = await WeSpecialize.findById(id);

    if (!specialization) {
      return res.status(404).json({ message: "Specialization entry not found." });
    }

    let imageUrl = specialization.img;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      imageUrl = await uploadImageToS3(req.file);
    }

    specialization.title = req.body.title || specialization.title;
    specialization.points = req.body.points ? JSON.parse(req.body.points) : specialization.points;
    specialization.img = imageUrl;

    await specialization.save();
    res.status(200).json({ message: "Specialization updated successfully!", data: specialization });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete a specialization by ID
exports.deleteSpecialization = async (req, res) => {
  try {
    const deletedSpecialization = await WeSpecialize.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSpecialization)
      return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
