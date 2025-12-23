import { localStorage } from "./localStorage";

const VIEWED_BOOKS_KEY = "viewed_books";

export const viewedBooks = {
  get: (): number[] => {
    if (typeof window === "undefined") return [];
    return localStorage.get<number[]>(VIEWED_BOOKS_KEY) || [];
  },

  add: (bookId: number): void => {
    if (typeof window === "undefined") return;
    const viewed = viewedBooks.get();
    if (!viewed.includes(bookId)) {
      viewed.push(bookId);
      localStorage.set(VIEWED_BOOKS_KEY, viewed);
    }
  },

  isViewed: (bookId: number): boolean => {
    if (typeof window === "undefined") return false;
    return viewedBooks.get().includes(bookId);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.remove(VIEWED_BOOKS_KEY);
  },
};
