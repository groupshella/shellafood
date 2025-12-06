import { Metadata } from "next";
import { PopularStoresPage } from '@/features/home';
import { TEST_STORES } from '@/lib/data/categories/testData';

export const metadata: Metadata = {
	title: "المتاجر الشائعة | شلة فود",
	description:
		"اكتشف أكثر المتاجر شعبية على شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات الأكثر طلباً. تصفية وترتيب حسب التقييم، وقت التوصيل والمزيد.",
	keywords: [
		"متاجر شائعة",
		"شلة فود",
		"مطاعم شائعة",
		"متاجر رائجة",
		"توصيل سريع",
		"متاجر",
		"تسوق أونلاين",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "المتاجر الشائعة | شلة فود",
		description:
			"اكتشف أكثر المتاجر شعبية على شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات الأكثر طلباً.",
		type: "website",
		url: "https://shellafood.com/popular-stores",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-popular-stores.jpg",
				width: 1200,
				height: 630,
				alt: "المتاجر الشائعة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المتاجر الشائعة | شلة فود",
		description:
			"اكتشف أكثر المتاجر شعبية على شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات الأكثر طلباً.",
		images: ["/og-popular-stores.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://shellafood.com/popular-stores",
		languages: {
			"ar-SA": "https://shellafood.com/popular-stores",
			"en-US": "https://shellafood.com/popular-stores",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function PopularStoresPageRoute() {
	return <PopularStoresPage stores={TEST_STORES} />;
}

