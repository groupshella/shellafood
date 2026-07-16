import { getStaticContent } from "@/features/profile/api/static-content";
import { STATIC_CONTENT_PAGES } from "@/features/profile/constants/static-content.config";
import type { StaticContentPageConfig } from "@/features/profile/types/static-content.types";
import { StaticContentClient } from "./StaticContentClient";
import StaticContentSkeleton from "./skeleton";

function createStaticContentSection(config: StaticContentPageConfig) {
	return Object.assign(
		async function StaticContentSection({ isArabic }: { isArabic: boolean }) {
			const lang = isArabic ? "ar" : "en";
			const content = await getStaticContent(config.slug, lang);

			if (!content) return null;

			return (
				<StaticContentClient
					title={isArabic ? config.title.ar : config.title.en}
					content={content}
					isArabic={isArabic}
				/>
			);
		},
		{ skeleton: StaticContentSkeleton },
	);
}

export const AboutUs = createStaticContentSection(STATIC_CONTENT_PAGES.aboutUs);
export const PrivacyPolicy = createStaticContentSection(STATIC_CONTENT_PAGES.privacyPolicy);
export const RefundPolicy = createStaticContentSection(STATIC_CONTENT_PAGES.refundPolicy);
export const TermsAndConditions = createStaticContentSection(
	STATIC_CONTENT_PAGES.termsAndConditions,
);
