import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  getSpendByCategory
} from "../controller/expenseController.js"

const router = express.Router();

router.post("/", addExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);
router.get("/category",getSpendByCategory)

export default router;