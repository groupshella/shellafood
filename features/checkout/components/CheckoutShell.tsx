"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CheckoutProvider, useCheckout } from "@/features/checkout/context/CheckoutContext";
import type { CheckoutData } from "@/features/checkout/types/checkout.types";
interface CheckoutShellProps {
    children: React.ReactNode;
    checkoutData: CheckoutData;
    isArabic: boolean;
}

interface CheckoutShellInnerProps {
    children: React.ReactNode;
    isArabic: boolean;
}

const SHELL_LAYOUT =
    "relative mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-gray-50 dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6";
const CONTENT_PADDING = "px-3 py-4 pb-36 sm:px-4 sm:py-5 sm:pb-40 md:px-5 lg:px-6 lg:pb-44";
const FOOTER_PADDING = "px-3 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:pt-4 md:px-5 lg:px-6";

const CONFIRM_BUTTON_LABELS: Record<string, { ar: string, en: string }> = {
    "my-wallet": {
        "ar": "ادفع من محفظتي",
        "en": "Pay from my wallet",
    },
    "qidha-wallet": {
        "ar": "ادفع من محفظة قيدها",
        "en": "Pay from Qidha wallet",
    },
    "electronic": {
        "ar": "انتقل للدفع الإلكتروني",
        "en": "Go to electronic payment",
    },
};

function CheckoutShellInner({ children, isArabic }: CheckoutShellInnerProps) {
    const { confirmPayment, isPlacingOrder, orderError, selected } = useCheckout();
    const buttonLabel = isPlacingOrder
        ? isArabic ? "جاري تأكيد الطلب..." : "Placing order..."
        : (selected ? (CONFIRM_BUTTON_LABELS[selected]?.ar ?? CONFIRM_BUTTON_LABELS[selected]?.en ?? (isArabic ? "تأكيد الدفع" : "Confirm payment")) : (isArabic ? "تأكيد الدفع" : "Confirm payment"));

    return (
        <div className={SHELL_LAYOUT} dir={isArabic ? "rtl" : "ltr"}>
            <header className={`sticky top-0 z-10 flex items-center justify-between bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-gray-900 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)] ${HEADER_PADDING}`}>
                <Link
                    href="/cart"
                    aria-label={isArabic ? "رجوع" : "Return"}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors active:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:active:bg-gray-700 sm:h-11 sm:w-11"
                >
                    <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300 sm:h-[22px] sm:w-[22px]" />
                </Link>

                <h1 className="text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-lg lg:text-xl">{isArabic ? "الدفع" : "Payment"}</h1>

                <div className="h-10 w-10 sm:h-11 sm:w-11" aria-hidden />
            </header>

            <main className={`space-y-3 sm:space-y-4 lg:space-y-5 ${CONTENT_PADDING}`}>
                <div className="mx-auto w-full max-w-3xl space-y-3 sm:space-y-4 lg:max-w-none lg:space-y-5">
                    {children}
                </div>
            </main>

            <div className={`fixed inset-x-0 bottom-0 z-10 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:bg-gray-900 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)]`}>
                <div className={`mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl ${FOOTER_PADDING}`}>
                    {orderError && (
                        <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600 dark:bg-red-950/50 dark:text-red-400 sm:text-sm">
                            {orderError}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={confirmPayment}
                        disabled={isPlacingOrder}
                        className="w-full rounded-2xl bg-[#30913F] py-3.5 text-sm font-semibold text-white shadow-sm transition-colors active:bg-[#267332] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-[15px] lg:max-w-md lg:ms-auto lg:block"
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function CheckoutShell({ children, checkoutData, isArabic }: CheckoutShellProps) {
    return (
        <CheckoutProvider data={checkoutData} isArabic={isArabic}>
            <CheckoutShellInner isArabic={isArabic}>{children}</CheckoutShellInner>
        </CheckoutProvider>
    );
}
