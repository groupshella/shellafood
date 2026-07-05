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
        <div className="flex min-h-screen flex-col bg-white " dir="rtl">
            <header
                className={`sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center bg-white ${elevatedHeader
                    ? "h-[70px] border-b border-[#F6F5F8] px-4 shadow-[0px_6px_25.1px_rgba(0,0,0,0.05)]"
                    : relaxedHeader
                        ? "px-5 pb-2 pt-6"
                        : "px-4 py-5"
                    } ${!elevatedHeader && showHeaderBorder ? "border-b border-gray-100" : ""}`}
            >
                <button
                    type="button"
                    onClick={handleBack}
                    aria-label="رجوع"
                    className={`-me-1 flex items-center justify-center rounded-full transition-colors active:bg-gray-100 ${elevatedHeader || relaxedHeader ? "h-10 w-10" : "h-9 w-9"
                        }`}
                >
                    <ChevronRight
                        className={`${elevatedHeader ? "text-[#111B18]" : "text-gray-800"} h-6 w-6`}
                        strokeWidth={elevatedHeader ? 1.5 : 1.75}
                    />
                </button>
                <h1
                    className={`truncate text-center font-bold leading-[160%] text-[#111B18] ${elevatedHeader || relaxedHeader ? "text-[18px]" : "text-[16px]"
                        }`}
                >
                    {title}
                </h1>
                <div className={relaxedHeader ? "w-10" : "w-9"} aria-hidden />
            </header>

            {subtitle && (
                <p
                    className={`px-4 pt-4 text-[14px] font-bold leading-[160%] text-[#111B18] ${subtitleAlign === "start" ? "text-start" : "text-center"
                        }`}
                >
                    {subtitle}
                </p>
            )}

            <main
                className={`flex-1 overflow-y-auto px-4 ${subtitle ? "pt-3 pb-6" : relaxedHeader ? "pb-8 pt-2" : "py-4"
                    } ${mainClassName}`}
            >
                {children}
            </main>

            {footer && (
                <footer
                    className={`sticky bottom-0 bg-white px-4 pb-2 ${showFooterBorder ? "border-t border-gray-100" : ""
                        } ${footerClassName}`}
                >
                    {footer}
                </footer>
            )}
        </div>
    );
}
