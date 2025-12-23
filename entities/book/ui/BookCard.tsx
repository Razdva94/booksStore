"use client";

import Link from "next/link";
import Image from "next/image";
import { viewedBooks } from "@/shared/lib/viewedBooks";
import type { Book } from "@/shared/api/gutendex";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const isViewed = viewedBooks.isViewed(book.id);
  const coverUrl = book.formats["image/jpeg"] || book.formats["image/png"];
  const authorName = book.authors[0]?.name || "Unknown Author";

  return (
    <Link
      href={`/books/${book.id}`}
      className={`block group card-hover relative ${
        isViewed ? "opacity-50" : "opacity-100"
      }`}
      prefetch={true}
    >
      {isViewed && (
        <div className="absolute top-2 right-2 z-10 bg-gray-800/90 border border-gray-600 rounded-full p-1.5 shadow-lg">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
      <div
        className={`glass-effect gothic-border rounded-lg overflow-hidden h-full transition-all ${
          isViewed
            ? "bg-gray-900/40 border-gray-800/50 grayscale-[0.3]"
            : "bg-gray-900/80"
        }`}
      >
        <div className="aspect-[3/4] relative bg-gradient-to-br from-gray-800 via-gray-900 to-black overflow-hidden">
          {coverUrl ? (
            <>
              <Image
                src={coverUrl}
                alt={book.title}
                fill
                className={`object-cover transition-transform duration-500 ${
                  isViewed
                    ? "opacity-60 grayscale-[0.4]"
                    : "opacity-90 group-hover:scale-110"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized={coverUrl.includes('gutenberg.org')}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {isViewed && (
                <div className="absolute inset-0 bg-gray-900/40" />
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
              <div className="text-6xl mb-4 opacity-50">📖</div>
              <p className="text-sm font-medium text-center">No Cover</p>
            </div>
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 ${
              isViewed ? "opacity-0" : "opacity-0 group-hover:opacity-100"
            }`}
          />
        </div>
        <div
          className={`p-5 backdrop-blur-sm border-t border-gray-700/50 ${
            isViewed ? "bg-gray-900/40" : "bg-gray-900/80"
          }`}
        >
          <h3
            className={`font-bold text-lg mb-2 line-clamp-2 transition-colors ${
              isViewed
                ? "text-gray-500 line-through decoration-gray-600"
                : "text-gray-100 group-hover:text-white"
            }`}
          >
            {book.title}
          </h3>
          <p
            className={`text-sm mb-3 font-medium ${
              isViewed ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {authorName}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded border ${
                isViewed
                  ? "text-gray-600 bg-gray-900/40 border-gray-800/50"
                  : "text-gray-300 bg-gray-800/60 border-gray-700"
              }`}
            >
              {book.download_count.toLocaleString()} downloads
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

