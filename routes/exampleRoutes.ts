import express from "express";
import {
  exampleDelete,
  exampleGetAll,
  exampleGetById,
  examplePost,
  exampleUpdate,
  exampleSoftDelete,
  exampleRestoreSoftDelete,
} from "../controllers/exampleHandler";

const router = express.Router();

router.get("/post", exampleGetAll);
router.post("/post", examplePost);
router.get("/post/:id", exampleGetById);
router.put("/post/:id", exampleUpdate);
router.delete("/post/perma_delete/:id", exampleDelete);
router.delete("/post/delete/:id", exampleSoftDelete);
router.put("/post/restore/:id", exampleRestoreSoftDelete);

export default router;
