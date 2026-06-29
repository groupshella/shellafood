"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface CheckoutBottomSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    ariaLabel: string;
    title?: string;
    showCloseButton?: boolean;
    children: ReactNode;
}

export function CheckoutBottomSheet({
    isOpen,
    isVisible,
    onClose,
    ariaLabel,
    title,
    showCloseButton = false,
    children,
}: CheckoutBottomSheetProps) {
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
                className="fixed inset-0 z-40 bg-black/25 transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal
                aria-label={ariaLabel}
                dir="rtl"
                className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-[20px] bg-white px-5 pt-3 shadow-2xl pb-[max(2.5rem,env(safe-area-inset-bottom))]"
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200" />

                {(title || showCloseButton) && (
                    <div className="relative mb-4 flex items-center justify-center">
                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="إغلاق"
                                className="absolute start-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F5F8] text-gray-700 transition-colors active:bg-gray-200"
                            >
                                <X className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                        )}
                        {title && (
                            <h2 className="text-[16px] font-semibold text-gray-900">{title}</h2>
                        )}
                    </div>
                )}

                {children}
            </div>
        </>
    );
}
