import express from "express";
import { login, register, logout } from "../controllers/authHandler";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.delete("/logout", logout);

export default router;
