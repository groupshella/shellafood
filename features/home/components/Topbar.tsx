import Link from "next/link";
import { ArrowLeft, Bell, Search } from "lucide-react";
export function Topbar({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <>
            <header className="flex items-center justify-between px-5 py-3">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">مرحباً بك</h1>
                <div className="flex items-center gap-3">
                    <Link href="/notifications" className="relative p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500" aria-label="الإشعارات">
                        <Bell className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                    </Link>
                    <Link href="/search" className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500" aria-label="بحث">
                        <Search className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                    </Link>
                </div>
            </header>
            {!isAuthenticated ? (
                <Link href="/auth" className="flex items-center gap-2 px-2 py-1 font-bold bg-gray-100 rounded-lg w-fit mx-4">
                    <p className="text-sm text-gray-700">انضم إلينا ، واستمتع بخدمات شلة</p>
                    <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                </Link>
            ) : (
                <Link href="/auth/login" className="flex items-center gap-2 px-2 py-1 font-bold bg-gray-100 rounded-lg w-fit mx-4">
                    <p className="text-sm text-gray-700">ضع عنوانك لتكتشف خدماتنا بسهولة</p>
                    <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                </Link>

            )}
        </>
    );
}