"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ItemShellProps {
    children: React.ReactNode;
}

export function ItemShell({ children }: ItemShellProps) {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white" dir="rtl">
            <header className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors active:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                    aria-label="إغلاق"
                >
                    <ChevronRight className="h-4 w-4 text-gray-700" strokeWidth={2.5} />
                </button>
                <div className="w-9" aria-hidden />
            </header>
            {children}
        </div>
    );
}
