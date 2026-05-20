"use client";

import Image from "next/image";
import { LayoutGrid, Store } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { getCategoryLabel } from "../../lib/utils/categoryLabel";
import { categoryStoresPath, moduleStoresPath } from "../../lib/utils/categoryRoutes";
import type { ApiCategory } from "../../types/api-category.types";

interface StoreCategoriesProps {
	categories: ApiCategory[];
	moduleId: number;
	/** Active store-category id when on `/categories/{moduleId}/stores/{id}` */
	activeCategoryId?: number | null;
}

export default function StoreCategories({
	categories,
	moduleId,
	activeCategoryId = null,
}: StoreCategoriesProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const tabsRef = useRef<HTMLDivElement>(null);

	const query = useMemo(() => {
		const moduleName = searchParams.get("moduleName");
		return moduleName ? { moduleName } : undefined;
	}, [searchParams]);

	const activeCategories = useMemo(
		() => categories.filter((c) => c.status !== 0),
		[categories],
	);

	const isAllActive =
		activeCategoryId == null &&
		!pathname.includes(`/categories/${moduleId}/stores/`);

	const navigate = useCallback(
		(href: string) => {
			window.scrollTo({ top: 0, behavior: "smooth" });
			router.push(href, { scroll: false });
		},
		[router],
	);

	return (
		<nav
			aria-label={isArabic ? "تصنيفات المتاجر" : "Store categories"}
			className="rounded-2xl border border-gray-200/80 bg-white/80 p-2 shadow-sm backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-800/80"
		>
			<div
				ref={tabsRef}
				className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				<TabButton
					active={isAllActive}
					onClick={() => navigate(moduleStoresPath(moduleId, query))}
					icon={<LayoutGrid className="h-4 w-4 shrink-0" />}
					label={isArabic ? "الكل" : "All"}
				/>

				{activeCategories.map((category) => {
					const label = getCategoryLabel(category, isArabic);
					const imageUrl = category.image_full_url ?? category.image;
					const isActive = activeCategoryId === category.id;

					return (
						<TabButton
							key={category.id}
							active={isActive}
							onClick={() =>
								navigate(
									categoryStoresPath(moduleId, category.id, {
										...query,
										categoryName: label,
									}),
								)
							}
							label={label}
							icon={
								imageUrl ? (
									<span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
										<Image
											src={imageUrl}
											alt=""
											fill
											className="object-cover"
											sizes="20px"
											unoptimized
										/>
									</span>
								) : (
									<Store className="h-4 w-4 shrink-0 opacity-70" />
								)
							}
						/>
					);
				})}
			</div>
		</nav>
	);
}

function TabButton({
	active,
	onClick,
	label,
	icon,
}: {
	active: boolean;
	onClick: () => void;
	label: string;
	icon: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={`snap-start inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 ${
				active
					? "bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-md shadow-green-600/25"
					: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700/80 dark:text-gray-200 dark:hover:bg-gray-600"
			}`}
		>
			{icon}
			<span className="max-w-[8rem] truncate sm:max-w-[10rem]">{label}</span>
		</button>
	);
}
