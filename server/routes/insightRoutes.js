import express from "express";
import { getInsights } from "../controller/insightController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/", authMiddleware,getInsights);

export default router;