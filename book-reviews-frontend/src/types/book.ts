export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  language?: string[];
  subject?: string[];
  isbn?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: Book[];
}