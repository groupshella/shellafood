import Link from "next/link";
import { Bell, Search } from "lucide-react";

export function Topbar() {
    return (
        <>
            <header className="flex items-center justify-between px-5 py-3">
                <h1 className="text-xl font-bold tracking-tight text-gray-900">مرحباً بك</h1>
                <div className="flex items-center gap-3">
                    <Link
                        href="/notifications"
                        className="relative rounded-full bg-gray-50 p-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        aria-label="الإشعارات"
                    >
                        <Bell className="h-5 w-5 text-gray-700" strokeWidth={1.8} />
                    </Link>
                    <Link
                        href="/search"
                        className="rounded-full bg-gray-50 p-2.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        aria-label="بحث"
                    >
                        <Search className="h-5 w-5 text-gray-700" strokeWidth={1.8} />
                    </Link>
                </div>
            </header>


        </>
    );
}
