import { Suspense } from "react";

import { RefundPolicy } from "@/features/profile/components/sections/StaticContent";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";

export const metadata = {
    title: PROFILE_STRINGS.refundPolicy,
};

export default function RefundPolicyPage() {
    return (
        <Suspense fallback={<RefundPolicy.skeleton />}>
            <RefundPolicy />
        </Suspense>
    );
}
