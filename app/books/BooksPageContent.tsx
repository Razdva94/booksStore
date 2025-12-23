"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BookList } from "@/widgets/book-list";
import { gutendexApi, type Book } from "@/shared/api/gutendex";

export function BooksPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const languages = searchParams.getAll("languages");

  const queryKey = useMemo(
    () => ["books", search, languages.sort().join(",")],
    [search, languages.join(",")]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return await gutendexApi.getBooks({
        search,
        languages: languages.length > 0 ? languages : undefined,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const page = url.searchParams.get("page");
      return page ? parseInt(page) : undefined;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const books = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (books.length === 0 && !isLoading && !isFetching) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 opacity-50">🔍</div>
        <p className="text-gray-300 text-xl font-medium mb-2">No books found</p>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <>
      {(isLoading || isFetching) && (
        <div className="mb-6 flex items-center justify-center gap-3 py-4">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-light">Searching books...</p>
        </div>
      )}
      <BookList
        initialBooks={books}
        hasMore={!!hasNextPage}
        onLoadMore={handleLoadMore}
        isLoading={isFetchingNextPage}
      />
    </>
  );
}
