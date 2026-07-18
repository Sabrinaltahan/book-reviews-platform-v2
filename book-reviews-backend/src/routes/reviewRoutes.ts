import { Router } from "express";
import {
  createReview,
  deleteReview,
  getMyReviews,
  getReviewsByBook,
  updateReview,
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

router.put(
  "/:reviewId",
  authenticateToken,
  updateReview
);

router.delete(
  "/:reviewId",
  authenticateToken,
  deleteReview
);

export default router;