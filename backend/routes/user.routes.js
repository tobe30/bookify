import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { adminRoute } from "../middleware/adminRoute.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/admin/all", protectRoute, adminRoute, getAllUsers);

export default router;
