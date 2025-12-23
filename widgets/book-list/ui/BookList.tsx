"use client";

import { useEffect, useRef, useCallback } from "react";
import { BookCard } from "@/entities/book";
import type { Book } from "@/shared/api/gutendex";

interface BookListProps {
  initialBooks: Book[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
}

export function BookList({
  initialBooks,
  hasMore,
  onLoadMore,
  isLoading,
}: BookListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {initialBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {hasMore && (
        <div ref={observerTarget} className="h-20 flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center gap-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 border-t-transparent"></div>
              <p className="text-gray-400 text-sm font-light">Loading more books...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

