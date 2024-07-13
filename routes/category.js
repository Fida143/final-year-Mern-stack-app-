import express from "express";
import { isAdmin, requireSingIn } from "../middleware/auth.js";
import {
  CreateCategoryController,
  GetCategoryController,
  UpdateCategoryController,
  GetSingleCategoryController,
  DeleteCategoryController,
} from "../controllers/CategoryController.js";

const router = express.Router();

// Create Category Route

router.post(
  "/create-category",
  requireSingIn,
  isAdmin,
  CreateCategoryController
);

// Update Category Route
router.put(
  "/update-category/:id",
  requireSingIn,
  isAdmin,
  UpdateCategoryController
);

// Get all categories

router.get("/get-category", GetCategoryController);

// Get Single category

router.get("/single-category/:slug", GetSingleCategoryController);
// Get Single category

router.delete(
  "/delete-category/:id",
  requireSingIn,
  isAdmin,
  DeleteCategoryController
);
export default router;
