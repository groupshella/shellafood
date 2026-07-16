import { getCategories } from "@/features/markets/api/categories";
import { AllCategoriesClient } from "./AllCategoriesClient";
import AllCategoriesSkeleton from "./skeleton";

export const AllCategories = Object.assign(
	async function AllCategories({
		moduleId,
		moduleName,
		isArabic,
	}: {
		moduleId: string;
		moduleName?: string;
		isArabic: boolean;
	}) {
		const lang = isArabic ? "ar" : "en";
		const categories = await getCategories(moduleId, lang);
		if (categories.length === 0) return null;

		return (
			<AllCategoriesClient
				categories={categories}
				moduleId={moduleId}
				moduleName={moduleName}
				isArabic={isArabic}
			/>
		);
	},
	{ skeleton: AllCategoriesSkeleton },
);
