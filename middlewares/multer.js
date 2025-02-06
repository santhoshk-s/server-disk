const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory for S3 upload

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(file.mimetype);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, JPG, PNG, WEBP) are allowed"), false);
  }
};

const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

module.exports = uploads;
