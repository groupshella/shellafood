"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/features/markets/types/categories.types";
import { useMarketsStoreOptional } from "@/features/markets/context/MarketsStoreContext";

const STORES_SECTION_ID = "module-stores";

interface CategoryCardProps {
	category: Category;
	moduleId: string;
	moduleName?: string;
	layout?: "scroll" | "grid";
	mode?: "filter" | "navigate";
}

function scrollToStores() {
	document.getElementById(STORES_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildModuleCategoryHref(
	moduleId: string,
	categoryId: number,
	moduleName?: string,
) {
	const params = new URLSearchParams();
	params.set("category_id", String(categoryId));
	if (moduleName) params.set("module_name", moduleName);
	return `/modules/${moduleId}?${params.toString()}`;
}

const INTERACTIVE_BASE = [
	"group flex min-h-11 flex-col items-center",
	"gap-2 sm:gap-2.5 md:gap-3",
	"touch-manipulation outline-none select-none",
	"motion-safe:transition-transform motion-safe:duration-150",
	"motion-safe:active:scale-[0.96]",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

const AVATAR_BASE = [
	"relative overflow-hidden rounded-full",
	"bg-card",
	"ring-1 ring-border",
	"shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
	"motion-safe:transition-[box-shadow,transform,background-color] motion-safe:duration-200",
	"h-[3.75rem] w-[3.75rem] sm:h-[4.5rem] sm:w-[4.5rem] md:h-[4.75rem] md:w-[4.75rem] lg:h-20 lg:w-20",
].join(" ");

const AVATAR_IDLE_HOVER = [
	"md:group-hover:-translate-y-0.5",
	"md:group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.09)]",
	"md:group-hover:ring-brand/15",
].join(" ");

const AVATAR_SELECTED = [
	"ring-2 ring-brand/80 ring-offset-2 ring-offset-background",
	"bg-brand/10",
	"shadow-[0_2px_10px_rgba(48,145,63,0.16),0_4px_16px_rgba(0,0,0,0.05)]",
].join(" ");

const PLACEHOLDER_CLASSES = [
	"flex h-full w-full items-center justify-center",
	"bg-gradient-to-br from-[#E8F5E9] to-white",
	"text-xl opacity-40 sm:text-2xl",
].join(" ");

export const CategoryCard = memo(function CategoryCard({
	category,
	moduleId,
	moduleName,
	layout = "scroll",
	mode = "navigate",
}: CategoryCardProps) {
	const [imageError, setImageError] = useState(false);
	const storeContext = useMarketsStoreOptional();
	const isGrid = layout === "grid";
	const isFilterMode = mode === "filter" && storeContext !== null;
	const isSelected = isFilterMode && storeContext.filters.categoryId === category.id;

	const handleImageError = useCallback(() => {
		setImageError(true);
	}, []);

	const sharedClassName = [
		INTERACTIVE_BASE,
		isGrid ? "w-full" : "w-[5rem] shrink-0 sm:w-[5.75rem] md:w-24 lg:w-[6.25rem]",
	].join(" ");

	const avatarClassName = [AVATAR_BASE, isSelected ? AVATAR_SELECTED : AVATAR_IDLE_HOVER].join(
		" ",
	);

	const labelClassName = [
		"line-clamp-2 w-full text-center",
		"text-[11px] leading-snug sm:text-xs sm:leading-snug lg:text-[13px]",
		"motion-safe:transition-[color] motion-safe:duration-200",
		isSelected
			? "font-semibold text-brand"
			: "font-medium text-muted md:group-hover:text-foreground",
	].join(" ");

	const content = (
		<>
			<div className={avatarClassName}>
				{!imageError && category.image_full_url ? (
					<Image
						src={category.image_full_url}
						alt=""
						fill
						className={[
							"object-contain p-1.5 sm:p-2",
							"motion-safe:transition-transform motion-safe:duration-200",
							"motion-safe:group-active:scale-95",
							"md:motion-safe:group-hover:scale-[1.04]",
						].join(" ")}
						sizes="(max-width: 640px) 60px, 80px"
						loading="lazy"
						onError={handleImageError}
					/>
				) : (
					<div className={PLACEHOLDER_CLASSES} aria-hidden>
						🍽️
					</div>
				)}
			</div>

			<span className={labelClassName}>{category.name}</span>
		</>
	);

	if (isFilterMode) {
		const handleSelect = () => {
			const { filters, setFilters } = storeContext;
			const nextCategoryId = isSelected ? null : category.id;
			setFilters({ ...filters, categoryId: nextCategoryId });
			if (nextCategoryId !== null) scrollToStores();
		};

		return (
			<button
				type="button"
				onClick={handleSelect}
				className={sharedClassName}
				aria-label={category.name}
				aria-pressed={isSelected}
			>
				{content}
			</button>
		);
	}

	return (
		<Link
			href={buildModuleCategoryHref(moduleId, category.id, moduleName)}
			className={sharedClassName}
			aria-label={category.name}
		>
			{content}
		</Link>
	);
});
