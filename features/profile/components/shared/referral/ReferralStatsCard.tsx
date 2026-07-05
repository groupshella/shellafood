import type { ReferralStats } from "@/features/profile/types/referral.types";
import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";

interface ReferralStatsCardProps {
    stats: ReferralStats;
}

export function ReferralStatsCard({ stats }: ReferralStatsCardProps) {
    return (
        <div
            className="relative h-[88px] w-full overflow-hidden rounded-2xl"
            style={{
                background: "linear-gradient(135deg, #30913F 0%, #3EC856 100%)",
            }}
        >
            <div
                className="pointer-events-none absolute -end-4 -top-4 h-20 w-20 rounded-full bg-white/[0.08]"
                aria-hidden
            />

            <div className="relative flex h-full items-center">
                <div className="flex flex-1 flex-col items-center justify-center">
                    <div className="flex items-center gap-1">
                        <span className="text-[38px] font-extrabold leading-none text-white">
                            {stats.totalRewards}
                        </span>
                        <span className="text-[16px] font-medium leading-none text-white">
                            {REFERRAL_STRINGS.currencySymbol}
                        </span>
                    </div>
                    <p className="mt-1 text-center text-[12px] font-normal leading-none text-white">
                        {REFERRAL_STRINGS.statsTotalRewards}
                    </p>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center">
                    <span className="text-[38px] font-extrabold leading-none text-white">
                        {stats.totalInvites}
                    </span>
                    <p className="mt-1 text-center text-[11.5px] font-normal leading-none text-white">
                        {REFERRAL_STRINGS.statsTotalInvites}
                    </p>
                </div>
            </div>
        </div>
    );
}
