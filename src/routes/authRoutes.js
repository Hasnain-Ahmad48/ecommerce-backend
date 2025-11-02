import express from "express";
const router = express.Router();
import {register, login, getProfile} from "../controllers/authController.js";
import {protect} from "../middleware/authMiddleware.js";
import multer from "multer";
import {storage} from "../utils/cloudinaryConfig.js";

const upload = multer({storage});

// register with profile picture upload (field name 'profilePic')
router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.get("/profile", protect, getProfile);

export default router;
