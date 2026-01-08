import { Router } from "express";
import { getSystemStats, getAllFiles } from "./admin.controller.js";

const router = Router();

router.get("/stats", getSystemStats);
router.get("/all-files", getAllFiles);

export default router;