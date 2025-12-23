"use client";

interface BookViewClientProps {
  subjects: string[];
}

export function BookViewClient({ subjects }: BookViewClientProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {subjects.map((subject, index) => (
        <span
          key={index}
          className="px-4 py-2 bg-gray-800/60 border border-gray-700/50 text-gray-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md hover:border-gray-600 transition-all"
        >
          {subject}
        </span>
      ))}
    </div>
  );
}

