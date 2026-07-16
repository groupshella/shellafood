import type { StaticContentPageConfig } from "@/features/profile/types/static-content.types";

export const STATIC_CONTENT_PAGES = {
	aboutUs: {
		slug: "about-us",
		title: { ar: "معلومات عنا", en: "About us" },
	},
	privacyPolicy: {
		slug: "privacy-policy",
		title: { ar: "الخصوصية", en: "Privacy" },
	},
	refundPolicy: {
		slug: "refund-policy",
		title: { ar: "سياسة استرداد الأموال", en: "Refund policy" },
	},
	termsAndConditions: {
		slug: "terms-and-conditions",
		title: { ar: "الشروط والأحكام", en: "Terms and conditions" },
	},
} as const satisfies Record<string, StaticContentPageConfig>;
