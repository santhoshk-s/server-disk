const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const uploads = require("../middlewares/multer");
const {
  createAboutHeroContent,
  getAboutHeroContent,
  updateAboutHeroContent,
  deleteAboutHeroContent,
  createVision,
  updateVision,
  getOurVisionContent,
  deleteOurVisionContent,
  createOurExpertiseContent,
  getOurExpertiseContent,
  updateOurExpertiseContent,
  deleteOurExpertiseContent,
  createSpecialization,
  getWeSpecialize,
  updateSpecialization,
  deleteSpecialization,
} = require("../controllers/aboutController");

// ABOUT Content Routes
router.post(
  "/about-hero-content",
  upload.single("img"),
  createAboutHeroContent
);
router.get("/about-hero-content", getAboutHeroContent);
router.put(
  "/about-hero-content/:id",
  upload.single("img"),
  updateAboutHeroContent
);
router.delete("/about-hero-content/:id", deleteAboutHeroContent);

//our expertise routes
router.post(
  "/our-expertise",
  upload.single("img"),
  createOurExpertiseContent
);
router.get("/our-expertise", getOurExpertiseContent);
router.put(
  "/our-expertise/:id",
  upload.single("img"),
  updateOurExpertiseContent
);
router.delete("/our-expertise/:id", deleteOurExpertiseContent);

//vision routes
router.post("/create-vision", uploads.array("images", 3), createVision);
router.put("/update-vision/:id", uploads.array("images", 3), updateVision);
router.get("/our-vision", getOurVisionContent);
router.delete("/our-vision/:id", deleteOurVisionContent);

//specialization routes
router.post("/we-specialize", upload.single("img"), createSpecialization);
router.get("/we-specialize", getWeSpecialize);
router.put(
  "/we-specialize/:id",
  upload.single("img"),
  updateSpecialization
);
router.delete("/we-specialize/:id", deleteSpecialization);


module.exports = router;
