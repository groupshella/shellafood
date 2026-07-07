"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, X } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
}

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
    const router = useRouter();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit(value);
    };

    return (
        <div className="flex w-full min-w-0 items-center gap-2 sm:gap-2.5 lg:gap-3" dir="rtl">
            <button
                type="button"
                onClick={() => router.back()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:active:bg-gray-800 sm:h-11 sm:w-11"
                aria-label="العودة للصفحة السابقة"
            >
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 sm:h-6 sm:w-6" aria-hidden />
            </button>

            <form
                onSubmit={handleSubmit}
                role="search"
                className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-gray-100 px-3 py-2.5 dark:bg-gray-800 sm:gap-2.5 sm:px-4 sm:py-3 lg:px-5"
            >
                <Search className="h-[18px] w-[18px] shrink-0 text-gray-400 dark:text-gray-500 sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />

                <input
                    type="search"
                    enterKeyHint="search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="البحث"
                    aria-label="البحث"
                    className={[
                        "min-w-0 flex-1 bg-transparent text-right text-sm text-gray-900 dark:text-gray-100",
                        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        "outline-none sm:text-[15px] lg:text-base",
                        "[&::-webkit-search-cancel-button]:appearance-none",
                        "[&::-webkit-search-decoration]:appearance-none",
                    ].join(" ")}
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        aria-label="مسح البحث"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-600 transition-colors active:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 sm:h-8 sm:w-8"
                    >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                )}
            </form>
        </div>
    );
}
