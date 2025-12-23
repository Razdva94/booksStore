export interface Book {
  id: number;
  title: string;
  authors: Array<{
    name: string;
    birth_year?: number;
    death_year?: number;
  }>;
  translators: Array<{
    name: string;
    birth_year?: number;
    death_year?: number;
  }>;
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | null;
  media_type: string;
  formats: {
    [key: string]: string;
  };
  download_count: number;
}

export interface GutendexResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

export interface GutendexParams {
  search?: string;
  languages?: string[];
  page?: number;
}

const GUTENDEX_API = "https://gutendex.com/books";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

function getCacheKey(params: GutendexParams): string {
  const key = JSON.stringify({
    search: params.search || "",
    languages: (params.languages || []).sort().join(","),
    page: params.page || 1,
  });
  return key;
}

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  if (cached) {
    cache.delete(key);
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export const gutendexApi = {
  getBooks: async (params: GutendexParams = {}): Promise<GutendexResponse> => {
    const cacheKey = getCacheKey(params);
    const cached = getCachedData<GutendexResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const searchParams = new URLSearchParams();

    if (params.search) {
      searchParams.append("search", params.search);
    }

    if (params.languages && params.languages.length > 0) {
      params.languages.forEach((lang) => {
        searchParams.append("languages", lang);
      });
    }

    if (params.page) {
      searchParams.append("page", params.page.toString());
    }

    const url = `${GUTENDEX_API}?${searchParams.toString()}`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  },

  getBookById: async (id: number): Promise<Book> => {
    const cacheKey = `book-${id}`;
    const cached = getCachedData<Book>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await fetch(`${GUTENDEX_API}/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch book: ${response.statusText}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  },
};

