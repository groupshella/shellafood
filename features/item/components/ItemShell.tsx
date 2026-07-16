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
        <div
            className="min-h-dvh bg-background"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <header className="sticky top-0 z-10 bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                <div className="mx-auto flex w-full max-w-lg items-center justify-between px-3 py-2.5 sm:max-w-xl sm:px-5 sm:py-3 md:max-w-2xl md:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-11 sm:w-11"
                        aria-label={isArabic ? "رجوع" : "Go back"}
                    >
                        <ChevronRight
                            className={[
                                "h-5 w-5 text-foreground sm:h-6 sm:w-6",
                                isArabic ? "" : "rotate-180",
                            ].join(" ")}
                            strokeWidth={2}
                            aria-hidden
                        />
                    </button>
                    <h1 className="min-w-0 truncate text-base font-bold text-foreground sm:text-lg md:text-xl">
                        {isArabic ? "تفاصيل السلعة" : "Product details"}
                    </h1>
                    <div className="w-10 sm:w-11" aria-hidden />
                </div>
            </header>
            <main className="mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                {children}
            </main>
        </div>
    );
}
