import { Suspense } from "react";

import { InviteFriends } from "@/features/profile/components/sections/InviteFriends";
import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";

export const metadata = {
    title: `${REFERRAL_STRINGS.pageTitle} | شيلة فود`,
    description: "ادعُ أصدقاءك واكسب نقاط ومكافآت مع شيلة فود",
};

export default function ReferralPage() {
    return (
        <Suspense fallback={<InviteFriends.skeleton />}>
            <InviteFriends />
        </Suspense>
    );
}
