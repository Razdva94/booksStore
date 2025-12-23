import type { Book } from "@/shared/api/gutendex";

export type BookId = number;

export interface BookView extends Book {
  isViewed?: boolean;
}

