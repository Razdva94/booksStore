import { Suspense } from "react";
import { BookSearch } from "@/features/book-search";
import { LanguageFilters } from "@/features/language-filters";
import { BooksPageContent } from "./BooksPageContent";

export default function BooksPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-2xl tracking-tight">
            <span className="bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-clip-text text-transparent">
              📚 LIBRARY
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg font-light tracking-wide">
            Discover thousands of free books from Project Gutenberg
          </p>
        </div>
        
        <div className="mb-8 space-y-6">
          <div className="glass-effect gothic-border rounded-lg p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <BookSearch />
            </Suspense>
          </div>
          <div className="glass-effect gothic-border rounded-lg p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <LanguageFilters />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 border-t-transparent"></div>
            <p className="text-gray-400 mt-4 text-lg font-light">Loading books...</p>
          </div>
        }>
          <BooksPageContent />
        </Suspense>
      </div>
    </div>
  );
}
