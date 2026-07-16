import { Suspense } from "react";
import type { Metadata } from "next";
import { AllCategoriesPageShell } from "@/features/markets/components/AllCategoriesPageShell";
import { AllCategories } from "@/features/markets/components/sections/AllCategories";
import { isArabicLocale } from "@/shared/lib/locale";

interface ModuleCategoriesPageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ module_name?: string }>;
}

export async function generateMetadata({
	params,
	searchParams,
}: ModuleCategoriesPageProps): Promise<Metadata> {
	const { id } = await params;
	const { module_name } = await searchParams;
	const isArabic = await isArabicLocale();
	const name = module_name || (isArabic ? "الأقسام" : "Categories");

	return {
		title: isArabic
			? `${name} — الأقسام | شلة فود`
			: `${name} — Categories | Shella Food`,
		description: isArabic
			? `تصفّح جميع أقسام ${name} عبر شلة فود.`
			: `Browse all categories in ${name} on Shella Food.`,
		alternates: { canonical: `/modules/${id}/categories` },
	};
}

export default async function ModuleCategoriesPage({
	params,
	searchParams,
}: ModuleCategoriesPageProps) {
	const { id } = await params;
	const { module_name } = await searchParams;
	const isArabic = await isArabicLocale();

	return (
		<AllCategoriesPageShell isArabic={isArabic}>
			<Suspense fallback={<AllCategories.skeleton />}>
				<AllCategories moduleId={id} moduleName={module_name} isArabic={isArabic} />
			</Suspense>
		</AllCategoriesPageShell>
	);
}
