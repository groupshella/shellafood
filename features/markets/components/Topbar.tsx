import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const ICON_BTN = [
    "flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11",
    "text-gray-700 transition-colors hover:bg-gray-100 active:scale-95",
    "dark:text-gray-300 dark:hover:bg-gray-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

export function Topbar({
    moduleName,
    moduleId,
    isAuthenticated,
}: {
    moduleName: string;
    moduleId: string;
    isAuthenticated: boolean;
}) {
    return (
        <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md dark:border-white/[0.06] dark:bg-gray-900/95">
            <div className="relative mx-auto flex min-h-11 w-full max-w-lg items-center justify-center px-3 py-2.5 sm:min-h-12 sm:max-w-2xl sm:px-5 sm:py-3.5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                <Link
                    href="/home"
                    className={`${ICON_BTN} absolute right-3 sm:right-5 lg:right-6`}
                    aria-label="العودة إلى الرئيسية"
                >
                    <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden />
                </Link>

                <h1 className="max-w-[62%] truncate px-10 text-center text-base font-bold text-gray-900 dark:text-gray-50 sm:max-w-[60%] sm:px-12 sm:text-lg md:text-xl">
                    {moduleName}
                </h1>

                <Link
                    href={`/search?module_id=${moduleId}`}
                    className={`${ICON_BTN} absolute left-3 sm:left-5 lg:left-6`}
                    aria-label="بحث"
                >
                    <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
                </Link>
            </div>
        </header>
    );
}
