"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Brand } from "@/features/brands/types/brands.types";

interface BrandPageShellProps {
    brand: Brand;
    children: React.ReactNode;
    isArabic: boolean;
}

const ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700",
    "transition-colors hover:bg-gray-50 active:scale-95",
    "dark:text-gray-300 dark:hover:bg-gray-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

export function BrandPageShell({ brand, children, isArabic }: BrandPageShellProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-[#F6F5F8] dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir={isArabic ? "rtl" : "ltr"}
        >
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md dark:border-white/[0.06] dark:bg-gray-900/95">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-3 py-2.5 sm:px-5">
                    <Link
                        href="/brands"
                        className={`${ICON_BTN} absolute start-3 sm:start-5`}
                        aria-label={isArabic ? "العودة إلى العلامات التجارية" : "Return to brands"}
                    >
                        {isArabic ? <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" strokeWidth={2} aria-hidden /> : <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" strokeWidth={2} aria-hidden />}
                    </Link>

                    <div className="flex max-w-[65%] min-w-0 items-center gap-2 sm:max-w-[70%]">
                        {!imgError && brand.image_full_url ? (
                            <div className="relative h-7 w-7 overflow-hidden rounded-lg ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:h-8 sm:w-8">
                                <Image
                                    src={brand.image_full_url}
                                    alt=""
                                    fill
                                    className="object-contain p-0.5"
                                    sizes="32px"
                                    priority
                                    onError={() => setImgError(true)}
                                />
                            </div>
                        ) : null}
                        <h1 className="truncate text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                            {brand.name}
                        </h1>
                    </div>
                </div>
            </header>

            {children}
        </div>
    );
}
