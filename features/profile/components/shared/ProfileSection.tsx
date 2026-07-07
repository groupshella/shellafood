"use client";

import type { ReactNode } from "react";

interface ProfileSectionProps {
    title: string;
    children: ReactNode;
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
    return (
        <section className="mx-auto w-full">
            <h2 className="mb-2 px-3 text-start text-[15px] font-bold leading-[160%] text-[#555555] dark:text-gray-400 sm:px-4 sm:text-[16px]">
                {title}
            </h2>
            <div className="grid grid-cols-1 gap-1.5 overflow-hidden rounded-2xl bg-white py-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-800 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:gap-2 sm:py-4 md:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </section>
    );
}
