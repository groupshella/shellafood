"use client";

import type { ReactNode } from "react";
import Link from "next/link";

interface PrimaryButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
    variant?: "primary" | "danger-muted";
    className?: string;
}

export function PrimaryButton({
    children,
    href,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    className = "",
}: PrimaryButtonProps) {
    const base = [
        "inline-flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors sm:min-h-[52px] sm:text-[15px]",
        "disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
    ].join(" ");

    const styles =
        variant === "primary"
            ? "bg-[#30913F] text-white active:bg-[#267332] disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
            : "bg-[#F5F5F5] text-red-600 active:bg-gray-200 dark:bg-gray-800 dark:text-red-400 dark:active:bg-gray-700";

    const classNames = `${base} ${styles} ${className}`;

    if (href && !disabled) {
        return (
            <Link href={href} className={classNames}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classNames}
        >
            {children}
        </button>
    );
}
