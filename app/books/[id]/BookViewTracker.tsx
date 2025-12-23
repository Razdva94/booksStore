"use client";

import { useEffect } from "react";
import { viewedBooks } from "@/shared/lib/viewedBooks";

interface BookViewTrackerProps {
  bookId: number;
}

export function BookViewTracker({ bookId }: BookViewTrackerProps) {
  useEffect(() => {
    viewedBooks.add(bookId);
  }, [bookId]);

  return null;
}

