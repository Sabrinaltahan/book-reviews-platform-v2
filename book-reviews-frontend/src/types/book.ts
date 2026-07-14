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


export interface OpenLibraryDescription {
  type?: string;
  value: string;
}

export interface AuthorReference {
  author: {
    key: string;
  };
  type?: {
    key: string;
  };
}

export interface BookDetails {
  key: string;
  title: string;
  description?: string | OpenLibraryDescription;
  covers?: number[];
  subjects?: string[];
  authors?: AuthorReference[];
  first_publish_date?: string;
  created?: {
    type: string;
    value: string;
  };
  last_modified?: {
    type: string;
    value: string;
  };
}