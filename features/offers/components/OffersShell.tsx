"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ChevronRight, ShoppingBag } from "lucide-react";

interface OffersShellProps {
    children: React.ReactNode;
    offerName?: string;
}

const ICON_BTN =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:text-gray-300 dark:active:bg-gray-800 dark:focus-visible:ring-offset-gray-900 sm:h-11 sm:w-11";

export function OffersShell({ children, offerName }: OffersShellProps) {
    const router = useRouter();
    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <div
            className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-[#F6F5F8] dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir="rtl"
        >
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md dark:border-white/[0.06] dark:bg-gray-900/95">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-3 py-2.5 sm:min-h-14 sm:px-4 md:px-5 lg:px-6">
                    <button
                        type="button"
                        onClick={handleBack}
                        className={`${ICON_BTN} absolute end-3 sm:end-4`}
                        aria-label="رجوع"
                    >
                        <ChevronRight
                            className="h-5 w-5 text-[#30913F] dark:text-[#4db860] sm:h-[22px] sm:w-[22px]"
                            strokeWidth={2}
                            aria-hidden
                        />
                    </button>

                    <div className="flex max-w-[60%] flex-col items-center sm:max-w-[70%]">
                        <h1 className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                            عروض وخصومات
                        </h1>
                        {offerName && (
                            <p className="line-clamp-1 text-xs font-medium leading-tight text-[#30913F] dark:text-[#4db860] sm:text-[12px]">
                                {offerName}
                            </p>
                        )}
                    </div>

                    <Link
                        href="/cart"
                        className={`${ICON_BTN} absolute start-3 sm:start-4`}
                        aria-label="السلة"
                    >
                        <ShoppingBag
                            className="h-5 w-5 text-gray-700 dark:text-gray-300 sm:h-[22px] sm:w-[22px]"
                            strokeWidth={2}
                            aria-hidden
                        />
                    </Link>
                </div>
            </header>

            {children}
        </div>
    );
}
