import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { adminRoute } from "../middleware/adminRoute.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Logged-in user order routes
router.post("/", protectRoute, createOrder);
router.get("/my-orders", protectRoute, getUserOrders);

// Admin order routes
router.get("/admin/all", protectRoute, adminRoute, getAllOrders);
router.patch(
  "/:orderId/status",
  protectRoute,
  adminRoute,
  updateOrderStatus
);

export default router;
