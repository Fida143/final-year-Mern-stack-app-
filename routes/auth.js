import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { requireSingIn, isAdmin } from "../middleware/auth.js";

// router object
const router = express.Router();

// routing

// Register  || method POST
router.post("/register", registerController);

// Login   || method POST
router.post("/login", loginController);

// Forgot Password ||method POST
router.post("/forgot-password", forgotPasswordController);

// test route   || method POST
router.get("/test", requireSingIn, isAdmin, testController);

// Protected User-route-Auth
router.get("/user-auth", requireSingIn, (req, res) => {
  res.status(200).send({ ok: true });
});
// Protected Admin-route-Auth
router.get("/admin-auth", requireSingIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Update Profile

router.put("/profile", requireSingIn, updateProfileController);

// orders

router.get("/orders", requireSingIn, getOrdersController);

// all Orders
router.get("/all-orders", requireSingIn, isAdmin, getAllOrdersController);

//  order status update

router.put(
  "/order-status/:orderId",
  requireSingIn,
  isAdmin,
  orderStatusController
);
export default router;
