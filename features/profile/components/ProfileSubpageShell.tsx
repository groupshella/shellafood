"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface ProfileSubpageShellProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    onBack?: () => void;
    showHeaderBorder?: boolean;
    showFooterBorder?: boolean;
    relaxedHeader?: boolean;
    subtitleAlign?: "center" | "start";
    mainClassName?: string;
    elevatedHeader?: boolean;
    footerClassName?: string;
}

const BACK_BTN = [
    "flex items-center justify-center rounded-full transition-colors",
    "text-gray-800 active:bg-gray-100 dark:text-gray-200 dark:active:bg-gray-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

export function ProfileSubpageShell({
    title,
    subtitle,
    children,
    footer,
    onBack,
    showHeaderBorder = true,
    showFooterBorder = true,
    relaxedHeader = false,
    subtitleAlign = "center",
    mainClassName = "",
    elevatedHeader = false,
    footerClassName = "",
}: ProfileSubpageShellProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) onBack();
        else router.back();
    };

    return (
        <div className="flex min-h-dvh flex-col overflow-x-hidden bg-white dark:bg-gray-950" dir="rtl">
            <header
                className={`sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center bg-white dark:bg-gray-950 ${
                    elevatedHeader
                        ? "h-[70px] border-b border-[#F6F5F8] px-4 shadow-[0px_6px_25.1px_rgba(0,0,0,0.05)] dark:border-gray-800 dark:shadow-[0px_6px_25.1px_rgba(0,0,0,0.2)] sm:px-5 md:px-6"
                        : relaxedHeader
                            ? "px-4 pb-2 pt-6 sm:px-5 md:px-6 lg:px-8"
                            : "px-4 py-5 sm:px-5 md:px-6 lg:px-8"
                } ${!elevatedHeader && showHeaderBorder ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
            >
                <button
                    type="button"
                    onClick={handleBack}
                    aria-label="رجوع"
                    className={`${BACK_BTN} -me-1 ${elevatedHeader || relaxedHeader ? "h-10 w-10" : "h-9 w-9"}`}
                >
                    <ChevronRight
                        className={`h-6 w-6 ${elevatedHeader ? "text-[#111B18] dark:text-gray-100" : "text-gray-800 dark:text-gray-200"}`}
                        strokeWidth={elevatedHeader ? 1.5 : 1.75}
                    />
                </button>
                <h1
                    className={`truncate text-center font-bold leading-[160%] text-[#111B18] dark:text-gray-50 ${
                        elevatedHeader || relaxedHeader ? "text-lg sm:text-[18px]" : "text-base sm:text-[16px]"
                    }`}
                >
                    {title}
                </h1>
                <div className={relaxedHeader ? "w-10" : "w-9"} aria-hidden />
            </header>

            {subtitle && (
                <p
                    className={`mx-auto w-full max-w-lg px-4 pt-4 text-sm font-bold leading-[160%] text-[#111B18] dark:text-gray-200 sm:max-w-2xl sm:px-5 sm:text-[14px] lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl ${
                        subtitleAlign === "start" ? "text-start" : "text-center"
                    }`}
                >
                    {subtitle}
                </p>
            )}

            <main
                className={`w-full flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 ${
                    subtitle ? "pb-6 pt-3" : relaxedHeader ? "pb-8 pt-2" : "py-4"
                } ${mainClassName}`}
            >
                {children}
            </main>

            {footer && (
                <footer
                    className={`sticky bottom-0 bg-white px-4 pb-2 dark:bg-gray-950 sm:px-5 md:px-6 lg:px-8 ${
                        showFooterBorder ? "border-t border-gray-100 dark:border-gray-800" : ""
                    } ${footerClassName}`}
                >
                    <div className="mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
                        {footer}
                    </div>
                </footer>
            )}
        </div>
    );
}
