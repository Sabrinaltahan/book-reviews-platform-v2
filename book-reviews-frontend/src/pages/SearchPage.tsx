import { useState, type FormEvent } from "react";
import { searchBooks } from "../api/booksApi";
import BookList from "../components/books/BookList";
import type { Book } from "../types/book";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setError("Please enter a book title or author.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setHasSearched(true);

      const results = await searchBooks(query);
      setBooks(results);
    } catch (err) {
      setBooks([]);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <div className="search-header">
        <h1>Search Books</h1>
        <p>
          Search by book title, author, subject or ISBN.
        </p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="book-search">
          Search for a book
        </label>

        <div className="search-controls">
          <input
            id="book-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="For example: Harry Potter"
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {isLoading && (
        <p className="status-message">
          Loading books...
        </p>
      )}

      {!isLoading && hasSearched && !error && books.length === 0 && (
        <p className="status-message">
          No books were found.
        </p>
      )}

      {!isLoading && books.length > 0 && (
        <>
          <p className="results-count">
            Showing {books.length} results
          </p>

          <BookList books={books} />
        </>
      )}
    </section>
  );
}