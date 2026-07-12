import { Suspense } from "react";

import { PrivacyPolicy } from "@/features/profile/components/sections/StaticContent";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";

export const metadata = {
    title: `${PROFILE_STRINGS.privacy} | شيلة فود`,
    description: "سياسة الخصوصية وحماية بياناتك في شيلة فود",
};

export default function PrivacyPolicyPage() {
    return (
        <Suspense fallback={<PrivacyPolicy.skeleton />}>
            <PrivacyPolicy />
        </Suspense>
    );
}
