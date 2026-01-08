import { Router } from "express";
import { uploadContent, getFileByCode } from "./file.controller.js";
import { upload } from "../../lib/cloudinary.js";

const router = Router();

router.post("/upload", upload.single('file'), uploadContent);
router.get("/:code", getFileByCode); // /api/files/123456 এভাবে কল হবে


export default router;