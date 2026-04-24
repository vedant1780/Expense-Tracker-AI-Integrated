import express from "express";
import { chat } from "../controller/chatController.js"

const router = express.Router();

router.post("/", chat);

export default router;