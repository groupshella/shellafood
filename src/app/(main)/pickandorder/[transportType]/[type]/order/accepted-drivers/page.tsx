import { Metadata } from "next";
import { AcceptedDriversPage } from "@/features/pick-and-order";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}): Promise<Metadata> {
	const { transportType, type } = await params;
	const isMotorbike = transportType === "motorbike";
	const isMultiDirection = type === "multi-direction";

	return {
		title: isMotorbike
			? `السائقون المقبولون - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
			: `السائقون المقبولون - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
		description: isMotorbike
			? "اختر السائق المناسب من السائقين المقبولين للدراجة النارية"
			: "اختر السائق المناسب من السائقين المقبولين للشاحنة",
		keywords: [
			"السائقون المقبولون",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: isMotorbike
				? `السائقون المقبولون - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `السائقون المقبولون - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "اختر السائق المناسب من السائقين المقبولين للدراجة النارية"
				: "اختر السائق المناسب من السائقين المقبولين للشاحنة",
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}/${type}/order/accepted-drivers`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: isMotorbike ? "السائقون المقبولون - دراجة نارية" : "السائقون المقبولون - شاحنة",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: isMotorbike
				? `السائقون المقبولون - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `السائقون المقبولون - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "اختر السائق المناسب من السائقين المقبولين للدراجة النارية"
				: "اختر السائق المناسب من السائقين المقبولين للشاحنة",
			images: ["/og-pickandorder.jpg"],
			creator: "@shellafood",
		},
		robots: {
			index: false,
			follow: true,
			googleBot: {
				index: false,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical: `https://shellafood.com/pickandorder/${transportType}/${type}/order/accepted-drivers`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}/${type}/order/accepted-drivers`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}/${type}/order/accepted-drivers`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function AcceptedDriversPageRoute({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}) {
	const { transportType, type } = await params;

	return <AcceptedDriversPage transportType={transportType} orderType={type} />;
}

