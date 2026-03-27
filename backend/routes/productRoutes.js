import express from "express";
import {
  createProduct,
  getDashboardData,
  getProductById,
  getProducts,
  getProductSummary,
  viewProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/dashboard", getDashboardData);
router.get("/", getProducts);
router.get("/summary", getProductSummary);
router.post("/:id/view", viewProduct);
router.get("/:id", getProductById);
router.post("/", createProduct);

export default router;
