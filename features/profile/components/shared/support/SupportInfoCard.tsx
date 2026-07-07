"use client";

import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface SupportInfoCardProps {
    icon: ReactNode;
    title: string;
    body: ReactNode;
    showChevron?: boolean;
    align?: "center" | "start";
    onClick?: () => void;
    href?: string;
}

/**
 * RTL-native info card: icon sits at the inline start (visual right),
 * text is start-aligned, and the chevron sits at the inline end (visual left).
 */
export function SupportInfoCard({
    icon,
    title,
    body,
    showChevron = false,
    align = "start",
    onClick,
    href,
}: SupportInfoCardProps) {
    const content = (
        <>
            <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
                <span className="shrink-0 pt-px text-[#555555] dark:text-gray-400">{icon}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1 text-start">
                    <p className="text-[15px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[16px]">{title}</p>
                    <div className="w-full break-words text-[14px] font-medium leading-[160%] text-[#111B18] dark:text-gray-200 sm:text-[16px]">
                        {body}
                    </div>
                </div>
            </div>
            {showChevron && (
                <ChevronLeft
                    className="h-5 w-5 shrink-0 text-[#555555] dark:text-gray-400"
                    strokeWidth={1.5}
                    aria-hidden
                />
            )}
        </>
    );

    const className = `flex min-h-[80px] w-full justify-between gap-3 rounded-xl bg-white px-3 py-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] transition-colors active:bg-gray-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]/40 dark:bg-gray-800 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] dark:active:bg-gray-700/60 sm:gap-4 sm:px-4 sm:py-4 ${
        align === "center" ? "items-center" : "items-start"
    }`;

    if (href) {
        return (
            <a href={href} className={className}>
                {content}
            </a>
        );
    }

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={`${className} text-start`}>
                {content}
            </button>
        );
    }

    return <div className={className}>{content}</div>;
}
