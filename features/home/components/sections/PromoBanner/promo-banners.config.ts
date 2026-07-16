import { OfferDiscountPercent } from "./OfferDiscountCard";

export interface PromoBannerItem {
	id: string;
	src: string;
	href: string;
	alt: { ar: string; en: string };
	external?: boolean;
	aspectClass: string;
}

export interface OfferDiscountItem {
	id: string;
	percent: OfferDiscountPercent;
	href: string;
}

export const OFFER_DISCOUNTS: OfferDiscountItem[] = [
	{ id: "offer-50", percent: 50, href: "/hyper-market?module_id=3" },
	{ id: "offer-35", percent: 35, href: "/hyper-market?module_id=3" },
	{ id: "offer-25", percent: 25, href: "/hyper-market?module_id=3" },
];

export const WEBSITE_BANNER: PromoBannerItem = {
	id: "shellah-services",
	src: "/home/banner.png",
	href: "https://www.shellaksa.com/",
	alt: {
		ar: "اكتشف خدمات أكثر عبر موقع شلّة — التوصيل، الجمال، التعليم، القانون، الصيانة",
		en: "Discover more services on the Shella website — delivery, beauty, education, legal, maintenance",
	},
	external: true,
	aspectClass: "aspect-[343/96]",
};
