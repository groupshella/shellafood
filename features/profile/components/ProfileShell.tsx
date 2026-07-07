"use client";

import Navbar from "@/features/layout/components/Navbar";
import type { ReactNode } from "react";

interface ProfileShellProps {
    children: ReactNode;
}

export function ProfileShell({ children }: ProfileShellProps) {
    return (
        <div
            className="flex min-h-dvh w-full overflow-x-hidden flex-col bg-white dark:bg-gray-950"
            dir="rtl"
        >
            <header className="sticky top-0 z-10 shrink-0 border-b border-transparent bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-950 sm:px-5 md:px-6">
                <h1 className="text-center text-lg font-bold leading-[160%] text-[#111B18] dark:text-gray-50 sm:text-[18px] md:text-xl">
                    حسابي
                </h1>
            </header>

            <div className="flex flex-1 flex-col rounded-t-2xl bg-[#F6F5F8] px-3 pb-[max(6rem,env(safe-area-inset-bottom))] pt-4 dark:bg-gray-900 sm:px-4 md:px-5 lg:px-6">
                <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:max-w-2xl md:gap-5 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
                    {children}
                </div>
            </div>

            <Navbar />
        </div>
    );
}
