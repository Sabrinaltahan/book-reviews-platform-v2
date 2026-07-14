import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBookDetails } from "../api/booksApi";
import type { BookDetails } from "../types/book";

export default function BookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>();

  const [book, setBook] = useState<BookDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBook() {
      if (!bookId) {
        setError("Book ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getBookDetails(bookId);
        setBook(data);
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

    void loadBook();
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
        <p className="error-message" role="alert">
          {error}
        </p>

        <Link to="/search" className="back-link">
          Back to search
        </Link>
      </section>
    );
  }

  if (!book) {
    return (
      <section>
        <p className="status-message">
          Book information is unavailable.
        </p>

        <Link to="/search" className="back-link">
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

  return (
    <section className="book-details-page">
      <Link to="/search" className="back-link">
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
              <strong>First published:</strong>{" "}
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

          {book.subjects && book.subjects.length > 0 && (
            <div className="book-subjects">
              <h2>Subjects</h2>

              <div className="subject-list">
                {book.subjects.slice(0, 12).map((subject) => (
                  <span key={subject} className="subject-tag">
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

        <p>
          No reviews have been added for this book yet.
        </p>

        <p>
          Log in to write a review.
        </p>
      </section>
    </section>
  );
}