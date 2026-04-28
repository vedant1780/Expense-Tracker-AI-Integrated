import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  getSpendByCategory,
  onboardingData
} from "../controller/expenseController.js"
import {authMiddleware} from "../middlewares/authMiddleware.js"
const router = express.Router();

router.post("/",authMiddleware, addExpense);
router.get("/", authMiddleware,getExpenses);
router.delete("/:id",authMiddleware, deleteExpense);
router.get("/category",authMiddleware,getSpendByCategory);
router.post("/onboarding", authMiddleware,onboardingData);

export default router;