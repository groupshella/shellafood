import type { InvitedFriendsPaginationApi } from "@/features/profile/types/invited-friends.types";

export type ReferralStatus = "pending" | "registered";

export type ReferralTab = "link" | "invited";

export interface ReferralEntry {
    id: string;
    name: string;
    status: ReferralStatus;
    statusLabel?: string;
    reward?: number;
    rewardText?: string;
    avatarUrl?: string | null;
    createdAt: string;
    dateGroupKey?: string;
    dateGroupLabel?: string;
}

export interface ReferralStats {
    totalInvites: number;
    totalRewards: number;
    currency?: string;
}

export interface InviteDateGroup {
    key: string;
    label: string;
    entries: ReferralEntry[];
}

export interface InvitedFriendsData {
    summary: ReferralStats;
    groups: InviteDateGroup[];
    pagination: InvitedFriendsPaginationApi;
}

export interface ReferralLinkData {
    referralLink: string;
    rewardPerReferral: number;
}
