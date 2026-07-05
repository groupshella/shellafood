"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentShellProps {
    children: React.ReactNode;
}

export function PaymentShell({ children }: PaymentShellProps) {
    const router = useRouter();

    return (
        <div dir="rtl" className="flex min-h-screen flex-col bg-gray-50">
            <header className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    aria-label="رجوع"
                    className="rounded-full p-1.5 active:bg-gray-100"
                >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
                <h1 className="text-[16px] font-bold text-gray-900">إتمام الدفع</h1>
            </header>

            <main className="flex-1 px-4 py-4">{children}</main>
        </div>
    );
}
