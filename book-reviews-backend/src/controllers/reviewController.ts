import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/authMiddleware";

export async function getReviewsByBook(
  req: Request<{ bookId: string }>,
  res: Response
) {
  try {
    const { bookId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        bookId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      message: "Could not fetch reviews.",
    });
  }
}

export async function createReview(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    const {
      bookId,
      bookTitle,
      bookCover,
      reviewText,
      rating,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication is required.",
      });
    }

    if (
      !bookId ||
      !bookTitle ||
      !reviewText ||
      rating === undefined
    ) {
      return res.status(400).json({
        message:
          "Book ID, book title, review text and rating are required.",
      });
    }

    if (
      typeof bookId !== "string" ||
      typeof bookTitle !== "string" ||
      typeof reviewText !== "string"
    ) {
      return res.status(400).json({
        message: "Review data is invalid.",
      });
    }

    if (reviewText.trim().length < 10) {
      return res.status(400).json({
        message: "Review text must be at least 10 characters.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5.",
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: bookId.trim(),
        },
      },
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this book.",
      });
    }

    const review = await prisma.review.create({
      data: {
        bookId: bookId.trim(),
        bookTitle: bookTitle.trim(),
        bookCover:
          typeof bookCover === "string" && bookCover.trim()
            ? bookCover.trim()
            : null,
        reviewText: reviewText.trim(),
        rating: numericRating,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Review created successfully.",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      message: "Could not create review.",
    });
  }
}

export async function getMyReviews(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication is required.",
      });
    }

    const reviews = await prisma.review.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Get my reviews error:", error);

    return res.status(500).json({
      message: "Could not fetch your reviews.",
    });
  }
}

export async function updateReview(
  req: AuthenticatedRequest & {
    params: {
      reviewId: string;
    };
  },
  res: Response
) {
  try {
    const userId = req.userId;
    const reviewId = Number(req.params.reviewId);
    const { reviewText, rating } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication is required.",
      });
    }

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        message: "Invalid review ID.",
      });
    }

    if (
      typeof reviewText !== "string" ||
      reviewText.trim().length < 10
    ) {
      return res.status(400).json({
        message: "Review text must be at least 10 characters.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5.",
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({
        message: "You can only edit your own reviews.",
      });
    }

    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        reviewText: reviewText.trim(),
        rating: numericRating,
      },
    });

    return res.status(200).json({
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      message: "Could not update review.",
    });
  }
}

export async function deleteReview(
  req: AuthenticatedRequest & {
    params: {
      reviewId: string;
    };
  },
  res: Response
) {
  try {
    const userId = req.userId;
    const reviewId = Number(req.params.reviewId);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication is required.",
      });
    }

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        message: "Invalid review ID.",
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({
        message: "You can only delete your own reviews.",
      });
    }

    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      message: "Could not delete review.",
    });
  }
}