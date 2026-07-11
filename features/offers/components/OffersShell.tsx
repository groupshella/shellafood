"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ChevronRight } from "lucide-react";

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
                        className={`${ICON_BTN} absolute start-3 sm:start-4`}
                        aria-label="رجوع"
                    >
                        <ChevronRight
                            className="h-5 w-5 text-black dark:text-white sm:h-[22px] sm:w-[22px]"
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
                        className={`${ICON_BTN} absolute end-3 sm:end-4`}
                        aria-label="السلة"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#111B18] dark:text-gray-100 sm:h-6 sm:w-6"
                            aria-hidden
                        >
                            <path
                                d="M7.5 7.67001V6.70001C7.5 4.45001 9.31 2.24001 11.56 2.03001C14.24 1.77001 16.5 3.88001 16.5 6.51001V7.89001"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9.00007 22H15.0001C19.0201 22 19.7401 20.39 19.9501 18.43L20.7001 12.43C20.9701 9.99 20.2701 8 16.0001 8H8.00007C3.73007 8 3.03007 9.99 3.30007 12.43L4.05007 18.43C4.26007 20.39 4.98007 22 9.00007 22Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M15.4955 12H15.5045"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8.49451 12H8.50349"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </div>
            </header>

            {children}
        </div>
    );
}
