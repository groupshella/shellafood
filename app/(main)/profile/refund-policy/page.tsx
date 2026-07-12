import { Suspense } from "react";

import { RefundPolicy } from "@/features/profile/components/sections/StaticContent";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";

export const metadata = {
    title: `${PROFILE_STRINGS.refundPolicy} | شيلة فود`,
    description: "سياسة استرداد الأموال في شيلة فود",
};

export default function RefundPolicyPage() {
    return (
        <Suspense fallback={<RefundPolicy.skeleton />}>
            <RefundPolicy />
        </Suspense>
    );
}
