"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

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
                    "text-black transition-colors hover:bg-white/10 active:scale-95",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                ].join(" ")}
                aria-label="العودة للصفحة السابقة"
            >
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </button>

            <form onSubmit={handleSubmit} className="relative min-w-0 flex-1">
                <input
                    type="search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="البحث"
                    aria-label="البحث"
                    className={[
                        "w-full rounded-full bg-[#EAEAEA] py-3.5 pe-12 ps-5",
                        "text-right text-[15px] text-gray-900 placeholder:text-gray-400",
                        "outline-none ring-0",
                        "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                    ].join(" ")}
                />
                <Search
                    className="pointer-events-none absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    strokeWidth={2}
                    aria-hidden
                />
            </form>
        </div>
    );
}
