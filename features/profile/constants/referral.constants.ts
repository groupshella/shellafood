import type { ReferralData } from "@/features/profile/types/referral.types";

function dateOffset(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/** Mock invite-friends data — replace with API when backend is ready. */
export function getMockReferralData(_userId: number): ReferralData {
    return {
        referralLink: "http://shallamahk.me/lnk",
        rewardPerReferral: 10,
        stats: {
            totalInvites: 15,
            totalRewards: 150,
        },
        entries: [
            { id: "1", name: "اسم الشخص", status: "pending", createdAt: dateOffset(0) },
            { id: "2", name: "اسم الشخص", status: "registered", reward: 10, createdAt: dateOffset(0) },
            { id: "3", name: "اسم الشخص", status: "pending", createdAt: dateOffset(-1) },
            { id: "4", name: "اسم الشخص", status: "registered", reward: 10, createdAt: dateOffset(-1) },
            { id: "5", name: "اسم الشخص", status: "registered", reward: 10, createdAt: "2026-06-21" },
            { id: "6", name: "اسم الشخص", status: "pending", createdAt: "2026-06-21" },
        ],
    };
}
