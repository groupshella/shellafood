"use client";

import Navbar from "@/features/layout/components/Navbar";

interface StoreShellProps {
    children: React.ReactNode;
}

export function StoreShell({ children }: StoreShellProps) {
    return (
        <div
            className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-white pb-[calc(58px+env(safe-area-inset-bottom))] dark:bg-gray-950"
            dir="rtl"
        >
            {children}
            <Navbar />
        </div>
    );
}
