import { Metadata } from "next";
import { ConfirmationPage } from "@/features/serve-me";
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
		title: `تم تأكيد الحجز - ${service} | اخدمني - شلة فود`,
		description: `تم تأكيد حجزك لخدمة ${service} بنجاح. شكراً لاختيارك خدمتنا.`,
		keywords: [
			service,
			"تأكيد الحجز",
			"تم الحجز",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `تم تأكيد الحجز - ${service} | اخدمني - شلة فود`,
			description: `تم تأكيد حجزك لخدمة ${service}`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/book/confirmation`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-serve-me.jpg",
					width: 1200,
					height: 630,
					alt: `تم تأكيد الحجز - ${service}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `تم تأكيد الحجز - ${service} | اخدمني - شلة فود`,
			description: `تم تأكيد حجزك لخدمة ${service} بنجاح. شكراً لاختيارك خدمتنا.`,
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/book/confirmation`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/book/confirmation`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/book/confirmation`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function ConfirmationPageRoute({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}) {
	const { service, serviceType } = await params;

	return <ConfirmationPage service={service} serviceType={serviceType} />;
}
