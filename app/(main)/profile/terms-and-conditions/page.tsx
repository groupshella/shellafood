import { Suspense } from "react";

import { TermsAndConditions } from "@/features/profile/components/sections/StaticContent";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";

export const metadata = {
    title: `${PROFILE_STRINGS.terms} | شيلة فود`,
    description: "الشروط والأحكام لاستخدام منصة شيلة فود",
};

export default function TermsAndConditionsPage() {
    return (
        <Suspense fallback={<TermsAndConditions.skeleton />}>
            <TermsAndConditions />
        </Suspense>
    );
}
