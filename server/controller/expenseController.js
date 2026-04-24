import Expense from "../models/expense.model.js";

// TEMP userId (replace later with req.user.id)
const USER_ID = "661f1b2c9a1234567890abcd";


export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: USER_ID
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: USER_ID });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import mongoose from "mongoose";

export const getSpendByCategory = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(USER_ID)
        }
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSpent: 1
        }
      },
      {
        $sort: { totalSpent: -1 }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};