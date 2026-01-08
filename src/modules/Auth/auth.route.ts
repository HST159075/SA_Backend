import { Router } from "express";
import { registerUser, getMyUploads } from "./auth.controller";

const router = Router();

router.post("/register", registerUser);
router.get("/my-uploads/:userId", getMyUploads);

export default router;