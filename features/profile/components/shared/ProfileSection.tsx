"use client";

import type { ReactNode } from "react";

interface ProfileSectionProps {
    title: string;
    children: ReactNode;
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
    return (
        <section className="mx-auto w-full max-w-[343px]">
            <h2 className="mb-2 px-4 text-start text-[16px] font-bold leading-[160%] text-[#555555]">
                {title}
            </h2>
            <div className="flex flex-col gap-2 overflow-hidden rounded-2xl bg-white py-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                {children}
            </div>
        </section>
    );
}
