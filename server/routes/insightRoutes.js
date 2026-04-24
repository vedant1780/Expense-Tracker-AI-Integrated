import express from "express";
import { getInsights } from "../controller/insightController.js";

const router = express.Router();

router.get("/", getInsights);

export default router;