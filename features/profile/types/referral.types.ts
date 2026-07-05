export type ReferralStatus = "pending" | "registered";

export type ReferralTab = "link" | "invited";

export interface ReferralEntry {
    id: string;
    name: string;
    status: ReferralStatus;
    reward?: number;
    createdAt: string;
}

export interface ReferralStats {
    totalInvites: number;
    totalRewards: number;
}

export interface ReferralData {
    referralLink: string;
    rewardPerReferral: number;
    stats: ReferralStats;
    entries: ReferralEntry[];
}

export interface InviteDateGroup {
    key: string;
    label: string;
    entries: ReferralEntry[];
}
