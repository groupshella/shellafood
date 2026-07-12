import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";
import type { InvitedFriendsApiResponse } from "@/features/profile/types/invited-friends.types";
import type { InvitedFriendsData } from "@/features/profile/types/referral.types";
import { mapInvitedFriendsResponse } from "@/features/profile/lib/mapInvitedFriends";

const DEFAULT_OFFSET = 1;
const DEFAULT_LIMIT = 10;

function emptyInvitedFriends(): InvitedFriendsData {
    return {
        summary: {
            totalInvites: 0,
            totalRewards: 0,
            currency: "﷼",
        },
        groups: [],
        pagination: {
            offset: DEFAULT_OFFSET,
            limit: DEFAULT_LIMIT,
            total_size: 0,
        },
    };
}

export async function getInvitedFriends(
    offset = DEFAULT_OFFSET,
    limit = DEFAULT_LIMIT,
): Promise<InvitedFriendsData> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    if (!token) return emptyInvitedFriends();

    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/customer/referrals/invited-friends?${params}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                moduleId: process.env.MODULE_ID ?? "3",
                zoneId: process.env.ZONE_ID!,
                "X-localization": isArabic ? "ar" : "en",
            },
            next: { revalidate: 0, tags: ["invited-friends"] },
        },
    );

    if (!res.ok) {
        if (res.status === 401) return emptyInvitedFriends();
        throw new Error(`Failed to fetch invited friends: ${res.status}`);
    }

    const json = await res.json();
    const payload = (json?.data ?? json) as InvitedFriendsApiResponse;

    return mapInvitedFriendsResponse(payload);
}
