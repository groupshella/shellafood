import { Suspense } from "react";

import { AboutUs } from "@/features/profile/components/sections/StaticContent";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";

export const metadata = {
    title: `${PROFILE_STRINGS.aboutUs} | شيلة فود`,
    description: "تعرّف على شيلة فود ورؤيتنا وخدماتنا",
};

export default function AboutUsPage() {
    return (
        <Suspense fallback={<AboutUs.skeleton />}>
            <AboutUs />
        </Suspense>
    );
}
