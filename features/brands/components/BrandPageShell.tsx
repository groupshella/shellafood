"use client";

import Link from "next/link";
import Image from "@/shared/components/SecureImage";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Brand } from "@/features/brands/types/brands.types";

interface BrandPageShellProps {
    brand: Brand;
    children: React.ReactNode;
    isArabic: boolean;
}

const ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground",
    "transition-colors hover:bg-card active:scale-95",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

export function BrandPageShell({ brand, children, isArabic }: BrandPageShellProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-background sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-3 py-2.5 sm:px-5 md:px-6">
                    <Link
                        href="/brands"
                        className={`${ICON_BTN} absolute start-3 sm:start-5`}
                        aria-label={
                            isArabic
                                ? "العودة إلى العلامات التجارية"
                                : "Back to brands"
                        }
                    >
                        <ArrowRight
                            className={[
                                "h-5 w-5 text-brand",
                                isArabic ? "" : "rotate-180",
                            ].join(" ")}
                            strokeWidth={2}
                            aria-hidden
                        />
                    </Link>

                    <div className="flex max-w-[65%] min-w-0 items-center gap-2 sm:max-w-[70%]">
                        {!imgError && brand.image_full_url ? (
                            <div className="relative h-7 w-7 overflow-hidden rounded-lg ring-1 ring-border sm:h-8 sm:w-8">
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
                        <h1 className="truncate text-base font-bold text-foreground sm:text-lg md:text-xl">
                            {brand.name}
                        </h1>
                    </div>
                </div>
            </header>

            {children}
        </div>
    );
}
