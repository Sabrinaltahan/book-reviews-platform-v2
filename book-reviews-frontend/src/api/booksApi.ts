import type {
  Book,
  BookDetails,
  OpenLibrarySearchResponse,
} from "../types/book";

const OPEN_LIBRARY_SEARCH_URL =
  "https://openlibrary.org/search.json";

export async function searchBooks(
  query: string
): Promise<Book[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmedQuery,
    limit: "20",
    fields:
      "key,title,author_name,first_publish_year,cover_i,edition_count,language,subject,isbn",
  });

  const response = await fetch(
    `${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Could not fetch books. Server returned ${response.status}.`
    );
  }

  const data: OpenLibrarySearchResponse =
    await response.json();

  return data.docs ?? [];
}

export async function getBookDetails(
  workId: string
): Promise<BookDetails> {
  const response = await fetch(
    `https://openlibrary.org/works/${encodeURIComponent(workId)}.json`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Book not found.");
    }

    throw new Error(
      `Could not fetch book details. Server returned ${response.status}.`
    );
  }

  const data: BookDetails = await response.json();

  return data;
}