import { Metadata } from "next";
import { TEST_STORES } from '@/lib/data/categories/testData';
import { Store } from '@/shared/components';
import { NearbyStoresPage } from '@/features/home';

export const metadata: Metadata = {
	title: "المتاجر القريبة | شلة فود",
	description:
		"اكتشف جميع المتاجر القريبة منك مع شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات والمزيد. تصفية وترتيب حسب التقييم، وقت التوصيل والمزيد.",
	keywords: [
		"متاجر قريبة",
		"شلة فود",
		"مطاعم قريبة",
		"توصيل سريع",
		"متاجر",
		"تسوق أونلاين",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "المتاجر القريبة | شلة فود",
		description:
			"اكتشف جميع المتاجر القريبة منك مع شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات والمزيد.",
		type: "website",
		url: "https://shellafood.com/nearby-stores",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-nearby-stores.jpg",
				width: 1200,
				height: 630,
				alt: "المتاجر القريبة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المتاجر القريبة | شلة فود",
		description:
			"اكتشف جميع المتاجر القريبة منك مع شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات والمزيد.",
		images: ["/og-nearby-stores.jpg"],
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
		canonical: "https://shellafood.com/nearby-stores",
		languages: {
			"ar-SA": "https://shellafood.com/nearby-stores",
			"en-US": "https://shellafood.com/nearby-stores",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default async function NearbyStoresPageRoute() {
	const stores = TEST_STORES as Store[];
	return <NearbyStoresPage stores={stores} />;
}

