"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentShellProps {
    children: React.ReactNode;
}

const BACK_BTN = [
    "flex h-10 w-10 items-center justify-center rounded-full",
    "text-gray-700 transition-colors active:bg-gray-100",
    "dark:text-gray-300 dark:active:bg-gray-800",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

export function PaymentShell({ children }: PaymentShellProps) {
    const router = useRouter();

    return (
        <div dir="rtl" className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
            <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
                <div className="mx-auto flex w-full max-w-lg items-center gap-3 px-4 py-3 sm:max-w-xl sm:px-5 lg:max-w-2xl">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        aria-label="رجوع"
                        className={BACK_BTN}
                    >
                        <ChevronRight className="h-5 w-5" aria-hidden />
                    </button>
                    <h1 className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                        إتمام الدفع
                    </h1>
                </div>
            </header>

            <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4 sm:max-w-xl sm:px-5 sm:py-6 lg:max-w-2xl">
                {children}
            </main>
        </div>
    );
}
