"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/features/language/useLanguage";

interface CheckoutBottomSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    ariaLabel: string;
    title?: string;
    showCloseButton?: boolean;
    children: ReactNode;
}

const SHEET_LAYOUT =
    "fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-white px-4 pt-3 shadow-2xl pb-[max(2.5rem,env(safe-area-inset-bottom))] dark:bg-gray-900 sm:max-w-2xl sm:px-5 md:max-w-xl lg:max-w-2xl";

export function CheckoutBottomSheet({
    isOpen,
    isVisible,
    onClose,
    ariaLabel,
    title,
    showCloseButton = false,
    children,
}: CheckoutBottomSheetProps) {
    const { isArabic } = useLanguage();
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 dark:bg-black/70"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal
                aria-label={ariaLabel}
                dir={isArabic ? "rtl" : "ltr"}
                className={SHEET_LAYOUT}
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />

                {(title || showCloseButton) && (
                    <div className="relative mb-4 flex items-center justify-center">
                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={isArabic ? "إغلاق" : "Close"}
                                className="absolute end-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors active:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 sm:h-10 sm:w-10"
                            >
                                <X className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} />
                            </button>
                        )}
                        {title && (
                            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-lg">{title}</h2>
                        )}
                    </div>
                )}

                {children}
            </div>
        </>
    );
}
