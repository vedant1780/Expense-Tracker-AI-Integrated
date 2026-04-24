import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  monthlyIncome: Number,
  savingsGoal: Number
});

export default mongoose.model("User", userSchema);