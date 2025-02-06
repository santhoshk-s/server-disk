const express = require("express");
const multer = require("multer");
const {
  createHeroContent,
  getHeroContent,
  updateHeroContent,
  deleteHeroContent,
  createHomeContent,
  getHomeContent,
  updateHomeContent,
  deleteHomeContent,
  createPartner,
  getAllPartners,
  deletePartner,
} = require("../controllers/homeController");

const router = express.Router();
const upload = multer();

// Hero Content Routes
router.post("/hero-content", upload.single("img"), createHeroContent);
router.get("/hero-content", getHeroContent);
router.put("/hero-content/:id", upload.single("img"), updateHeroContent);
router.delete("/hero-content/:id", deleteHeroContent);

// Home Content Routes
router.post("/home-content", upload.single("img"), createHomeContent);
router.get("/home-content", getHomeContent);
router.put("/home-content/:id", upload.single("img"), updateHomeContent);
router.delete("/home-content/:id", deleteHomeContent);

router.post("/our-partner", upload.single("img"), createPartner);
router.get("/our-partner", getAllPartners);
router.delete("/our-partner/:id", deletePartner);

module.exports = router;
