// app.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js"
import insightRoutes from "./routes/insightRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));
console.log("API:",process.env.OPENAI_API_KEY)
app.listen(process.env.PORT, () => console.log("Server running"));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);


app.use("/api/insights", insightRoutes);


app.use("/api/chat", chatRoutes);