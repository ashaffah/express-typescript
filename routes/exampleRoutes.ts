import express from "express";
import {
  exampleDelete,
  exampleGetAll,
  exampleGetById,
  examplePost,
  exampleUpdate,
  exampleSoftDelete,
  exampleRestoreSoftDelete,
  exampleRestoreAllSoftDelete,
  exampleGetAllSoftDelete,
  exampleGetDeletedById,
} from "../controllers/exampleHandler";

const router = express.Router();

router.get("/post", exampleGetAll); // Get All Data
router.post("/post", examplePost); // Create Data
router.get("/post/:id", exampleGetById); // Get Dada By Id
router.put("/post/:id", exampleUpdate); // Update Data By Id
router.delete("/post/perma_delete/:id", exampleDelete); // Hard Delete Data
router.delete("/post/delete/:id", exampleSoftDelete); // Soft Delete Data
router.patch("/post/restore_all", exampleRestoreAllSoftDelete); // Restore All Data
router.put("/post/restore/:id", exampleRestoreSoftDelete); // Restore Data By Id
router.get("/deleted", exampleGetAllSoftDelete); // Get All Soft Deleted
router.get("/deleted/:id", exampleGetDeletedById); // Get Soft Deleted By Id

export default router;
