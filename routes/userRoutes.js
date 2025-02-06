const express = require("express");
const { 
  getLoggedInUser, 
  createUser, 
  loginUser, 
  logoutCurrentUser, 
  getUserInfo 
} = require("../controllers/userController");

const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// User registration
router.post("/register", createUser);

// Get logged-in user profile
router.get("/profile", authenticate, getLoggedInUser);

// User authentication (Login)
router.post("/auth", loginUser);

// User logout
router.post("/logout", logoutCurrentUser);

// Get user info (requires authentication)
router.get("/get-user-info", authenticate, getUserInfo);

module.exports = router;
