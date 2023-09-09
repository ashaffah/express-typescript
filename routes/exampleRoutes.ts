import express from "express";
import {
  exampleDelete,
  exampleGetAll,
  exampleGetById,
  examplePost,
  exampleUpdate,
} from "../controllers/exampleHandler";

const router = express.Router();

router.get("/post", exampleGetAll);
router.post("/post", examplePost);
router.get("/post/:id", exampleGetById);
router.put("/post/:id", exampleUpdate);
router.delete("/post/:id", exampleDelete);

export default router;
