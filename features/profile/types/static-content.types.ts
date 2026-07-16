export type StaticContentSlug =
	| "about-us"
	| "privacy-policy"
	| "refund-policy"
	| "terms-and-conditions";

export interface StaticContentResponse {
	success: boolean;
	data: {
		content: string;
	};
}

export interface StaticContentPageConfig {
	slug: StaticContentSlug;
	title: { ar: string; en: string };
}
