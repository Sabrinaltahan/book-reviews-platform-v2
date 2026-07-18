import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/prisma";
import authRoutes from "./routes/authRoutes";
import reviewRoutes from "./routes/reviewRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Book Reviews API is running",
  });
});

app.get("/api/test-database", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();
    const reviewCount = await prisma.review.count();

    res.json({
      message: "Database connection is working",
      users: userCount,
      reviews: reviewCount,
    });
  } catch (error) {
    console.error("Database test failed:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});