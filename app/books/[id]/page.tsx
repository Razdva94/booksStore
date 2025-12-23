import { Suspense } from "react";
import { BookPageContent } from "./BookPageContent";

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 border-t-transparent mb-4"></div>
            <p className="text-gray-400 text-lg font-light">Loading book...</p>
          </div>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
