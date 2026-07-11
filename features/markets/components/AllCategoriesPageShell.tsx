"use client";

import { MODULE_PAGE_BG } from "@/shared/lib/page-surface";

interface AllCategoriesPageShellProps {
    children: React.ReactNode;
}

export function AllCategoriesPageShell({ children }: AllCategoriesPageShellProps) {
    return (
        <div
            className={`mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl ${MODULE_PAGE_BG}`}
            dir="rtl"
        >
            {children}
        </div>
    );
}
