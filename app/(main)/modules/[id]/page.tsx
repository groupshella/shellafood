import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import ModulePage from "@/features/module/components/ModulePage";
import type { Metadata } from "next";
import { cookies } from "next/headers";

interface ModulePageRouteProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ module_name?: string }>;
}

export async function generateMetadata({
	params,
	searchParams,
}: ModulePageRouteProps): Promise<Metadata> {
	const { id } = await params;
	const { module_name } = await searchParams;

	const name = module_name || "القسم";

	return {
		title: `${name} | شلة فود`,
		description: `تصفّح المتاجر والعروض والمنتجات المتوفرة ضمن ${name} عبر شلة فود.`,

		keywords: [
			"شلة فود",
			"Shella Food",
			name,
			"متاجر",
			"توصيل",
			"عروض",
			"تسوق إلكتروني",
			"سوبر ماركت",
			"توصيل سريع",
		],

		alternates: {
			canonical: `/module/${id}`,
		},

		openGraph: {
			type: "website",
			locale: "ar_SA",
			url: `https://shellafood.com/module/${id}`,
			siteName: "شلة فود",
			title: `${name} | شلة فود`,
			description: `تصفّح المتاجر والعروض والمنتجات المتوفرة ضمن ${name} عبر شلة فود.`,
			images: [
				{
					url: "/images/og-image.png",
					width: 1200,
					height: 630,
					alt: name,
				},
			],
		},

		twitter: {
			card: "summary_large_image",
			title: `${name} | شلة فود`,
			description: `تصفّح المتاجر والعروض والمنتجات المتوفرة ضمن ${name} عبر شلة فود.`,
			images: ["/images/og-image.png"],
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
	};
}

export default async function ModulePageRoute({
	params,
	searchParams,
}: ModulePageRouteProps) {
	const { id } = await params;
	const { module_name } = await searchParams;

	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	return (
		<ModulePage
			moduleId={id}
			moduleName={module_name || ""}
			isAuthenticated={!!token}
		/>
	);
}