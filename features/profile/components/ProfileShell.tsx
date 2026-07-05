"use client";

import Navbar from "@/features/layout/components/Navbar";
import type { ReactNode } from "react";

interface ProfileShellProps {
    children: ReactNode;
}

export function ProfileShell({ children }: ProfileShellProps) {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-[375px] flex-col bg-white" dir="rtl">
            <header className="sticky top-0 z-10 shrink-0 bg-white px-4 pb-3 pt-4">
                <h1 className="text-center text-[18px] font-bold leading-[160%] text-[#111B18]">
                    حسابي
                </h1>
            </header>

            <div className="flex flex-1 flex-col gap-4 rounded-t-[16px] bg-[#F6F5F8] px-4 pb-[max(6rem,env(safe-area-inset-bottom))] pt-4">
                {children}
            </div>

            <Navbar />
        </div>
    );
}
