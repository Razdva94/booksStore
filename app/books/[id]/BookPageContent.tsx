"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { gutendexApi } from "@/shared/api/gutendex";
import { BookViewClient } from "./BookViewClient";
import { BookViewTracker } from "./BookViewTracker";

export function BookPageContent() {
  const params = useParams();
  const bookId = parseInt(params.id as string);

  if (isNaN(bookId)) {
    notFound();
  }

  const {
    data: book,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => gutendexApi.getBookById(bookId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 500,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 border-t-transparent mb-4"></div>
          <p className="text-gray-400 text-lg font-light">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    notFound();
  }

  const coverUrl = book.formats["image/jpeg"] || book.formats["image/png"];
  const authorName = book.authors[0]?.name || "Unknown Author";

  return (
    <div className="min-h-screen">
      <BookViewTracker bookId={bookId} />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-gray-300 font-semibold transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Books
        </Link>

        <div className="glass-effect gothic-border rounded-lg overflow-hidden shadow-2xl">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 md:p-0">
              <div className="aspect-[3/4] relative">
                {coverUrl ? (
                  <>
                    <Image
                      src={coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover opacity-90"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={coverUrl.includes('gutenberg.org')}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-8">
                    <div className="text-8xl mb-4 opacity-50">📖</div>
                    <p className="text-lg font-medium">No Cover</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-2/3 p-8 md:p-12 bg-gray-900/80 backdrop-blur-sm border-l border-gray-700/50">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100 leading-tight">
                {book.title}
              </h1>
              
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Author</h2>
                <p className="text-xl text-gray-200 font-semibold">{authorName}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Downloads</h2>
                <p className="text-2xl text-gray-200 font-bold">
                  {book.download_count.toLocaleString()}
                </p>
              </div>

              {book.subjects && book.subjects.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Subjects</h2>
                  <BookViewClient subjects={book.subjects} />
                </div>
              )}

              {book.languages && book.languages.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {book.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm font-semibold shadow-lg"
                      >
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

