import { Router } from "express";
import {
  createReview,
  getMyReviews,
  getReviewsByBook,
} from "../controllers/reviewController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/book/:bookId", getReviewsByBook);

router.get(
  "/my",
  authenticateToken,
  getMyReviews
);

router.post(
  "/",
  authenticateToken,
  createReview
);

export default router;