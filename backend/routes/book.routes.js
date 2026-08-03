import express from "express";
import {
  addBook,
  deleteBook,
  getAdminBook,
  getAllBooks,
  getBooks,
  updateBook,
} from "../controllers/book.controller.js";
import { adminRoute } from "../middleware/adminRoute.js";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../lib/multer.js";

const router = express.Router();

// Public book routes
router.get("/", getAllBooks);

// Admin book routes
router.get("/admin/all", protectRoute, adminRoute, getAdminBook);
router.post("/", protectRoute, adminRoute, upload.single("image"), addBook);
router.put(
  "/:id",
  protectRoute,
  adminRoute,
  upload.single("image"),
  updateBook
);
router.delete("/:id", protectRoute, adminRoute, deleteBook);

// Keep dynamic ID routes after named routes such as /admin/all.
router.get("/:id", getBooks);

export default router;
