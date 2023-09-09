import express from "express";
import { createUser, getUserByUsername } from "../controllers/userHaandler";

const router = express.Router();

router.get("/:username", getUserByUsername);
router.post("/create", createUser);

export default router;
