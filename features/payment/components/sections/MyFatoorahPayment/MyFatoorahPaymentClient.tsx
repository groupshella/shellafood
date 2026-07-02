// features/payment/components/sections/MyFatoorahPayment/MyFatoorahPaymentClient.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useCreatePaymentSession } from "@/features/payment/hooks/useCreatePaymentSession";
import { useCheckPaymentStatus } from "@/features/payment/hooks/useCheckPaymentStatus";
import { PaymentSummary } from "./PaymentSummary";
import { SavedCardsList } from "./SavedCardsList";
import { CardWidget, type CardWidgetHandle } from "./CardWidget";
import { CvvWidget, type CvvWidgetHandle } from "./CvvWidget";
import { PaymentStatusView } from "./PaymentStatusView";
import type {
    CheckStatusRequest,
    CreateSessionData,
    CreateSessionRequest,
    MyFatoorahCallbackResponse,
    PaymentScreenStatus,
} from "@/features/payment/types/payment.types";

interface MyFatoorahPaymentClientProps {
    orderId: number;
    amount: number;
    currency: string;
    language: CreateSessionRequest["language"];
    isGuest: boolean;
}

export function MyFatoorahPaymentClient({
    orderId,
    amount,
    currency,
    language,
    isGuest,
}: MyFatoorahPaymentClientProps) {
    const router = useRouter();
    const { createSession } = useCreatePaymentSession();
    const { checkStatus } = useCheckPaymentStatus();

    const [status, setStatus] = useState<PaymentScreenStatus>("creating_session");
    const [sessionData, setSessionData] = useState<CreateSessionData | null>(null);
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [saveCard, setSaveCard] = useState(!isGuest);
    const [sessionError, setSessionError] = useState<string | null>(null);

    const cardWidgetRef = useRef<CardWidgetHandle>(null);
    const cvvWidgetRef = useRef<CvvWidgetHandle>(null);
    const isInitialMount = useRef(true);

    const startSession = useCallback(async () => {
        setStatus("creating_session");
        setSessionError(null);
        setSessionData(null);
        setSelectedToken(null);

        try {
            const data = await createSession({
                order_id: orderId,
                amount,
                currency,
                language,
                save_card: isGuest ? false : saveCard,
                retrieve_saved_tokens: !isGuest,
                supported_payment_methods: ["card"],
            });
            setSessionData(data);
            if (data.saved_cards.length === 1) {
                setSelectedToken(data.saved_cards[0].token);
            }
            setStatus("widget_loading");
        } catch {
            setSessionError("تعذر إنشاء جلسة الدفع، يرجى المحاولة مرة أخرى");
            setStatus("failed");
        }
    }, [amount, createSession, currency, isGuest, language, orderId, saveCard]);

    useEffect(() => {
        startSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // save_card is part of the session request — recreate when the user toggles it.
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (!isGuest) {
            startSession();
        }
    }, [isGuest, saveCard, startSession]);

    const resolvePaymentStatus = useCallback(
        async (response: MyFatoorahCallbackResponse) => {
            setStatus("checking_status");

            let key = "";
            let keyType: CheckStatusRequest["key_type"];

            if (response.paymentId) {
                key = response.paymentId;
                keyType = "PaymentId";
            } else if (response.invoiceId) {
                key = String(response.invoiceId);
                keyType = "InvoiceId";
            } else if (response.customerReference) {
                key = response.customerReference;
                keyType = "CustomerReference";
            } else {
                setStatus("failed");
                return;
            }

            try {
                const result = await checkStatus({ key_type: keyType, key });
                if (result.invoice_status === "Paid") {
                    setStatus("success");
                } else if (result.invoice_status === "Pending") {
                    setStatus("pending");
                } else {
                    setStatus("failed");
                }
            } catch {
                setStatus("failed");
            }
        },
        [checkStatus]
    );

    const handleCardCallback = useCallback(
        (response: MyFatoorahCallbackResponse) => {
            if (!response.paymentCompleted) {
                setStatus("failed");
                return;
            }
            resolvePaymentStatus(response);
        },
        [resolvePaymentStatus]
    );

    const handleCvvResult = useCallback(
        (isSuccess: boolean) => {
            if (!isSuccess || !sessionData) {
                setStatus("failed");
                return;
            }
            resolvePaymentStatus({
                paymentCompleted: true,
                customerReference: sessionData.customer_reference,
            });
        },
        [resolvePaymentStatus, sessionData]
    );

    const handlePayClick = () => {
        setStatus("processing");
        if (selectedToken) {
            cvvWidgetRef.current?.submit();
        } else {
            cardWidgetRef.current?.submit();
        }
    };

    const handleWidgetReady = () => setStatus("ready");
    const handleWidgetLoadError = () => {
        setSessionError("تعذر تحميل نموذج الدفع");
        setStatus("failed");
    };

    if (status === "success" || status === "pending" || status === "failed") {
        return (
            <PaymentStatusView
                status={status}
                onRetry={startSession}
                onViewOrder={() => router.push(`/my-orders/${orderId}`)}
            />
        );
    }

    return (
        <div>
            <PaymentSummary
                amount={sessionData?.amount ?? amount}
                currency={sessionData?.currency ?? currency}
                sessionExpiry={sessionData?.session_expiry}
                language={language}
            />

            {sessionError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" strokeWidth={2} />
                    <p className="flex-1 text-[13px] text-red-700">{sessionError}</p>
                </div>
            )}

            {status === "creating_session" && (
                <div className="animate-pulse space-y-3">
                    <div className="h-20 rounded-xl bg-gray-200" />
                    <div className="h-40 rounded-xl bg-gray-200" />
                </div>
            )}

            {sessionData && (
                <>
                    <SavedCardsList
                        cards={sessionData.saved_cards}
                        selectedToken={selectedToken}
                        onSelect={(token) => {
                            setSelectedToken(token);
                            setStatus("widget_loading");
                        }}
                    />

                    {selectedToken ? (
                        <CvvWidget
                            ref={cvvWidgetRef}
                            sessionId={sessionData.session_id}
                            token={selectedToken}
                            currency={currency}
                            language={language}
                            onResult={handleCvvResult}
                            onReady={handleWidgetReady}
                            onLoadError={handleWidgetLoadError}
                        />
                    ) : (
                        <CardWidget
                            ref={cardWidgetRef}
                            sessionId={sessionData.session_id}
                            amount={amount}
                            currency={currency}
                            language={language}
                            onCallback={handleCardCallback}
                            onReady={handleWidgetReady}
                            onLoadError={handleWidgetLoadError}
                        />
                    )}

                    {!selectedToken && !isGuest && sessionData.save_card_available && (
                        <label className="mt-3 flex items-center gap-2 text-[13px] text-gray-700">
                            <input
                                type="checkbox"
                                checked={saveCard}
                                onChange={(e) => setSaveCard(e.target.checked)}
                                className="h-4 w-4 accent-[#30913F]"
                            />
                            حفظ البطاقة للاستخدام في عمليات الدفع القادمة
                        </label>
                    )}

                    <button
                        type="button"
                        onClick={handlePayClick}
                        disabled={status !== "ready"}
                        className="mt-5 w-full rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332] disabled:opacity-50"
                    >
                        {status === "processing" || status === "checking_status" ? "جاري الدفع..." : "ادفع الآن"}
                    </button>

                    <p className="mt-4 text-center text-[11px] text-gray-400">Powered by MyFatoorah</p>
                </>
            )}
        </div>
    );
}
