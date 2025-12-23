"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "ru", name: "Russian" },
  { code: "it", name: "Italian" },
];

export function LanguageFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);

  const selectedLanguages = searchParams.getAll("languages");

  const handleLanguageToggle = useCallback(
    (langCode: string, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (isProcessingRef.current) {
        return;
      }

      isProcessingRef.current = true;
      setIsPending(true);

      const params = new URLSearchParams(searchParams.toString());
      const currentLanguages = params.getAll("languages");

      if (currentLanguages.includes(langCode)) {
        const filtered = currentLanguages.filter((l) => l !== langCode);
        params.delete("languages");
        filtered.forEach((l) => params.append("languages", l));
      } else {
        params.append("languages", langCode);
      }

      params.delete("page");

      router.replace(`/books?${params.toString()}`);

      setTimeout(() => {
        isProcessingRef.current = false;
        setIsPending(false);
      }, 300);
    },
    [router, searchParams]
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-gray-300 font-semibold text-lg tracking-wide">Filter by Language</h3>
        {isPending && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400">Applying filters...</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {AVAILABLE_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.code);
          return (
            <label
              key={lang.code}
              onClick={(e) => handleLanguageToggle(lang.code, e)}
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all select-none gothic-border ${
                isPending ? "opacity-60 cursor-wait" : ""
              } ${
                isSelected
                  ? "bg-gray-800 text-gray-100 border-gray-600 shadow-lg"
                  : "bg-gray-900/60 text-gray-400 hover:bg-gray-800/60 hover:text-gray-300 border-gray-700/50"
              }`}
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleLanguageToggle(lang.code)}
                  className="w-4 h-4 text-gray-600 border-gray-600 rounded focus:ring-gray-500 cursor-pointer pointer-events-none bg-gray-800"
                  tabIndex={-1}
                />
              )}
              <span className="text-sm font-semibold">{lang.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

