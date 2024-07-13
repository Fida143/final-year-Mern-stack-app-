import express from "express";
import { isAdmin, requireSingIn } from "../middleware/auth.js";
import {
  CreateProductController,
  getProductController,
  getSingleProductController,
  getProductPhotoController,
  deleteProductContrller,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/ProductController.js";
import formidable from "express-formidable";

const router = express.Router();

// Create-Product Route
router.post(
  "/create-product",
  requireSingIn,
  isAdmin,
  formidable(),
  CreateProductController
);

// Update-Product Route
router.put(
  "/update-product/:pid",
  requireSingIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Get-Product Route
router.get("/get-product", getProductController);

// Get Single Product Route
router.get("/get-product/:slug", getSingleProductController);

// Get photo Route
router.get("/product-photo/:pid", getProductPhotoController);

// Delete Product
router.delete("/delete-product/:pid", deleteProductContrller);

// Filter products

router.post("/product-filters", productFiltersController);

// Product Count

router.get("/product-count", productCountController);

// Product Per Page

router.get("/product-list/:page", productListController);

//  search Product

router.get("/search/:keyword", searchProductController);

// Related Products

router.get("/related-product/:pid/:cid", relatedProductController);

// Payments Routes

// token

router.get("/braintree/token", braintreeTokenController);

// payments
router.post("/braintree/payment", requireSingIn, braintreePaymentController);
export default router;
