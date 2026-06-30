import { Suspense } from "react";
import type { Metadata } from "next";
import { AllCategoriesPageShell } from "@/features/markets/components/AllCategoriesPageShell";
import { AllCategories } from "@/features/markets/components/sections/AllCategories";

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
	const name = module_name || "الأقسام";

	return {
		title: `${name} — الأقسام | شلة فود`,
		description: `تصفّح جميع أقسام ${name} عبر شلة فود.`,
		alternates: { canonical: `/modules/${id}/categories` },
	};
}

export default async function ModuleCategoriesPage({
	params,
	searchParams,
}: ModuleCategoriesPageProps) {
	const { id } = await params;
	const { module_name } = await searchParams;

	return (
		<AllCategoriesPageShell>
			<Suspense fallback={<AllCategories.skeleton />}>
				<AllCategories moduleId={id} moduleName={module_name} />
			</Suspense>
		</AllCategoriesPageShell>
	);
}