import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

// ✅ Register
export const registerUser = async (req, res) => {
  const { name, email, password, monthlyIncome, savingsGoal } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    monthlyIncome,
    savingsGoal
  });

  res.json({
    _id: user._id,
    email: user.email,
    token: generateToken(user._id)
  });
};

// ✅ Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};