const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public GET
router.get("/", productController.getProductPage);

router.post(
  "/items",
  //   authMiddleware,
  //   adminMiddleware,
  productController.uploadProductImageMiddleware,
  productController.addProjectToProjectPage
);

router.patch(
  "/items/:itemId",
  //   authMiddleware,
  //   adminMiddleware,
  productController.uploadProductImageMiddleware,
  productController.updateProjectPageImage
);

router.delete(
  "/items/:itemId",
  //   authMiddleware,
  //   adminMiddleware,
  productController.deleteProjectPageImage
);

module.exports = router;
