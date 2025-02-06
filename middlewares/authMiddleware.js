const jwt = require("jsonwebtoken");
const User = require("../modals/userModel.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authorization header is missing, access denied" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Token is missing, authorization denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token is invalid or expired, access forbidden" });
    }

    req.loginUserInfo = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (req.loginUserInfo && req.loginUserInfo.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin." });
  }
};

module.exports = { authenticate, authorizeAdmin };
