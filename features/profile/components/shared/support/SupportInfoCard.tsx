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
            <div className="flex min-w-0 flex-1 items-start gap-2">
                <span className="shrink-0 pt-px text-[#555555]">{icon}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1 text-start">
                    <p className="text-[16px] font-bold leading-[160%] text-[#111B18]">{title}</p>
                    <div className="w-full break-words text-[16px] font-medium leading-[160%] text-[#111B18]">
                        {body}
                    </div>
                </div>
            </div>
            {showChevron && (
                <ChevronLeft
                    className="h-5 w-5 shrink-0 text-[#555555]"
                    strokeWidth={1.5}
                    aria-hidden
                />
            )}
        </>
    );

    const className = `flex w-full justify-between gap-4 rounded-lg bg-white px-4 py-2 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] transition-colors active:bg-gray-50/80 ${
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
