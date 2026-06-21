"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface NotificationsShellProps {
    children: React.ReactNode;
}

export function NotificationsShell({ children }: NotificationsShellProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white px-4 pb-8 pt-4" dir="rtl">
            <div className="relative flex items-center justify-center pb-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-900 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 rounded-full"
                    aria-label="العودة للصفحة السابقة"
                >
                    <ArrowRight className="h-5 w-5" strokeWidth={2} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">الإشعارات</h1>
            </div>
            {children}
        </div>
    );
}

