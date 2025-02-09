const express = require("express");
const ProductController = require("../controllers/product.controller");
const upload = require("../config/cloudinary");
const authMiddleware = require("../middleware/Auth");

const router = express.Router();

// Use upload middleware for multiple image fields
router.post(
  "/create",authMiddleware,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  ProductController.create
);

router.get("/get/:id", ProductController.get);
router.get("/all", ProductController.all);
router.delete("/delete/:id",authMiddleware, ProductController.delete);

module.exports = router;
