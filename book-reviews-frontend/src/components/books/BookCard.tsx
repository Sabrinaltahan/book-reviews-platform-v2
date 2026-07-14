import { Link } from "react-router-dom";
import type { Book } from "../../types/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({
  book,
}: BookCardProps) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const workId = book.key.replace("/works/", "");

  return (
    <article className="book-card">
      <div className="book-image-container">
        {coverUrl ? (
          <img
            className="book-image"
            src={coverUrl}
            alt={`Cover of ${book.title}`}
          />
        ) : (
          <div className="book-image-placeholder">
            No cover
          </div>
        )}
      </div>

      <div className="book-card-content">
        <h2>{book.title}</h2>

        <p>
          <strong>Author:</strong>{" "}
          {book.author_name?.join(", ") ??
            "Unknown author"}
        </p>

        <p>
          <strong>First published:</strong>{" "}
          {book.first_publish_year ?? "Unknown"}
        </p>

        <p>
          <strong>Editions:</strong>{" "}
          {book.edition_count ?? "Unknown"}
        </p>

        <Link
          className="details-link"
          to={`/books/${workId}`}
        >
          View details
        </Link>
      </div>
    </article>
  );
}