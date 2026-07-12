"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/features/language/useLanguage";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { QIDHA_PAYMENT_METHODS } from "@/features/profile/constants/qidha.strings";
import type {
    QidhaPayOption,
    QidhaPaymentMethodId,
    QidhaWalletCard,
} from "@/features/profile/types/qidha.types";
import { useNotification } from "@/shared/components/NotificationToast";
import { QidhaCard } from "./QidhaCard";
import { QidhaPayOptionRow } from "./QidhaPayOptionRow";
import { QidhaPaymentMethodCard } from "./QidhaPaymentMethodCard";
import { SarIcon } from "./shared/SarIcon";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

interface QidhaWalletClientProps {
    card: QidhaWalletCard;
    fullAmountDue?: number;
    minimumAmountDue?: number;
}

export function QidhaWalletClient({
    card,
    fullAmountDue = 0,
    minimumAmountDue = 0,
}: QidhaWalletClientProps) {
    const { isArabic } = useLanguage();
    const [payOption, setPayOption] = useState<QidhaPayOption>("full");
    const [customAmount, setCustomAmount] = useState("");
    const [method, setMethod] = useState<QidhaPaymentMethodId>("stc_pay");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { success, error } = useNotification();

    const payAmount = useMemo(() => {
        if (payOption === "full") return fullAmountDue;
        if (payOption === "minimum") return minimumAmountDue;
        const parsed = Number.parseFloat(customAmount);
        return Number.isFinite(parsed) ? parsed : 0;
    }, [payOption, fullAmountDue, minimumAmountDue, customAmount]);

    const canPay = payAmount > 0;

    function handlePay() {
        if (!canPay) return;
        startTransition(async () => {
            try {
                const res = await fetch("/api/profile/qidha/pay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: payAmount, payment_method: method }),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    error(
                        json?.message ??
                            (isArabic
                                ? "فشلت عملية الدفع"
                                : "Payment failed"),
                    );
                    return;
                }
                success(
                    isArabic
                        ? "تمت عملية الدفع بنجاح"
                        : "Payment completed successfully",
                );
                router.refresh();
            } catch {
                error(isArabic ? "فشلت عملية الدفع" : "Payment failed");
            }
        });
    }

    return (
        <ProfileSubpageShell
            title={isArabic ? "محفظة قيدها" : "Qidha wallet"}
            relaxedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
            mainClassName="bg-white dark:bg-gray-950 pb-4"
            footer={
                <div className="pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                    <button
                        type="button"
                        disabled={!canPay || isPending}
                        onClick={handlePay}
                        className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#30913F] text-[15px] font-bold text-white transition-opacity enabled:active:opacity-90 disabled:opacity-50 sm:h-[52px] sm:text-[16px]"
                        style={TAJAWAL}
                    >
                        {isPending
                            ? isArabic
                                ? "جاري الدفع..."
                                : "Paying..."
                            : isArabic
                              ? "ادفع الآن"
                              : "Pay now"}
                    </button>
                </div>
            }
        >
            <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 md:max-w-[520px]">
                <QidhaCard card={card} />

                <section className="flex flex-col gap-3">
                    <h2
                        className="text-start text-[16px] font-bold text-[#111B18] dark:text-gray-100"
                        style={TAJAWAL}
                    >
                        {isArabic ? "خيارات الدفع" : "Payment options"}
                    </h2>
                    <div className="flex flex-col gap-2.5">
                        <QidhaPayOptionRow
                            option="full"
                            amount={fullAmountDue}
                            selected={payOption === "full"}
                            onSelect={() => setPayOption("full")}
                        />
                        <QidhaPayOptionRow
                            option="minimum"
                            amount={minimumAmountDue}
                            selected={payOption === "minimum"}
                            onSelect={() => setPayOption("minimum")}
                        />
                    </div>
                </section>

                <section className="flex flex-col gap-2.5">
                    <h2
                        className="text-start text-[16px] font-bold text-[#111B18] dark:text-gray-100"
                        style={TAJAWAL}
                    >
                        {isArabic ? "أدخل مبلغ آخر" : "Enter another amount"}
                    </h2>
                    <label className="flex h-[52px] items-center gap-2 rounded-[12px] border border-[#E8ECEF] bg-white px-3 dark:border-gray-700 dark:bg-gray-800 sm:h-14 sm:px-4">
                        <SarIcon
                            width={16}
                            height={18}
                            className="shrink-0 text-[#111B18] dark:text-gray-100"
                        />
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.01"
                            placeholder="00.00"
                            value={customAmount}
                            onFocus={() => setPayOption("custom")}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setPayOption("custom");
                            }}
                            className="w-full bg-transparent text-end text-[18px] font-bold tabular-nums text-[#111B18] outline-none placeholder:text-[#C6C8CE] dark:text-gray-100 dark:placeholder:text-gray-500"
                            style={AFACAD}
                            aria-label={
                                isArabic
                                    ? "أدخل مبلغ آخر"
                                    : "Enter another amount"
                            }
                        />
                    </label>
                </section>

                <section className="flex flex-col gap-3">
                    <h2
                        className="text-start text-[16px] font-bold text-[#111B18] dark:text-gray-100"
                        style={TAJAWAL}
                    >
                        {isArabic
                            ? "اختر طريقة الدفع"
                            : "Choose payment method"}
                    </h2>
                    <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {QIDHA_PAYMENT_METHODS.map((item) => (
                            <QidhaPaymentMethodCard
                                key={item.id}
                                method={item}
                                selected={method === item.id}
                                onSelect={() => setMethod(item.id)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </ProfileSubpageShell>
    );
}
