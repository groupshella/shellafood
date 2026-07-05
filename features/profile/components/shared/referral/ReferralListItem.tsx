import { Check, Timer, User } from "lucide-react";
import type { ReferralEntry } from "@/features/profile/types/referral.types";
import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";

interface ReferralListItemProps {
    entry: ReferralEntry;
}

export function ReferralListItem({ entry }: ReferralListItemProps) {
    return (
        <div className="flex h-14 items-center justify-between border-b border-[#F6F5F8]">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F6F5F8]">
                    <User className="h-4 w-4 text-[#111B18]" strokeWidth={1.5} />
                </div>
                <span className="text-[14px] font-bold text-[#111B18]">{entry.name}</span>
            </div>

            <ReferralRowStatus entry={entry} />
        </div>
    );
}

function ReferralRowStatus({ entry }: { entry: ReferralEntry }) {
    if (entry.status === "pending") {
        return (
            <span className="inline-flex items-center gap-1 rounded-[20px] bg-[#DFD3F5] p-1">
                <Timer className="h-4 w-4 text-[#111B18]" strokeWidth={1.5} />
                <span className="text-[12px] font-medium text-[#111B18]">
                    {REFERRAL_STRINGS.statusPending}
                </span>
            </span>
        );
    }

    return (
        <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-0.5 text-[16px] font-medium text-[#30913F]">
                <span>+</span>
                <span>{entry.reward ?? 10}</span>
                <span className="text-[14px]">{REFERRAL_STRINGS.currencySymbol}</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-[20px] bg-[#EBFEEB] p-1">
                <Check className="h-4 w-4 text-[#111B18]" strokeWidth={2} />
                <span className="text-[12px] font-medium text-[#111B18]">
                    {REFERRAL_STRINGS.statusRegistered}
                </span>
            </span>
        </div>
    );
}
