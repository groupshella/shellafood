"use client";

import { useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ItemShellProps {
    children: React.ReactNode;
    isArabic: boolean;
}

export function ItemShell({ children, isArabic }: ItemShellProps) {
    const router = useRouter();

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <div className="min-h-dvh bg-white dark:bg-gray-900" dir="rtl">
            <header className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-gray-900 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="mx-auto flex w-full max-w-lg items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3 md:max-w-2xl lg:max-w-4xl lg:px-6 xl:max-w-5xl">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:active:bg-gray-800 sm:h-11 sm:w-11"
                        aria-label={isArabic ? "رجوع" : "Back"}
                    >
                        <ChevronRight className="h-5 w-5 text-gray-900 dark:text-gray-100 sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />
                    </button>
                    <h1 className="min-w-0 truncate text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                        {isArabic ? "تفاصيل السلعة" : "Item details"}
                    </h1>
                    <div className="w-10 sm:w-11" aria-hidden />
                </div>
            </header>
            <main className="mx-auto w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                {children}
            </main>
        </div>
    );
}
