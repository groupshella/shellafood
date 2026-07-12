import type { ReferralStats } from "@/features/profile/types/referral.types";
import { useLanguage } from "@/features/language/useLanguage";

interface ReferralStatsCardProps {
    stats: ReferralStats;
}

export function ReferralStatsCard({ stats }: ReferralStatsCardProps) {
    const { isArabic } = useLanguage();

    return (
        <div
            className="relative min-h-[88px] w-full overflow-hidden rounded-2xl sm:min-h-[104px]"
            style={{
                background: "linear-gradient(135deg, #30913F 0%, #3EC856 100%)",
            }}
        >
            <div
                className="pointer-events-none absolute -end-4 -top-4 h-20 w-20 rounded-full bg-white/[0.08]"
                aria-hidden
            />

            <div className="relative grid min-h-[88px] grid-cols-2 items-center sm:min-h-[104px]">
                <div className="flex min-w-0 flex-col items-center justify-center px-2">
                    <div className="flex items-center gap-1">
                        <span className="text-[clamp(30px,9vw,38px)] font-extrabold leading-none text-white sm:text-[42px]">
                            {stats.totalRewards}
                        </span>
                        <span className="text-[14px] font-medium leading-none text-white sm:text-[16px]">
                            {stats.currency ?? "﷼"}
                        </span>
                    </div>
                    <p className="mt-1 text-center text-[12px] font-normal leading-snug text-white sm:text-[13px]">
                        {isArabic ? "إجمالي المكافآت" : "Total rewards"}
                    </p>
                </div>

                <div className="flex min-w-0 flex-col items-center justify-center px-2">
                    <span className="text-[clamp(30px,9vw,38px)] font-extrabold leading-none text-white sm:text-[42px]">
                        {stats.totalInvites}
                    </span>
                    <p className="mt-1 text-center text-[11.5px] font-normal leading-snug text-white sm:text-[13px]">
                        {isArabic ? "عدد الدعوات" : "Total invites"}
                    </p>
                </div>
            </div>
        </div>
    );
}
