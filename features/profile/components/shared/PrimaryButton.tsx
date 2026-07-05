"use client";

import type { ReactNode } from "react";

interface PrimaryButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
    variant?: "primary" | "danger-muted";
    className?: string;
}

export function PrimaryButton({
    children,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    className = "",
}: PrimaryButtonProps) {
    const base =
        "w-full rounded-xl py-3.5 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed";
    const styles =
        variant === "primary"
            ? "bg-[#30913F] text-white active:bg-[#267332] disabled:bg-gray-200 disabled:text-gray-500"
            : "bg-[#F5F5F5] text-red-600 active:bg-gray-200";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${styles} ${className}`}
        >
            {children}
        </button>
    );
}
