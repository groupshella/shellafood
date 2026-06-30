"use client";

import Navbar from "@/features/layout/components/Navbar";

interface StoreShellProps {
    children: React.ReactNode;
}

export function StoreShell({ children }: StoreShellProps) {
    return (
        <div className="mx-auto min-h-screen w-full max-w-lg sm:max-w-2xl lg:max-w-4xl mb-16 bg-[#F6F5F8]" dir="rtl">
            {children}
            <Navbar />
        </div>
    );
}
