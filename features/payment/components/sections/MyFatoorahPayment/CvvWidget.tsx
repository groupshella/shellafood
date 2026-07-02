// features/payment/components/sections/MyFatoorahPayment/CvvWidget.tsx
"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { loadMyFatoorahScript } from "@/features/payment/lib/loadMyFatoorahScript";

const CVV_CONTAINER_ID = "myfatoorah-cvv-container";

export interface CvvWidgetHandle {
    submit: () => void;
}

interface CvvWidgetProps {
    sessionId: string;
    token: string; // the saved card's MyFatoorah token — never the PAN
    currency: string;
    language: "AR" | "EN";
    onResult: (isSuccess: boolean, error?: unknown) => void;
    onReady: () => void;
    onLoadError: () => void;
}

/**
 * Per MyFatoorah's "Tokenized Embedded Payments" flow: when a customer pays
 * with a previously saved card, only a CVV field is shown (the PAN stays
 * masked/hidden). This is a distinct widget from the full card-entry one.
 *
 * Note: this feature must be enabled on the MyFatoorah account by their
 * account manager before saved_cards/tokens will actually come back from
 * the session endpoint.
 */
export const CvvWidget = forwardRef<CvvWidgetHandle, CvvWidgetProps>(function CvvWidget(
    { sessionId, token, currency, language, onResult, onReady, onLoadError },
    ref
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounting, setIsMounting] = useState(true);

    useImperativeHandle(ref, () => ({
        submit: () => {
            window.myfatoorah?.submitCvv?.(token);
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
                    containerId: CVV_CONTAINER_ID,
                    currencyCode: currency,
                    language: language === "AR" ? "ar" : "en",
                    // The CVV callback below is what confirms whether the CVV
                    // itself was accepted — it is not the final payment status.
                    callback: (response) => {
                        onResult(Boolean(response?.isSuccess), response?.error);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, token]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-3">
            {isMounting && (
                <div className="flex h-16 items-center justify-center text-[13px] text-gray-400">
                    جاري تحميل نموذج CVV...
                </div>
            )}
            <div id={CVV_CONTAINER_ID} ref={containerRef} />
        </div>
    );
});
