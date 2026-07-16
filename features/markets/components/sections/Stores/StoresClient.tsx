"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { Category } from "@/features/markets/types/categories.types";
import {
	DEFAULT_FILTERS,
	GetStoresResponse,
	StoreFilters,
	hasActiveFilters,
} from "@/features/markets/types/stores.types";
import { useMarketsStore } from "@/features/markets/context/MarketsStoreContext";
import { StoreCard } from "./StoreCard";

const FILTER_CHIP_BASE = [
	"inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full",
	"min-h-9 px-3.5 py-2 sm:min-h-10 sm:gap-2 sm:px-4",
	"text-xs font-semibold leading-none sm:text-[13px]",
	"touch-manipulation select-none",
	"motion-safe:transition-[background-color,box-shadow,transform,ring-color] motion-safe:duration-200",
	"motion-safe:active:scale-[0.97]",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
].join(" ");

const FILTER_CHIP_IDLE = [
	"bg-card text-foreground",
	"ring-1 ring-border shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
	"md:hover:ring-brand/25 md:hover:shadow-[0_2px_6px_rgba(0,0,0,0.05)]",
].join(" ");

const FILTER_CHIP_ACTIVE = [
	"bg-brand text-brand-foreground",
	"shadow-[0_2px_8px_rgba(48,145,63,0.25)] ring-1 ring-brand/40",
].join(" ");

const FILTER_SCROLL_TRACK = [
	"flex items-center gap-2 overflow-x-auto overscroll-x-contain",
	"snap-x snap-mandatory pb-1 pt-0.5",
	"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
].join(" ");

type BooleanFilterKey = "hasOffer" | "freeDelivery" | "topRated" | "openNow" | "under30Min";

const FILTER_CHIPS: { key: BooleanFilterKey; label: { ar: string; en: string } }[] = [
	{ key: "hasOffer", label: { ar: "عروض", en: "Offers" } },
	{ key: "freeDelivery", label: { ar: "توصيل مجاني", en: "Free delivery" } },
	{ key: "topRated", label: { ar: "تقييم عالي", en: "Top rated" } },
	{ key: "openNow", label: { ar: "مفتوح الآن", en: "Open now" } },
	{ key: "under30Min", label: { ar: "توصيل سريع", en: "Fast delivery" } },
];

function FilterChip({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={[FILTER_CHIP_BASE, active ? FILTER_CHIP_ACTIVE : FILTER_CHIP_IDLE].join(" ")}
			aria-pressed={active}
		>
			{active && <Check className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} aria-hidden />}
			<span className="whitespace-nowrap">{label}</span>
		</button>
	);
}

function CategorySheet({
	open,
	onClose,
	categories,
	selected,
	onSelect,
	isArabic,
}: {
	open: boolean;
	onClose: () => void;
	categories: Category[];
	selected: number | null;
	onSelect: (id: number | null) => void;
	isArabic: boolean;
}) {
	const overlayRef = useRef<HTMLDivElement>(null);

	const handleOverlay = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === overlayRef.current) onClose();
		},
		[onClose],
	);

	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [open, onClose]);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						ref={overlayRef}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
						onClick={handleOverlay}
						aria-hidden
					/>

					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", damping: 28, stiffness: 300 }}
						className="fixed inset-x-0 bottom-0 z-50 max-h-[86dvh] overflow-hidden rounded-t-3xl bg-background pb-safe sm:mx-auto sm:max-w-lg sm:rounded-3xl md:max-w-xl lg:max-w-2xl"
						role="dialog"
						aria-modal="true"
						aria-label={isArabic ? "فلترة حسب التصنيف" : "Filter by category"}
						dir={isArabic ? "rtl" : "ltr"}
						lang={isArabic ? "ar" : "en"}
					>
						<div className="flex justify-center pb-1 pt-3">
							<div className="h-1 w-10 rounded-full bg-border" />
						</div>

						<div className="flex items-center justify-between px-4 py-3 sm:px-5">
							<h2 className="text-base font-bold text-foreground">
								{isArabic ? "اختر التصنيف" : "Choose category"}
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="rounded-full p-1.5 text-muted transition-colors hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
								aria-label={isArabic ? "إغلاق" : "Close"}
							>
								<X className="h-4 w-4" aria-hidden />
							</button>
						</div>

						<div className="h-px bg-border" />

						<ul className="max-h-[60vh] overflow-y-auto overscroll-contain pb-6 sm:max-h-[70vh] md:max-h-[55vh]">
							<li>
								<button
									type="button"
									onClick={() => {
										onSelect(null);
										onClose();
									}}
									className="flex min-h-[52px] w-full items-center justify-between px-4 py-3.5 text-start transition-colors hover:bg-card active:brightness-95 sm:px-5 sm:py-4"
								>
									<span className="text-sm font-medium text-foreground">
										{isArabic ? "جميع التصنيفات" : "All categories"}
									</span>
									<span
										className={[
											"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
											selected === null
												? "border-brand bg-brand"
												: "border-border bg-background",
										].join(" ")}
									>
										{selected === null && (
											<Check className="h-3 w-3 text-brand-foreground" strokeWidth={3} />
										)}
									</span>
								</button>
								<div className="mx-5 h-px bg-border" />
							</li>

							{categories.map((cat) => (
								<li key={cat.id}>
									<button
										type="button"
										onClick={() => {
											onSelect(cat.id);
											onClose();
										}}
										className="flex min-h-[52px] w-full items-center justify-between px-4 py-3.5 text-start transition-colors hover:bg-card active:brightness-95 sm:px-5 sm:py-4"
									>
										<span className="text-sm font-medium text-foreground">{cat.name}</span>
										<span
											className={[
												"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
												selected === cat.id
													? "border-brand bg-brand"
													: "border-border bg-background",
											].join(" ")}
										>
											{selected === cat.id && (
												<Check className="h-3 w-3 text-brand-foreground" strokeWidth={3} />
											)}
										</span>
									</button>
									<div className="mx-5 h-px bg-border" />
								</li>
							))}
						</ul>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

function FilterBar({
	filters,
	onChange,
	categories,
	isArabic,
}: {
	filters: StoreFilters;
	onChange: (f: StoreFilters) => void;
	categories: Category[];
	isArabic: boolean;
}) {
	const [sheetOpen, setSheetOpen] = useState(false);

	const toggle = (key: keyof StoreFilters) =>
		onChange({ ...filters, [key]: !filters[key as keyof StoreFilters] });

	const selectedCategoryName =
		filters.categoryId !== null
			? (categories.find((c) => c.id === filters.categoryId)?.name ??
				(isArabic ? "تصنيف" : "Category"))
			: null;

	const categoryActive = filters.categoryId !== null;

	return (
		<>
			<div className="-mx-3 sm:-mx-5 lg:-mx-6">
				<div
					className={FILTER_SCROLL_TRACK}
					dir={isArabic ? "rtl" : "ltr"}
					role="group"
					aria-label={isArabic ? "فلاتر المتاجر" : "Store filters"}
				>
					<div className="w-3 shrink-0 snap-none sm:w-5 lg:w-6" aria-hidden />

					<button
						type="button"
						onClick={() => setSheetOpen(true)}
						className={[
							FILTER_CHIP_BASE,
							categoryActive ? FILTER_CHIP_ACTIVE : FILTER_CHIP_IDLE,
							"max-w-[11rem] sm:max-w-[13rem]",
						].join(" ")}
						aria-haspopup="dialog"
						aria-expanded={sheetOpen}
						aria-pressed={categoryActive}
					>
						<SlidersHorizontal
							className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
							strokeWidth={2.5}
							aria-hidden
						/>
						<span className="min-w-0 truncate">
							{selectedCategoryName ?? (isArabic ? "التصنيف" : "Category")}
						</span>
						{categoryActive && (
							<span
								role="button"
								tabIndex={0}
								aria-label={
									isArabic ? "إزالة فلتر التصنيف" : "Remove category filter"
								}
								className={[
									"ms-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
									"transition-colors hover:bg-white/20 active:bg-white/30",
								].join(" ")}
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
									onChange({ ...filters, categoryId: null });
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.stopPropagation();
										e.preventDefault();
										onChange({ ...filters, categoryId: null });
									}
								}}
							>
								<X className="h-3 w-3" aria-hidden />
							</span>
						)}
					</button>

					{FILTER_CHIPS.map((chip) => (
						<FilterChip
							key={chip.key}
							label={isArabic ? chip.label.ar : chip.label.en}
							active={Boolean(filters[chip.key])}
							onClick={() => toggle(chip.key)}
						/>
					))}

					{hasActiveFilters(filters) && (
						<button
							type="button"
							onClick={() => onChange(DEFAULT_FILTERS)}
							className={[
								FILTER_CHIP_BASE,
								"gap-1 bg-red-50 text-red-600",
								"ring-1 ring-red-200/80 shadow-[0_1px_3px_rgba(239,68,68,0.08)]",
								"md:hover:bg-red-100 md:hover:ring-red-300/80",
								"focus-visible:ring-red-300/60",
							].join(" ")}
							aria-label={isArabic ? "مسح جميع الفلاتر" : "Clear all filters"}
						>
							<X className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
							<span className="whitespace-nowrap">
								{isArabic ? "مسح" : "Clear"}
							</span>
						</button>
					)}

					<div className="w-3 shrink-0 snap-none sm:w-5 lg:w-6" aria-hidden />
				</div>
			</div>

			<CategorySheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
				categories={categories}
				selected={filters.categoryId}
				onSelect={(id) => onChange({ ...filters, categoryId: id })}
				isArabic={isArabic}
			/>
		</>
	);
}

function EmptyState({
	hasFilters,
	onClear,
	isArabic,
}: {
	hasFilters: boolean;
	onClear: () => void;
	isArabic: boolean;
}) {
	return (
		<div
			className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<span className="text-4xl" aria-hidden>
				🏪
			</span>
			<p className="text-sm font-semibold text-foreground">
				{hasFilters
					? isArabic
						? "لا توجد متاجر تطابق الفلتر"
						: "No stores match this filter"
					: isArabic
						? "لا توجد متاجر متاحة حالياً"
						: "No stores available right now"}
			</p>
			{hasFilters && (
				<button
					type="button"
					onClick={onClear}
					className="min-h-[40px] rounded-xl bg-card px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:brightness-95"
				>
					{isArabic ? "مسح الفلاتر" : "Clear filters"}
				</button>
			)}
		</div>
	);
}

export function StoresClient({
	categories,
	initialStores,
	isArabic,
}: {
	categories: Category[];
	initialStores: GetStoresResponse;
	isArabic: boolean;
}) {
	const {
		stores,
		isLoading,
		isLoadingMore,
		error,
		hasMore,
		filters,
		setFilters,
		loadMore,
		hydrateFromServer,
		totalSize,
	} = useMarketsStore();

	useEffect(() => {
		hydrateFromServer(initialStores);
	}, [hydrateFromServer, initialStores]);

	const filtersActive = hasActiveFilters(filters);

	return (
		<section
			id="module-stores"
			className="mx-auto w-full max-w-lg scroll-mt-4 space-y-3 px-3 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl"
			aria-label={isArabic ? "المتاجر" : "Stores"}
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-base font-bold text-foreground sm:text-lg md:text-xl">
					{filtersActive
						? isArabic
							? "نتائج الفلتر"
							: "Filter results"
						: isArabic
							? "المتاجر القريبة منك"
							: "Stores near you"}
				</h2>
				{!isLoading && stores.length > 0 && (
					<span className="text-xs text-muted">
						{isArabic ? `${totalSize} متجر` : `${totalSize} stores`}
					</span>
				)}
			</div>

			<FilterBar
				filters={filters}
				onChange={setFilters}
				categories={categories}
				isArabic={isArabic}
			/>

			{isLoading ? (
				<div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 lg:gap-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-card p-2.5 ring-1 ring-border sm:gap-3 sm:p-3"
						>
							<div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-border sm:h-[72px] sm:w-[72px]" />
							<div className="flex-1 space-y-2">
								<div className="h-4 w-2/3 animate-pulse rounded bg-border" />
								<div className="h-3 w-1/2 animate-pulse rounded bg-border/70" />
							</div>
						</div>
					))}
				</div>
			) : error ? (
				<EmptyState
					hasFilters={filtersActive}
					onClear={() => setFilters(DEFAULT_FILTERS)}
					isArabic={isArabic}
				/>
			) : stores.length === 0 ? (
				<EmptyState
					hasFilters={filtersActive}
					onClear={() => setFilters(DEFAULT_FILTERS)}
					isArabic={isArabic}
				/>
			) : (
				<AnimatePresence mode="wait">
					<motion.div
						key={JSON.stringify(filters)}
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.25 }}
						className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 lg:gap-4"
					>
						{stores.map((store) => (
							<StoreCard key={store.id} store={store} isArabic={isArabic} />
						))}
					</motion.div>
				</AnimatePresence>
			)}

			{hasMore && !isLoading && (
				<div className="flex justify-center pt-1">
					<button
						type="button"
						onClick={loadMore}
						disabled={isLoadingMore}
						className={[
							"min-h-[44px] rounded-xl bg-card px-6 py-2.5 text-sm font-semibold text-foreground",
							"transition-colors hover:brightness-95",
							"disabled:cursor-not-allowed disabled:opacity-60",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
						].join(" ")}
					>
						{isLoadingMore
							? isArabic
								? "جاري التحميل..."
								: "Loading..."
							: isArabic
								? "عرض المزيد"
								: "Show more"}
					</button>
				</div>
			)}
		</section>
	);
}
