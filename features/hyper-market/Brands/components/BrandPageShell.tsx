"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Brand } from "@/features/hyper-market/Brands/types/brands.types";

interface BrandPageShellProps {
    brand: Brand;
    children: React.ReactNode;
}

const ICON_BTN =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2";

export function BrandPageShell({ brand, children }: BrandPageShellProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="mx-auto min-h-screen w-full max-w-lg bg-[#F6F5F8] sm:max-w-2xl lg:max-w-4xl" dir="rtl">
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-4 py-2.5">
                    <Link
                        href="/hyper-market/brands"
                        className={`${ICON_BTN} absolute right-4`}
                        aria-label="العودة إلى العلامات التجارية"
                    >
                        <ArrowRight className="h-5 w-5 text-[#30913F]" strokeWidth={2} />
                    </Link>

                    <div className="flex items-center gap-2">
                        {!imgError && brand.image_full_url ? (
                            <div className="relative h-7 w-7 overflow-hidden rounded-lg ring-1 ring-black/[0.06]">
                                <Image
                                    src={brand.image_full_url}
                                    alt=""
                                    fill
                                    className="object-contain p-0.5"
                                    sizes="28px"
                                    priority
                                    onError={() => setImgError(true)}
                                />
                            </div>
                        ) : null}
                        <h1 className="text-base font-bold text-gray-900">{brand.name}</h1>
                    </div>
                </div>
            </header>

            {children}
        </div>
    );
}
