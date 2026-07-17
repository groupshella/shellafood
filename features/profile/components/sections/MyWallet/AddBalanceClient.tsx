"use client";

import { useMemo, useState, useTransition } from "react";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import {
    WALLET_QUICK_AMOUNTS,
    WALLET_STRINGS,
} from "@/features/profile/constants/wallet.strings";
import type { WalletAddFundResponse } from "@/features/profile/types/wallet.types";
import type { ApiResponse } from "@/shared/lib/api-response";
import { useNotification } from "@/shared/components/NotificationToast";
import { SarIcon } from "./shared/SarIcon";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

export function AddBalanceClient({ isArabic = true }: { isArabic?: boolean }) {
    const [amount, setAmount] = useState(0);
    const [isPending, startTransition] = useTransition();
    const { error } = useNotification();

    function handleAddFund() {
        if (amount <= 0) return;
        startTransition(async () => {
            try {
                const res = await fetch("/api/profile/wallet/add-fund", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        lang: isArabic ? "ar" : "en",
                    },
                    body: JSON.stringify({
                        amount,
                        payment_method: "myfatoorah",
                        payment_platform: "web",
                        callback: `${window.location.origin}/profile/wallet/payment/return`,
                    }),
                });
                const fallback = isArabic
                    ? "تعذر إكمال إضافة الرصيد حالياً. حاول مرة أخرى."
                    : "Could not start wallet top-up right now. Please try again.";
                let json: ApiResponse<WalletAddFundResponse> | null = null;
                try {
                    json = (await res.json()) as ApiResponse<WalletAddFundResponse>;
                } catch {
                    error(fallback);
                    return;
                }
                if (!json || !res.ok || !json.success) {
                    const apiMessage =
                        json && !json.success && typeof json.message === "string"
                            ? json.message.trim()
                            : "";
                    error(apiMessage || fallback);
                    return;
                }
                const paymentUrl = json.data.payment_url ?? json.data.paymentUrl;
                if (!paymentUrl) {
                    error(isArabic ? "لم يتم استلام رابط الدفع" : "Payment URL was not returned");
                    return;
                }
                let redirectUrl: URL;
                try {
                    redirectUrl = new URL(paymentUrl);
                    if (!["http:", "https:"].includes(redirectUrl.protocol)) throw new Error();
                } catch {
                    error(isArabic ? "رابط الدفع المستلم غير صالح" : "The returned payment URL is invalid");
                    return;
                }
                const invoiceId = json.data.invoice_id ?? json.data.invoiceId;
                const paymentId = json.data.payment_id ?? json.data.paymentId;
                if (invoiceId != null) sessionStorage.setItem("wallet_invoice_id", String(invoiceId));
                if (paymentId != null) sessionStorage.setItem("wallet_payment_id", String(paymentId));
                window.location.assign(redirectUrl.href);
            } catch {
                error(
                    isArabic
                        ? "تعذر إكمال إضافة الرصيد حالياً. حاول مرة أخرى."
                        : "Could not start wallet top-up right now. Please try again.",
                );
            }
        });
    }

    const displayAmount = useMemo(() => {
        if (!amount) return "00";
        return String(amount);
    }, [amount]);

    return (
        <ProfileSubpageShell
            title={
                isArabic
                    ? WALLET_STRINGS.addBalanceTitle.ar
                    : WALLET_STRINGS.addBalanceTitle.en
            }
            relaxedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
            mainClassName="bg-white dark:bg-gray-950 pb-4"
            footer={
                <div className="pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                    <button
                        type="button"
                        disabled={amount <= 0 || isPending}
                        onClick={handleAddFund}
                        className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#30913F] text-[15px] font-bold text-white transition-opacity enabled:active:opacity-90 disabled:opacity-50 sm:h-[52px] sm:text-[16px]"
                        style={TAJAWAL}
                    >
                        {isPending
                            ? isArabic
                                ? "جاري الإضافة..."
                                : "Adding..."
                            : isArabic
                              ? WALLET_STRINGS.addBalance.ar
                              : WALLET_STRINGS.addBalance.en}
                    </button>
                </div>
            }
        >
            <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 md:max-w-[520px]">
                <section className="flex flex-col gap-3">
                    <p
                        className="text-start text-[14px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[15px]"
                        style={TAJAWAL}
                    >
                        {isArabic
                            ? WALLET_STRINGS.amountQuestion.ar
                            : WALLET_STRINGS.amountQuestion.en}
                    </p>

                    <div className="flex h-[72px] items-center justify-center gap-2 rounded-[12px] bg-[#F6F5F8] dark:bg-gray-800">
                        <SarIcon
                            width={22}
                            height={24}
                            className="text-[#111B18] dark:text-gray-100"
                        />
                        <span
                            className="text-[clamp(28px,8vw,36px)] font-bold tabular-nums text-[#111B18] dark:text-gray-100"
                            style={AFACAD}
                        >
                            {displayAmount}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {WALLET_QUICK_AMOUNTS.map((preset) => {
                            const selected = amount === preset;
                            return (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset)}
                                    className={[
                                        "flex h-11 items-center justify-center gap-1 rounded-[10px] text-[14px] font-bold transition-colors sm:h-12",
                                        selected
                                            ? "bg-[#30913F] text-white"
                                            : "bg-[#F6F5F8] text-[#111B18] dark:bg-gray-800 dark:text-gray-100",
                                    ].join(" ")}
                                    style={TAJAWAL}
                                >
                                    <SarIcon
                                        width={14}
                                        height={15}
                                        className={
                                            selected
                                                ? "text-white"
                                                : "text-[#111B18] dark:text-gray-100"
                                        }
                                    />
                                    {preset}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <p className="rounded-[12px] bg-[#F6F5F8] p-4 text-center text-sm text-[#707784] dark:bg-gray-800 dark:text-gray-300">
                    {isArabic
                        ? "سيتم تحويلك إلى بوابة MyFatoorah الآمنة لإكمال الدفع."
                        : "You will be redirected to the secure MyFatoorah gateway to complete payment."}
                </p>
            </div>
        </ProfileSubpageShell>
    );
}
