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
        <div className="flex w-full items-center gap-3" dir="rtl">
            <button
                type="button"
                onClick={() => router.back()}
                className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    "transition-transform active:scale-95",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                ].join(" ")}
                aria-label="العودة للصفحة السابقة"
            >
                <ChevronRight
                    className="h-7 w-7 object-contain text-gray-400"
                    aria-hidden
                />
            </button>

            <form
                onSubmit={handleSubmit}
                className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full bg-[#EAEAEA] px-4 py-3.5"
            >
                <Search className="h-5 w-5 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />

                <input
                    type="search"
                    enterKeyHint="search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="البحث"
                    aria-label="البحث"
                    className={[
                        "min-w-0 flex-1 bg-transparent text-right text-[15px] text-gray-900",
                        "placeholder:text-gray-400 outline-none",
                        "[&::-webkit-search-cancel-button]:appearance-none",
                        "[&::-webkit-search-decoration]:appearance-none",
                    ].join(" ")}
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        aria-label="مسح البحث"
                        className="flex h-5 w-5 shrink-0 items-center justify-center text-gray-400"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </form>
        </div>
    );
}
