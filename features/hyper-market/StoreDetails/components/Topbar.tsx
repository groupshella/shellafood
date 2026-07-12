import Link from "next/link";
import { Bell, Search } from "lucide-react";

const ICON_BTN = [
    "flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11",
    "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

export function Topbar({ isArabic }: { isArabic: boolean }) {
    return (
        <header className="flex min-w-0 items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-3.5 lg:px-6" dir={isArabic ? "rtl" : "ltr"}>
            <h2 className="min-w-0 truncate text-base font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-lg md:text-xl">
                {isArabic ? "هايبر ماركت شلة" : "Hyper Market Shella"}
            </h2>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Link href="/notifications" className={ICON_BTN} aria-label={isArabic ? "الإشعارات" : "Notifications"}>
                    <Bell className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </Link>
                <Link href="/search?module_id=3" className={ICON_BTN} aria-label={isArabic ? "بحث" : "Search"}>
                    <Search className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </Link>
            </div>
        </header>
    );
}
