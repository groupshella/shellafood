import { Metadata } from "next";
import { BookingDetailsPage } from "@/features/serve-me";
import { getAllIndividualServicePaths } from "@/lib/data/services";

export async function generateStaticParams() {
	const paths = getAllIndividualServicePaths();
	return paths.map(({ category, service }) => ({
		service: category,
		serviceType: service,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}): Promise<Metadata> {
	const { service, serviceType } = await params;

	return {
		title: `حجز ${service} | تفاصيل الحجز | اخدمني - شلة فود`,
		description: `احجز خدمة ${service}. اختر الكمية، التاريخ، الوقت، والعنوان.`,
		keywords: [
			service,
			"تفاصيل الحجز",
			"حجز موعد",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `حجز ${service} | اخدمني - شلة فود`,
			description: `احجز موعدك لخدمة ${service}`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/book/details`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-serve-me.jpg",
					width: 1200,
					height: 630,
					alt: `حجز ${service}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `حجز ${service} | اخدمني - شلة فود`,
			description: `احجز موعدك لخدمة ${service}`,
			images: ["/og-serve-me.jpg"],
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/book/details`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/book/details`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/book/details`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function BookingDetailsPageRoute({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}) {
	const { service, serviceType } = await params;
	return <BookingDetailsPage service={service} serviceType={serviceType} />;
}
