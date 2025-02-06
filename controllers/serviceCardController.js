const ServiceCard = require('../modals/serviceCardModel');
const uploadImageToS3 = require("../middlewares/awsStorage");


exports.createServiceCard = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const parsedDescription = description ? JSON.parse(description) : null;

    if (
      !heading ||
      !parsedDescription ||
      !parsedDescription.paragraph ||
      !parsedDescription.features ||
      !req.file
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Upload image to AWS S3
    const imageUrl = await uploadImageToS3(req.file);

    if (!imageUrl) {
      return res.status(500).json({ error: "Failed to upload image to S3" });
    }

    // Create new service card with uploaded image URL
    const newServiceCard = new ServiceCard({
      heading,
      description: parsedDescription,
      imageurl: imageUrl,
    });
    await newServiceCard.save();

    res.status(201).json({
      message: `Service card created successfully with heading: ${heading}`,
      newServiceCard,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ServiceCard.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getServiceCard = async (req, res) => {
  try {
    const serviceCard = await ServiceCard.findById(req.params.id);
    if (!serviceCard) {
      return res.status(404).json({ error: 'Service Card not found' });
    }
    res.json(serviceCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllServiceCards = async (req, res) => {
  try {
    const serviceCards = await ServiceCard.find();
    res.status(200).json(serviceCards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service cards', error });
  }
};
exports.updateServiceCard = async (req, res) => {
  const { id } = req.params;
  const { heading, description } = req.body;

  try {
    const parsedDescription = description ? JSON.parse(description) : null;

    if (
      !heading ||
      !parsedDescription ||
      !parsedDescription.paragraph ||
      !parsedDescription.features
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let updateFields = { heading, description: parsedDescription };

    if (req.file) {
      const imageUrl = await uploadImageToS3(req.file);
      if (!imageUrl) {
        return res.status(500).json({ error: "Image upload failed" });
      }
      updateFields.imageurl = imageUrl;
    }

    const updatedCard = await ServiceCard.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!updatedCard) {
      return res.status(404).json({ message: "Service card not found" });
    }
    res.status(200).json({
      message: `Service card updated successfully with heading: ${updatedCard.heading}`,
      updatedCard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.deleteServiceCard = async (req,res) => {
  try {
    const { id } = req.params;
    await ServiceCard.findByIdAndDelete(id)
    res.status(200).json({
      message: `service card deleted`,
    });

  } catch (error) {
   return res.status(500).json({ message: 'Server error', error });
  }
}
