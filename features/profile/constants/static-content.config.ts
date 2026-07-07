import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import type { StaticContentPageConfig } from "@/features/profile/types/static-content.types";

export const STATIC_CONTENT_PAGES = {
    aboutUs: {
        slug: "about-us",
        title: PROFILE_STRINGS.aboutUs,
    },
    privacyPolicy: {
        slug: "privacy-policy",
        title: PROFILE_STRINGS.privacy,
    },
    refundPolicy: {
        slug: "refund-policy",
        title: PROFILE_STRINGS.refundPolicy,
    },
    termsAndConditions: {
        slug: "terms-and-conditions",
        title: PROFILE_STRINGS.terms,
    },
} as const satisfies Record<string, StaticContentPageConfig>;
