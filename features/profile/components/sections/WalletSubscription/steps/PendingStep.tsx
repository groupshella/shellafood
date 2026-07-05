"use client";

import { Clock, Phone } from "lucide-react";
import Image from "next/image";
import { WalletStepper } from "@/features/profile/components/shared/wallet/WalletStepper";

interface PendingStepProps {
    onViewContract: () => void;
    onContactSupport: () => void;
}

export function PendingStep({ onViewContract, onContactSupport }: PendingStepProps) {
    return (
        <div className="flex flex-col items-center gap-6 py-6">
            {/* Hourglass illustration */}
            <div className="flex items-center justify-center">
                <Image
                    src="/profile/wallet-hourglass.png"
                    alt="قيد المراجعة"
                    width={188}
                    height={196}
                    className="object-contain"
                />
            </div>

            {/* Headline */}
            <div className="flex flex-col items-center gap-3 px-4">
                <h2 className="text-center text-[18px] font-bold text-[#111B18]">
                    طلبك قيد المراجعة النهائية
                </h2>
                <p className="text-center text-[16px] font-medium leading-relaxed text-[#111B18]">
                    سيتم تحديد الحد الائتماني وتفعيل المحفظة خلال 24 - 48 ساعة
                    سنقوم باشعارك فور الانتهاء
                </p>
            </div>

            {/* Pending stepper */}
            <div className="w-full px-2">
                <WalletStepper currentStep="pending" variant="pending" />
            </div>

            {/* Remaining time */}
            <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-[#555555]" strokeWidth={1.5} />
                <span className="text-[16px] font-medium text-[#555555]">
                    الوقت المتبقي 24 - 48 ساعة عمل
                </span>
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-col gap-3">
                <button
                    type="button"
                    onClick={onViewContract}
                    className="h-12 w-full rounded-xl bg-[#30913F] text-[16px] font-bold text-white active:bg-[#267332]"
                >
                    استعراض العقد
                </button>
                <button
                    type="button"
                    onClick={onContactSupport}
                    className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#F6F6F6] text-[16px] font-bold text-[#43474F] active:bg-gray-200"
                >
                    <Phone className="h-6 w-6 text-[#43474F]" strokeWidth={1.5} />
                    <span>تواصل مع خدمة العملاء</span>
                </button>
            </div>
        </div>
    );
}
