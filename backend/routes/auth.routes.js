import express from "express"
import { Login, Logout, Register } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.post("/register", Register)
router.post("/login", Login)
router.post("/logout", Logout)


//Router to get currently logged-in user
router.get("/me", protectRoute, (req, res)=>{
    res.status(200).json({ success: true, user: req.user});
})



export default router