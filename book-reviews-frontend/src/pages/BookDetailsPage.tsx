import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import { getBookDetails } from "../api/booksApi";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/useAuth";
import type { BookDetails } from "../types/book";

interface ReviewUser {
  id: number;
  name: string;
}

interface Review {
  id: number;
  bookId: string;
  bookTitle: string;
  bookCover?: string | null;
  reviewText: string;
  rating: number;
  createdAt: string;
  user?: ReviewUser;
}

export default function BookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const {
    token,
    user,
    isAuthenticated,
  } = useAuth();

  const [book, setBook] =
    useState<BookDetails | null>(null);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [reviewError, setReviewError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    async function loadPageData() {
      if (!bookId) {
        setError("Book ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [bookData, reviewsData] =
          await Promise.all([
            getBookDetails(bookId),
            apiRequest<Review[]>(
              `/reviews/book/${bookId}`
            ),
          ]);

        setBook(bookData);
        setReviews(reviewsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPageData();
  }, [bookId]);

  if (isLoading) {
    return (
      <p className="status-message">
        Loading book details...
      </p>
    );
  }

  if (error) {
    return (
      <section>
        <p
          className="error-message"
          role="alert"
        >
          {error}
        </p>

        <Link
          to="/search"
          className="back-link"
        >
          Back to search
        </Link>
      </section>
    );
  }

  if (!book || !bookId) {
    return (
      <section>
        <p className="status-message">
          Book information is unavailable.
        </p>

        <Link
          to="/search"
          className="back-link"
        >
          Back to search
        </Link>
      </section>
    );
  }

  const description =
    typeof book.description === "string"
      ? book.description
      : book.description?.value;

  const coverId = book.covers?.[0];

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  const currentUserReview = reviews.find(
    (review) => review.user?.id === user?.id
  );

  async function handleSubmitReview(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setReviewError("");
    setSuccessMessage("");

    if (!token) {
      setReviewError(
        "You must log in to write a review."
      );
      return;
    }

    if (reviewText.trim().length < 5) {
      setReviewError(
        "Review must be at least 5 characters."
      );
      return;
    }

    if (rating < 1 || rating > 5) {
      setReviewError(
        "Rating must be between 1 and 5."
      );
      return;
    }

if (!book) {
  setReviewError("Book information is not available.");
  return;
}


    try {
      setIsSubmitting(true);

      const newReview =
        await apiRequest<Review>(
          "/reviews",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              bookId,
              bookTitle: book.title,
              bookCover: coverUrl,
              reviewText:
                reviewText.trim(),
              rating,
            }),
          }
        );

      setReviews((currentReviews) => [
        newReview,
        ...currentReviews,
      ]);

      setReviewText("");
      setRating(5);

      setSuccessMessage(
        "Your review was added successfully."
      );
    } catch (err) {
      setReviewError(
        err instanceof Error
          ? err.message
          : "Could not add the review."
      );
    } finally {
      setIsSubmitting(false);
    }
  }


  if (isLoading) {
  return <p>Loading book...</p>;
}

if (error) {
  return <p>{error}</p>;
}

if (!book) {
  return <p>Book not found.</p>;
}


  return (
    <section className="book-details-page">
      <Link
        to="/search"
        className="back-link"
      >
        ← Back to search
      </Link>

      <div className="book-details">
        <div className="book-details-cover">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={`Cover of ${book.title}`}
            />
          ) : (
            <div className="details-cover-placeholder">
              No cover available
            </div>
          )}
        </div>

        <div className="book-details-content">
          <h1>{book.title}</h1>

          {book.first_publish_date && (
            <p>
              <strong>
                First published:
              </strong>{" "}
              {book.first_publish_date}
            </p>
          )}

          <div className="book-description">
            <h2>Description</h2>

            <p>
              {description ??
                "No description is available for this book."}
            </p>
          </div>

          {book.subjects &&
            book.subjects.length > 0 && (
              <div className="book-subjects">
                <h2>Subjects</h2>

                <div className="subject-list">
                  {book.subjects
                    .slice(0, 12)
                    .map((subject) => (
                      <span
                        key={subject}
                        className="subject-tag"
                      >
                        {subject}
                      </span>
                    ))}
                </div>
              </div>
            )}
        </div>
      </div>

      <section className="reviews-section">
        <h2>User Reviews</h2>

        {isAuthenticated ? (
          currentUserReview ? (
            <div className="existing-review-message">
              <p>
                You have already reviewed this
                book.
              </p>

              <Link
                to="/my-reviews"
                className="secondary-button"
              >
                Manage my review
              </Link>
            </div>
          ) : (
            <form
              className="review-form"
              onSubmit={
                handleSubmitReview
              }
            >
              <h3>Write a review</h3>

              {reviewError && (
                <p
                  className="error-message"
                  role="alert"
                >
                  {reviewError}
                </p>
              )}

              {successMessage && (
                <p
                  className="success-message"
                  role="status"
                >
                  {successMessage}
                </p>
              )}

              <div className="form-group">
                <label htmlFor="rating">
                  Rating
                </label>

                <select
                  id="rating"
                  value={rating}
                  onChange={(event) =>
                    setRating(
                      Number(
                        event.target.value
                      )
                    )
                  }
                >
                  <option value={5}>
                    5 - Excellent
                  </option>
                  <option value={4}>
                    4 - Very good
                  </option>
                  <option value={3}>
                    3 - Good
                  </option>
                  <option value={2}>
                    2 - Fair
                  </option>
                  <option value={1}>
                    1 - Poor
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="review-text">
                  Review
                </label>

                <textarea
                  id="review-text"
                  rows={5}
                  value={reviewText}
                  onChange={(event) =>
                    setReviewText(
                      event.target.value
                    )
                  }
                  placeholder="Write your opinion about this book..."
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit review"}
              </button>
            </form>
          )
        ) : (
          <p>
            <Link to="/login">
              Log in
            </Link>{" "}
            to write a review.
          </p>
        )}

        <div className="book-reviews-list">
          {reviews.length === 0 ? (
            <p>
              No reviews have been added for
              this book yet.
            </p>
          ) : (
            reviews.map((review) => (
              <article
                className="book-review-card"
                key={review.id}
              >
                <div className="book-review-header">
                  <strong>
                    {review.user?.name ??
                      "Anonymous user"}
                  </strong>

                  <span className="review-rating">
                    {"★".repeat(
                      review.rating
                    )}
                    {"☆".repeat(
                      5 - review.rating
                    )}
                  </span>
                </div>

                <p>{review.reviewText}</p>

                <small>
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </small>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}