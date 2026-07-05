"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface ProfileListRowProps {
    icon?: ReactNode;
    label: string;
    subLabel?: string;
    onClick?: () => void;
    trailing?: ReactNode;
    showChevron?: boolean;
    muted?: boolean;
}

export function ProfileListRow({
    icon,
    label,
    subLabel,
    onClick,
    trailing,
    showChevron = true,
    muted = false,
}: ProfileListRowProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-[42px] w-full items-center justify-between gap-4 px-4 text-start transition-colors active:bg-[#F6F5F8]/60"
        >
            <div className="flex min-w-0 flex-1 flex-row-reverse items-center justify-end gap-2">
                <div className="min-w-0">
                    <p
                        className={[
                            "text-[16px] font-bold leading-[160%]",
                            muted ? "text-[#555555]" : "text-[#111B18]",
                        ].join(" ")}
                    >
                        {label}
                    </p>
                    {subLabel && (
                        <p className="truncate text-[12px] font-medium leading-[160%] text-[#707784]">
                            {subLabel}
                        </p>
                    )}
                </div>
                {icon && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#555555] [&>svg]:h-6 [&>svg]:w-6">
                        {icon}
                    </span>
                )}
            </div>

            <div className="flex shrink-0 items-center">
                {trailing}
                {showChevron && !trailing && (
                    <ChevronLeft className="h-5 w-5 text-[#555555]" strokeWidth={1.5} />
                )}
            </div>
        </button>
    );
}
