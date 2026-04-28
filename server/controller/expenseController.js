import Expense from "../models/expense.model.js";
import User from "../models/user.model.js";
// TEMP userId (replace later with req.user.id)



export const addExpense = async (req, res) => {
  const USER_ID = req.user?.id;
  console.log(USER_ID)
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
    const USER_ID = req.user?.id;
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
  const USER_ID = req.user?.id;
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
//import User from "../models/User.js";

export const onboardingData = async (req, res) => {
  try {
    const userId = req.user.id;

    const { monthlyIncome, savingsGoal } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        monthlyIncome,
        savingsGoal,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Onboarding saved",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};