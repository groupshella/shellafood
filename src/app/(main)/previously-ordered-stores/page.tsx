import { Metadata } from "next";
import { PreviouslyOrderedStoresPage } from '@/features/home';
import { TEST_STORES } from '@/lib/data/categories/testData';

export const metadata: Metadata = {
	title: "المتاجر التي طلبت منها | شلة فود",
	description:
		"تصفح المتاجر التي طلبت منها من قبل على شلة فود. أعد الطلب بسهولة من المتاجر التي طلبت منها سابقاً. تصفية حسب التقييم، وقت التوصيل والمزيد.",
	keywords: [
		"المتاجر التي طلبت منها",
		"شلة فود",
		"طلبات سابقة",
		"متاجر مسبقة",
		"إعادة الطلب",
		"متاجر",
		"تسوق أونلاين",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "المتاجر التي طلبت منها | شلة فود",
		description:
			"تصفح المتاجر التي طلبت منها من قبل على شلة فود. أعد الطلب بسهولة من المتاجر التي طلبت منها سابقاً.",
		type: "website",
		url: "https://shellafood.com/previously-ordered-stores",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-previously-ordered-stores.jpg",
				width: 1200,
				height: 630,
				alt: "المتاجر التي طلبت منها - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المتاجر التي طلبت منها | شلة فود",
		description:
			"تصفح المتاجر التي طلبت منها من قبل على شلة فود. أعد الطلب بسهولة من المتاجر التي طلبت منها سابقاً.",
		images: ["/og-previously-ordered-stores.jpg"],
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
		canonical: "https://shellafood.com/previously-ordered-stores",
		languages: {
			"ar-SA": "https://shellafood.com/previously-ordered-stores",
			"en-US": "https://shellafood.com/previously-ordered-stores",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function PreviouslyOrderedStoresPageRoute() {
	return <PreviouslyOrderedStoresPage stores={TEST_STORES} />;
}

