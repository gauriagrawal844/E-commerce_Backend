const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config(); // Ensure .env variables are loaded

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER_NAME || "e-commerce", // Default folder if not set in .env
    format: async (req, file) => "png", // Convert all images to PNG (optional)
    public_id: (req, file) => Date.now() + "-" + file.originalname.replace(/\s+/g, "_"), // Ensure unique filenames
  },
});

// Create Multer Upload Middleware
const upload = multer({ storage });

module.exports = upload;
