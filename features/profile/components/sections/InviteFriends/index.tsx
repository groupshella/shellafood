import { getInvitedFriends } from "@/features/profile/api/invited-friends";
import { REFERRAL_LINK_FALLBACK } from "@/features/profile/constants/referral.constants";

import { InviteFriendsClient } from "./InviteFriendsClient";
import InviteFriendsSkeleton from "./skeleton";

export const InviteFriends = Object.assign(
    async function InviteFriends() {
        const invitedFriends = await getInvitedFriends();

        return (
            <InviteFriendsClient
                referralLink={REFERRAL_LINK_FALLBACK}
                invitedFriends={invitedFriends}
            />
        );
    },
    { skeleton: InviteFriendsSkeleton },
);
