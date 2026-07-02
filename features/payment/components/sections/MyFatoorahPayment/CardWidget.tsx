// features/payment/components/sections/MyFatoorahPayment/CardWidget.tsx
"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { loadMyFatoorahScript } from "@/features/payment/lib/loadMyFatoorahScript";
import type { MyFatoorahCallbackResponse } from "@/features/payment/types/payment.types";

const CONTAINER_ID = "myfatoorah-payment-container";

export interface CardWidgetHandle {
    /**
     * The ONLY function our custom "Pay" button is allowed to call.
     * It tells the MyFatoorah widget to read whatever is currently typed
     * inside itself and process the payment. We never read those fields
     * ourselves.
     */
    submit: () => void;
}

interface CardWidgetProps {
    sessionId: string;
    amount: number;
    currency: string;
    language: "AR" | "EN";
    onCallback: (response: MyFatoorahCallbackResponse) => void;
    onReady: () => void;
    onLoadError: () => void;
}

export const CardWidget = forwardRef<CardWidgetHandle, CardWidgetProps>(function CardWidget(
    { sessionId, amount, currency, language, onCallback, onReady, onLoadError },
    ref
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounting, setIsMounting] = useState(true);

    useImperativeHandle(ref, () => ({
        submit: () => {
            // It is mandatory per MyFatoorah docs to call this exact function —
            // this is what actually reads the card fields and processes payment.
            window.myfatoorah?.submitCardPayment();
        },
    }));

    useEffect(() => {
        let cancelled = false;

        async function mountWidget() {
            try {
                await loadMyFatoorahScript();
                if (cancelled) return;

                window.myfatoorah?.init({
                    sessionId,
                    containerId: CONTAINER_ID,
                    amount,
                    currencyCode: currency,
                    language: language === "AR" ? "ar" : "en",
                    callback: onCallback,
                    shouldHandlePaymentUrl: true,
                    settings: {
                        // We use our own "Pay" button below instead of MyFatoorah's default one.
                        button: { useCustomButton: true },
                    },
                });

                setIsMounting(false);
                onReady();
            } catch {
                if (!cancelled) onLoadError();
            }
        }

        mountWidget();

        return () => {
            cancelled = true;
        };
        // Intentionally re-run only when the session actually changes,
        // since a new session_id means a fresh widget instance.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-3">
            {isMounting && (
                <div className="flex h-24 items-center justify-center text-[13px] text-gray-400">
                    جاري تحميل نموذج الدفع...
                </div>
            )}
            {/* MyFatoorah injects its secure card-input iframe(s) into this div.
                We never put our own <input> fields for card number/expiry/cvv here. */}
            <div id={CONTAINER_ID} ref={containerRef} />
        </div>
    );
});
