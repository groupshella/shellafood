"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import {
    WALLET_PAYMENT_METHODS,
    WALLET_QUICK_AMOUNTS,
    WALLET_STRINGS,
} from "@/features/profile/constants/wallet.strings";
import type { WalletPaymentMethodId } from "@/features/profile/types/wallet.types";
import { useNotification } from "@/shared/components/NotificationToast";
import { SarIcon } from "./shared/SarIcon";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

function PaymentLogo({ id }: { id: WalletPaymentMethodId }) {
    if (id === "visa_master") {
        return (
            <div className="flex items-center gap-1" aria-hidden>
                <span className="flex h-5 w-8 items-center justify-center rounded-[3px] bg-[#EB001B]/15 text-[8px] font-black text-[#EB001B]">
                    MC
                </span>
                <span className="flex h-5 w-8 items-center justify-center rounded-[3px] bg-[#1A1F71]/10 text-[8px] font-black text-[#1A1F71]">
                    VISA
                </span>
            </div>
        );
    }
    if (id === "stc_pay") {
        return (
            <span
                className="rounded-[4px] bg-[#4F008C] px-1.5 py-0.5 text-[9px] font-bold text-white"
                aria-hidden
            >
                stc
            </span>
        );
    }
    if (id === "mada") {
        return (
            <span
                className="rounded-[4px] bg-[#00A651] px-1.5 py-0.5 text-[9px] font-bold text-white"
                aria-hidden
            >
                mada
            </span>
        );
    }
    return (
        <span
            className="rounded-[4px] bg-black px-1.5 py-0.5 text-[9px] font-bold text-white dark:bg-gray-100 dark:text-black"
            aria-hidden
        >
            Pay
        </span>
    );
}

export function AddBalanceClient() {
    const [amount, setAmount] = useState(0);
    const [method, setMethod] = useState<WalletPaymentMethodId>("visa_master");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { success, error } = useNotification();

    function handleAddFund() {
        if (amount <= 0) return;
        startTransition(async () => {
            try {
                const res = await fetch("/api/profile/wallet/add-fund", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, payment_method: method }),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    error(json?.message ?? "فشل في إضافة الرصيد");
                    return;
                }
                success("تمت إضافة الرصيد بنجاح");
                router.push("/profile/wallet");
                router.refresh();
            } catch {
                error("فشل في إضافة الرصيد");
            }
        });
    }

    const displayAmount = useMemo(() => {
        if (!amount) return "00";
        return String(amount);
    }, [amount]);

    return (
        <ProfileSubpageShell
            title={WALLET_STRINGS.addBalanceTitle}
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
                        {isPending ? "جاري الإضافة..." : WALLET_STRINGS.addBalance}
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
                        {WALLET_STRINGS.amountQuestion}
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

                <section className="flex flex-col gap-3">
                    <h2
                        className="text-start text-[16px] font-bold text-[#111B18] dark:text-gray-100"
                        style={TAJAWAL}
                    >
                        {WALLET_STRINGS.paymentMethods}
                    </h2>

                    <div className="flex flex-col gap-2.5">
                        {WALLET_PAYMENT_METHODS.map((option) => {
                            const selected = method === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setMethod(option.id)}
                                    className="flex w-full items-center gap-3 rounded-[12px] border border-[#F6F5F8] bg-white px-3 py-3.5 text-start transition-colors dark:border-gray-700 dark:bg-gray-800 sm:px-4"
                                    aria-pressed={selected}
                                >
                                    <span
                                        className={[
                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                                            selected
                                                ? "border-[#111B18] dark:border-gray-100"
                                                : "border-[#C6C8CE] dark:border-gray-500",
                                        ].join(" ")}
                                        aria-hidden
                                    >
                                        {selected && (
                                            <span className="h-2.5 w-2.5 rounded-full bg-[#111B18] dark:bg-gray-100" />
                                        )}
                                    </span>

                                    <span
                                        className="min-w-0 flex-1 text-[14px] font-bold text-[#111B18] dark:text-gray-100 sm:text-[15px]"
                                        style={TAJAWAL}
                                    >
                                        {option.label}
                                    </span>

                                    <PaymentLogo id={option.id} />
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </ProfileSubpageShell>
    );
}
