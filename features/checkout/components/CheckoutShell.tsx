"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CheckoutProvider, useCheckout } from "@/features/checkout/context/CheckoutContext";
import type { CheckoutData } from "@/features/checkout/types/checkout.types";

interface CheckoutShellProps {
    children: React.ReactNode;
    checkoutData: CheckoutData;
}

interface CheckoutShellInnerProps {
    children: React.ReactNode;
}

function CheckoutShellInner({ children }: CheckoutShellInnerProps) {
    const router = useRouter();
    const { confirmPayment } = useCheckout();

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-lg bg-white" dir="rtl">
            <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    aria-label="رجوع"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F5F8] transition-colors active:bg-gray-200"
                >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>

                <h1 className="text-[16px] font-semibold text-gray-900">الدفع</h1>

                <div className="h-9 w-9" />
            </header>

            <main className="space-y-5 px-4 py-4 pb-32">{children}</main>

            <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-lg bg-white px-4 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <button
                    type="button"
                    onClick={confirmPayment}
                    className="w-full rounded-xl bg-[#30913F] py-4 text-[15px] font-semibold text-white transition-colors active:bg-[#267332]"
                >
                    تأكيد الدفع
                </button>
            </div>
        </div>
    );
}

export function CheckoutShell({ children, checkoutData }: CheckoutShellProps) {
    return (
        <CheckoutProvider data={checkoutData}>
            <CheckoutShellInner>{children}</CheckoutShellInner>
        </CheckoutProvider>
    );
}
