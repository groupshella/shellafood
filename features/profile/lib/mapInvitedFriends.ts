import { resolveProfileImageUrl } from "@/features/profile/lib/profile.lib";
import type {
    InvitedFriendApi,
    InvitedFriendsApiResponse,
} from "@/features/profile/types/invited-friends.types";
import type {
    InviteDateGroup,
    InvitedFriendsData,
    ReferralEntry,
    ReferralStatus,
} from "@/features/profile/types/referral.types";

function mapReferralStatus(status: string): ReferralStatus {
    const normalized = status.toLowerCase();
    if (normalized.includes("pending") || normalized.includes("wait")) {
        return "pending";
    }
    return "registered";
}

function mapInvitedFriend(friend: InvitedFriendApi): ReferralEntry {
    return {
        id: String(friend.user_id),
        name: friend.name,
        status: mapReferralStatus(friend.status),
        statusLabel: friend.status_label,
        reward: friend.reward_amount ?? undefined,
        rewardText: friend.reward_text ?? undefined,
        avatarUrl: resolveProfileImageUrl(friend.avatar_full_url),
        createdAt: friend.registered_at,
        dateGroupKey: friend.date_group_key,
        dateGroupLabel: friend.date_group_label,
    };
}

function groupInvitedFriends(friends: ReferralEntry[]): InviteDateGroup[] {
    const map = new Map<string, InviteDateGroup>();

    for (const entry of friends) {
        const key = entry.dateGroupKey ?? entry.createdAt.slice(0, 10);
        const existing = map.get(key);

        if (existing) {
            existing.entries.push(entry);
            continue;
        }

        map.set(key, {
            key,
            label: entry.dateGroupLabel ?? key,
            entries: [entry],
        });
    }

    return [...map.values()];
}

export function mapInvitedFriendsResponse(payload: InvitedFriendsApiResponse): InvitedFriendsData {
    const friends = (payload.friends ?? []).map(mapInvitedFriend);

    return {
        summary: {
            totalInvites: payload.summary?.total_invites ?? 0,
            totalRewards: payload.summary?.total_rewards ?? 0,
            currency: payload.summary?.currency ?? "﷼",
        },
        groups: groupInvitedFriends(friends),
        pagination: payload.pagination ?? {
            offset: 1,
            limit: 10,
            total_size: friends.length,
        },
    };
}
