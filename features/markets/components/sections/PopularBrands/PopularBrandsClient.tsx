"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PopularBrand } from "@/features/markets/types/popular-brands.types";
import { BrandCard } from "./BrandCard";

function chunkByTwo(items: PopularBrand[]): PopularBrand[][] {
	const columns: PopularBrand[][] = [];
	for (let i = 0; i < items.length; i += 2) {
		columns.push(items.slice(i, i + 2));
	}
	return columns;
}

export function PopularBrandsClient({
	brands,
	isArabic,
}: {
	brands: PopularBrand[];
	isArabic: boolean;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollMore, setCanScrollMore] = useState(false);

	const columns = chunkByTwo(brands);
	const hasMultipleColumns = columns.length > 2;

	const updateScrollHint = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;

		const maxScroll = el.scrollWidth - el.clientWidth;
		if (maxScroll <= 4) {
			setCanScrollMore(false);
			return;
		}

		const scrolled = Math.abs(el.scrollLeft);
		setCanScrollMore(scrolled < maxScroll - 8);
	}, []);

	useEffect(() => {
		updateScrollHint();
		const el = scrollRef.current;
		if (!el) return;

		el.addEventListener("scroll", updateScrollHint, { passive: true });
		window.addEventListener("resize", updateScrollHint);
		return () => {
			el.removeEventListener("scroll", updateScrollHint);
			window.removeEventListener("resize", updateScrollHint);
		};
	}, [brands, updateScrollHint]);

	return (
		<section
			aria-label={isArabic ? "أشهر العلامات التجارية" : "Popular brands"}
			className="w-full space-y-3"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-3 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
				<h2 className="text-base font-bold text-foreground sm:text-lg md:text-xl">
					{isArabic ? "أشهر العلامات التجارية" : "Popular brands"}
				</h2>
				{hasMultipleColumns && canScrollMore && (
					<span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted">
						<span className="hidden sm:inline">
							{isArabic ? "اسحب للمزيد" : "Swipe for more"}
						</span>
						<ChevronLeft
							className={["h-4 w-4", isArabic ? "" : "rotate-180"].join(" ")}
							strokeWidth={2.5}
							aria-hidden
						/>
					</span>
				)}
			</div>

			<div className="relative">
				{hasMultipleColumns && canScrollMore && (
					<div
						className="pointer-events-none absolute inset-y-0 end-0 z-10 w-14 bg-gradient-to-r from-background via-background/70 to-transparent sm:w-16"
						aria-hidden
					/>
				)}

				<div
					ref={scrollRef}
					className={[
						"mx-auto flex w-full max-w-lg gap-2.5 overflow-x-auto px-3 pb-1 sm:max-w-2xl sm:gap-3 sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl",
						"snap-x snap-mandatory scroll-smooth",
						"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
						hasMultipleColumns ? "scroll-pe-4 sm:scroll-pe-5 lg:scroll-pe-6" : "",
					].join(" ")}
					dir={isArabic ? "rtl" : "ltr"}
				>
					{columns.map((column) => (
						<div
							key={column.map((brand) => brand.id).join("-")}
							className="flex w-[43vw] min-w-[8.5rem] max-w-[13rem] shrink-0 snap-start flex-col gap-2.5 sm:w-[30vw] sm:min-w-[10rem] sm:max-w-[14rem] sm:gap-3 md:w-[24vw] md:max-w-[15rem] lg:w-[22vw] lg:max-w-[15rem] xl:w-[18vw]"
						>
							{column.map((brand) => (
								<BrandCard key={brand.id} brand={brand} />
							))}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
