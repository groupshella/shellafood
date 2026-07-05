import type { AuthUser } from "@/features/auth/types/auth.types";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { InviteFriendsClient } from "@/features/profile/components/sections/InviteFriends/InviteFriendsClient";
import { getMockReferralData } from "@/features/profile/constants/referral.constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ReferralPage() {
    const cookieStore = await cookies();
    const rawUser = cookieStore.get(COOKIE_KEYS.USER)?.value;
    if (!rawUser) redirect("/auth");

    const user = JSON.parse(rawUser) as AuthUser;
    const data = getMockReferralData(user.id);

    return <InviteFriendsClient data={data} />;
}
