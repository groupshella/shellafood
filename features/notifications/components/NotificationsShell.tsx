"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface NotificationsShellProps {
    children: React.ReactNode;
}

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-white dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 py-3.5 sm:px-4 sm:py-4 md:px-5 lg:px-6";
const CONTENT_PADDING = "px-3 py-4 pb-8 sm:px-4 sm:py-5 sm:pb-10 md:px-5 lg:px-6";

export function NotificationsShell({ children }: NotificationsShellProps) {
    const router = useRouter();

    return (
        <div className={SHELL_LAYOUT} dir="rtl">
            <header className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-gray-900 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className={`relative flex items-center justify-center ${HEADER_PADDING}`}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="absolute end-3 flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:active:bg-gray-800 sm:end-4 sm:h-11 sm:w-11"
                        aria-label="رجوع"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-900 dark:text-gray-100 sm:h-[22px] sm:w-[22px]" strokeWidth={2} />
                    </button>
                    <h1 className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg lg:text-xl">الإشعارات</h1>
                </div>
            </header>
            <div className={CONTENT_PADDING}>{children}</div>
        </div>
    );
}
