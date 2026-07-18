
import { Router } from "express";
import {
  createReview,
  getReviewsByBook,
} from "../controllers/reviewController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/book/:bookId", getReviewsByBook);

router.post(
  "/",
  authenticateToken,
  createReview
);

export default router;