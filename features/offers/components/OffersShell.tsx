"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ShoppingBag } from "lucide-react";

interface OffersShellProps {
    children: React.ReactNode;
    offerName?: string;
}

const ICON_BTN =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2";

export function OffersShell({ children, offerName }: OffersShellProps) {
    const router = useRouter();

    return (
        <div
            className="mx-auto min-h-screen w-full max-w-lg bg-[#F6F5F8] sm:max-w-2xl lg:max-w-4xl"
            dir="rtl"
        >
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-4 py-2.5">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={`${ICON_BTN} absolute right-4`}
                        aria-label="العودة"
                    >
                        <ChevronRight className="h-5 w-5 text-[#30913F]" strokeWidth={2} />
                    </button>

                    <div className="flex flex-col items-center">
                        <h1 className="text-base font-bold text-gray-900">عروض وخصومات</h1>
                        {offerName && (
                            <p className="text-[12px] text-[#30913F] font-medium leading-tight">
                                {offerName}
                            </p>
                        )}
                    </div>

                    <Link
                        href="/cart"
                        className={`${ICON_BTN} absolute left-4`}
                        aria-label="السلة"
                    >
                        <ShoppingBag className="h-5 w-5 text-gray-700" strokeWidth={2} />
                    </Link>
                </div>
            </header>

            {children}
        </div>
    );
}
