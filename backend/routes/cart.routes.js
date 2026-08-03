import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeItemFromCart,
  updateCartQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:bookId", updateCartQuantity);
router.delete("/:bookId", removeItemFromCart);
router.delete("/", clearCart);

export default router;
