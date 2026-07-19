import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/useAuth";

interface Review {
  id: number;
  bookId: string;
  bookTitle: string;
  bookCover?: string | null;
  reviewText: string;
  rating: number;
  createdAt: string;
}

export default function MyReviewsPage() {
  const { token } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchMyReviews() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest<Review[]>("/reviews/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReviews(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load your reviews."
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (token) {
      void fetchMyReviews();
    }
  }, [token]);

  function startEditing(review: Review) {
    setEditingId(review.id);
    setEditReviewText(review.reviewText);
    setEditRating(review.rating);
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditReviewText("");
    setEditRating(5);
  }

  async function handleUpdate(reviewId: number) {
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    if (editReviewText.trim().length < 5) {
      setError("Review must be at least 5 characters.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const updatedReview = await apiRequest<Review>(
        `/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reviewText: editReviewText.trim(),
            rating: editRating,
          }),
        }
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                reviewText: updatedReview.reviewText,
                rating: updatedReview.rating,
              }
            : review
        )
      );

      cancelEditing();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update the review."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(reviewId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reviewId);
      setError("");

      await apiRequest(`/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete the review."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <section className="reviews-page">
        <h1>My Reviews</h1>
        <p>Loading reviews...</p>
      </section>
    );
  }

  return (
    <section className="reviews-page">
      <div className="reviews-page-header">
        <div>
          <h1>My Reviews</h1>
          <p>Manage the reviews you have written.</p>
        </div>

        <Link to="/search" className="primary-button">
          Find a book
        </Link>
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {reviews.length === 0 ? (
        <div className="empty-reviews">
          <h2>No reviews yet</h2>
          <p>Search for a book and write your first review.</p>

          <Link to="/search" className="primary-button">
            Search books
          </Link>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              {review.bookCover ? (
                <img
                  src={review.bookCover}
                  alt={`Cover of ${review.bookTitle}`}
                  className="review-book-cover"
                />
              ) : (
                <div className="review-cover-placeholder">
                  No cover
                </div>
              )}

              <div className="review-card-content">
                <h2>{review.bookTitle}</h2>

                {editingId === review.id ? (
                  <div className="edit-review-form">
                    <div className="form-group">
                      <label htmlFor={`rating-${review.id}`}>
                        Rating
                      </label>

                      <select
                        id={`rating-${review.id}`}
                        value={editRating}
                        onChange={(event) =>
                          setEditRating(Number(event.target.value))
                        }
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Very good</option>
                        <option value={3}>3 - Good</option>
                        <option value={2}>2 - Fair</option>
                        <option value={1}>1 - Poor</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`review-${review.id}`}>
                        Review
                      </label>

                      <textarea
                        id={`review-${review.id}`}
                        rows={5}
                        value={editReviewText}
                        onChange={(event) =>
                          setEditReviewText(event.target.value)
                        }
                      />
                    </div>

                    <div className="review-actions">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => handleUpdate(review.id)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save changes"}
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={cancelEditing}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="review-rating">
                      Rating: {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </p>

                    <p>{review.reviewText}</p>

                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>

                    <div className="review-actions">
                      <Link
                        to={`/books/${review.bookId}`}
                        className="secondary-button"
                      >
                        View book
                      </Link>

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => startEditing(review)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                      >
                        {deletingId === review.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}