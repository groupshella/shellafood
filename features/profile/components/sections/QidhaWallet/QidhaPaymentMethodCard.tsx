"use client";

import { useLanguage } from "@/features/language/useLanguage";
import type { QidhaPaymentMethod } from "@/features/profile/types/qidha.types";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

function MethodLogo({ id }: { id: QidhaPaymentMethod["id"] }) {
    if (id === "stc_pay") {
        return (
            <span className="rounded-[4px] bg-[#4F008C] px-2 py-1 text-[10px] font-bold text-white">
                stc pay
            </span>
        );
    }
    if (id === "visa_master") {
        return (
            <div className="flex items-center gap-1">
                <span className="flex h-5 w-7 items-center justify-center rounded-[3px] bg-[#EB001B]/15 text-[7px] font-black text-[#EB001B]">
                    MC
                </span>
                <span className="flex h-5 w-8 items-center justify-center rounded-[3px] bg-[#1A1F71]/10 text-[7px] font-black text-[#1A1F71]">
                    VISA
                </span>
            </div>
        );
    }
    return (
        <span className="rounded-[4px] bg-[#00A651] px-2 py-1 text-[10px] font-bold text-white">
            mada
        </span>
    );
}

export function QidhaPaymentMethodCard({
    method,
    selected,
    onSelect,
}: {
    method: QidhaPaymentMethod;
    selected: boolean;
    onSelect: () => void;
}) {
    const { isArabic } = useLanguage();

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            aria-label={method.label}
            className={[
                "flex h-[88px] w-[112px] shrink-0 flex-col items-center justify-center gap-2 rounded-[12px] border px-2 transition-colors sm:h-[96px] sm:w-[120px]",
                selected
                    ? "border-[#30913F] bg-[#EBFEEB] dark:bg-[#30913F]/15"
                    : "border-[#E8ECEF] bg-white dark:border-gray-700 dark:bg-gray-800",
            ].join(" ")}
        >
            <MethodLogo id={method.id} />
            <span
                className="text-center text-[11px] font-bold leading-tight text-[#111B18] dark:text-gray-100 sm:text-[12px]"
                style={TAJAWAL}
            >
                {method.sublabel ?? method.label}
            </span>
            <span className="sr-only">
                {isArabic ? "اختر طريقة الدفع" : "Choose payment method"}
            </span>
        </button>
    );
}
