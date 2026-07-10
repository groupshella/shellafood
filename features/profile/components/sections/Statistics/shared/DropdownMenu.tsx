"use client";

import { useEffect, useRef } from "react";

import { TAJAWAL } from "@/features/profile/constants/statistics.constants";

export function DropdownMenu({
    open,
    items,
    onSelect,
    onClose,
    className,
}: {
    open: boolean;
    items: readonly string[];
    selected: string;
    onSelect: (value: string) => void;
    onClose: () => void;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={[
                "absolute top-[calc(100%+4px)] z-30 w-[86px] overflow-hidden rounded-[4px] border border-[#F6F5F8] dark:border-gray-700 bg-[#F6F5F8] dark:bg-gray-800 shadow-[0px_1px_9.6px_rgba(0,0,0,0.15)]",
                "animate-in fade-in slide-in-from-top-1 duration-200",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {items.map((item, index) => (
                <div key={item}>
                    <button
                        type="button"
                        onClick={() => {
                            onSelect(item);
                            onClose();
                        }}
                        className="flex h-8 w-full items-center justify-center text-[14px] font-medium text-[#343434] dark:text-gray-200 transition-colors hover:bg-white/60 dark:hover:bg-gray-700/60"
                        style={TAJAWAL}
                    >
                        {item}
                    </button>
                    {index < items.length - 1 && (
                        <div className="mx-2 border-t border-[#C6C8CE] dark:border-gray-600 opacity-40" />
                    )}
                </div>
            ))}
        </div>
    );
}
