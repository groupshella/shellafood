import { Metadata } from "next";
import { LandingPage } from "@/features/landing-page";

export const metadata: Metadata = {
	title: "الوظائف والفرص المهنية | شلة فود",
	description:
		"انضم إلى فريق شلة فود واكتشف فرص العمل والوظائف المتاحة. نبحث عن مواهب في التوصيل، التقنية، التسويق، وخدمة العملاء. قدم طلبك اليوم.",
	keywords: [
		"وظائف",
		"فرص عمل",
		"شلة فود",
		"توظيف",
		"وظائف توصيل",
		"وظائف السعودية",
		"careers",
		"jobs",
		"انضم إلينا",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "الوظائف والفرص المهنية | شلة فود",
		description:
			"انضم إلى فريق شلة فود واكتشف فرص العمل والوظائف المتاحة في التوصيل والتقنية وخدمة العملاء.",
		type: "website",
		url: "https://shellafood.com/jobs",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/lanfingpage.jpg",
				width: 1200,
				height: 630,
				alt: "الوظائف - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "الوظائف والفرص المهنية | شلة فود",
		description:
			"انضم إلى فريق شلة فود واكتشف فرص العمل والوظائف المتاحة.",
		images: ["/lanfingpage.jpg"],
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
		canonical: "https://shellafood.com/jobs",
		languages: {
			"ar-SA": "https://shellafood.com/jobs",
			"en-US": "https://shellafood.com/jobs",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function JobsPage() {
	return <LandingPage />;
}
