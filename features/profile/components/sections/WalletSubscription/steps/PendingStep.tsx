"use client";

import { Clock, Phone } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/features/language/useLanguage";
import { WalletStepper } from "@/features/profile/components/shared/wallet/WalletStepper";

interface PendingStepProps {
    onViewContract: () => void;
    onContactSupport: () => void;
}

export function PendingStep({ onViewContract, onContactSupport }: PendingStepProps) {
    const { isArabic, locale } = useLanguage();

    return (
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 py-6 sm:max-w-2xl lg:max-w-3xl" lang={locale}>
            <div className="flex items-center justify-center">
                <Image
                    src="/profile/wallet-hourglass.png"
                    alt={isArabic ? "قيد المراجعة" : "Under review"}
                    width={188}
                    height={196}
                    className="h-auto w-40 object-contain sm:w-[188px] md:w-52"
                />
            </div>

            <div className="flex max-w-xl flex-col items-center gap-3 px-4">
                <h2 className="text-center text-[18px] font-bold text-[#111B18] dark:text-gray-100 sm:text-xl">
                    {isArabic ? "طلبك قيد المراجعة النهائية" : "Your request is under final review"}
                </h2>
                <p className="text-center text-[15px] font-medium leading-relaxed text-[#111B18] dark:text-gray-300 sm:text-[16px]">
                    {isArabic
                        ? "سيتم تحديد الحد الائتماني وتفعيل المحفظة خلال 24 - 48 ساعة سنقوم باشعارك فور الانتهاء"
                        : "Your credit limit will be set and the wallet will be activated within 24-48 hours. We will notify you as soon as it is complete."}
                </p>
            </div>

            <div className="w-full px-0 sm:px-2">
                <WalletStepper currentStep="pending" variant="pending" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <Clock className="h-6 w-6 text-[#555555] dark:text-gray-400" strokeWidth={1.5} />
                <span className="text-[15px] font-medium text-[#555555] dark:text-gray-400 sm:text-[16px]">
                    {isArabic ? "الوقت المتبقي 24 - 48 ساعة عمل" : "Remaining time: 24-48 business hours"}
                </span>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={onViewContract}
                    className="min-h-[48px] w-full rounded-xl bg-[#30913F] px-4 text-[16px] font-bold text-white active:bg-[#267332] sm:min-h-[52px]"
                >
                    {isArabic ? "استعراض العقد" : "Review contract"}
                </button>
                <button
                    type="button"
                    onClick={onContactSupport}
                    className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#F6F6F6] px-4 text-[16px] font-bold text-[#43474F] active:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:active:bg-gray-700"
                >
                    <Phone className="h-6 w-6 text-[#43474F] dark:text-gray-300" strokeWidth={1.5} />
                    <span>{isArabic ? "تواصل مع خدمة العملاء" : "Contact customer support"}</span>
                </button>
            </div>
        </div>
    );
}
