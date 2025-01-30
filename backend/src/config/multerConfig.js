// src/config/multerConfig.js

const multer = require("multer");
const path = require("path");

// Define where the files will be stored and the filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter file types (e.g., .png, .jpg for profile picture, .pdf for CV)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePicture" || file.fieldname === "logo") {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      return cb(null, true);
    }
    return cb(
      new Error(
        "Only .png, .jpg, and .jpeg files are allowed for profile picture."
      ),
      false
    );
  } else if (file.fieldname === "cv") {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }
    return cb(new Error("Only PDF files are allowed for CV."), false);
  }
  return cb(new Error("Invalid file field."), false);
};

// Set up multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
