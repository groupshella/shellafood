import Image from "next/image";
import { Check, Timer, User } from "lucide-react";
import type { ReferralEntry } from "@/features/profile/types/referral.types";
import { useLanguage } from "@/features/language/useLanguage";

interface ReferralListItemProps {
    entry: ReferralEntry;
}

export function ReferralListItem({ entry }: ReferralListItemProps) {
    return (
        <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[#F6F5F8] py-2 dark:border-gray-700">
            <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F6F5F8] dark:bg-gray-800">
                    {entry.avatarUrl ? (
                        <Image
                            src={entry.avatarUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 object-cover"
                        />
                    ) : (
                        <User className="h-4 w-4 text-[#111B18] dark:text-gray-300" strokeWidth={1.5} />
                    )}
                </div>
                <span className="truncate text-[14px] font-bold text-[#111B18] dark:text-gray-100">{entry.name}</span>
            </div>

            <ReferralRowStatus entry={entry} />
        </div>
    );
}

function ReferralRowStatus({ entry }: { entry: ReferralEntry }) {
    const { isArabic } = useLanguage();

    if (entry.status === "pending") {
        return (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-[20px] bg-[#DFD3F5] p-1 dark:bg-purple-900/30">
                <Timer className="h-4 w-4 text-[#111B18] dark:text-purple-200" strokeWidth={1.5} />
                <span className="text-[12px] font-medium text-[#111B18] dark:text-purple-200">
                    {entry.statusLabel ?? (isArabic ? "انتظار" : "Pending")}
                </span>
            </span>
        );
    }

    return (
        <div className="flex shrink-0 flex-col items-start gap-1">
            {entry.reward != null && (
                <div className="flex items-center gap-0.5 text-[16px] font-medium text-[#30913F] dark:text-[#4db860]">
                    <span>+</span>
                    <span>{entry.rewardText ?? entry.reward}</span>
                    {!entry.rewardText && (
                        <span className="text-[14px]">﷼</span>
                    )}
                </div>
            )}
            <span className="inline-flex items-center gap-1 rounded-[20px] bg-[#EBFEEB] p-1 dark:bg-[#30913F]/15">
                <Check className="h-4 w-4 text-[#111B18] dark:text-[#4db860]" strokeWidth={2} />
                <span className="text-[12px] font-medium text-[#111B18] dark:text-gray-200">
                    {entry.statusLabel ?? (isArabic ? "تم التسجيل" : "Registered")}
                </span>
            </span>
        </div>
    );
}
