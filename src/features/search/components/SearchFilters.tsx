"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	SlidersHorizontal,
	X,
	Star,
	DollarSign,
	MapPin,
	TrendingUp,
	Flame,
	Leaf,
	Clock,
	Package,
} from "lucide-react";
import { useLanguage } from "@/providers";
import type { SearchFilters } from "../types";

export interface SearchFiltersProps {
	filters: SearchFilters;
	onFiltersChange: (filters: SearchFilters) => void;
	onReset: () => void;
	visible?: boolean;
}

// ─── helpers ────────────────────────────────────────────────────────────────

const DIETARY_OPTIONS = [
	{ value: "veg", labelEn: "Vegetarian", labelAr: "نباتي", icon: "🥗" },
	{ value: "non_veg", labelEn: "Non-Veg", labelAr: "غير نباتي", icon: "🍖" },
	{ value: "halal", labelEn: "Halal", labelAr: "حلال", icon: "☪️" },
	{ value: "organic", labelEn: "Organic", labelAr: "عضوي", icon: "🌱" },
	{ value: "gluten_free", labelEn: "Gluten Free", labelAr: "خالٍ من الجلوتين", icon: "🌾" },
	{ value: "dairy_free", labelEn: "Dairy Free", labelAr: "خالٍ من الألبان", icon: "🥛" },
	{ value: "nut_free", labelEn: "Nut Free", labelAr: "خالٍ من المكسرات", icon: "🥜" },
] as const;

const SORT_OPTIONS = [
	{ value: "popularity", labelEn: "Most Popular", labelAr: "الأكثر شعبية", Icon: TrendingUp },
	{ value: "rating", labelEn: "Highest Rated", labelAr: "الأعلى تقييماً", Icon: Star },
	{ value: "price_low", labelEn: "Price: Low→High", labelAr: "السعر: الأقل", Icon: DollarSign },
	{ value: "price_high", labelEn: "Price: High→Low", labelAr: "السعر: الأعلى", Icon: DollarSign },
	{ value: "newest", labelEn: "Newest", labelAr: "الأحدث", Icon: Flame },
] as const;

const PRICE_RANGES = [
	{ labelEn: "Under 50", labelAr: "أقل من 50", range: { min: 0, max: 50 } },
	{ labelEn: "50 – 100", labelAr: "50 - 100", range: { min: 50, max: 100 } },
	{ labelEn: "100 – 200", labelAr: "100 - 200", range: { min: 100, max: 200 } },
	{ labelEn: "Over 200", labelAr: "أكثر من 200", range: { min: 200, max: 9999 } },
];

// ─── active filter count ─────────────────────────────────────────────────────

function countActive(f: SearchFilters) {
	let n = 0;
	if (f.sortBy && f.sortBy !== "popularity") n++;
	if (f.minRating) n++;
	if (f.priceRange) n++;
	if (f.dietary) n++;
	if (f.availableNow) n++;
	if (f.inStock) n++;
	return n;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-3">
			{children}
		</p>
	);
}

function ToggleChip({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={onClick}
			className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-150 ${active
					? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
					: "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
				}`}
		>
			{children}
		</button>
	);
}

// ─── main component ──────────────────────────────────────────────────────────

export default function SearchFilters({
	filters,
	onFiltersChange,
	onReset,
	visible = true,
}: SearchFiltersProps) {
	const { language } = useLanguage();
	const isAr = language === "ar";
	const [isOpen, setIsOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const check = () => setIsDesktop(window.innerWidth >= 1024);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	const set = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) =>
		onFiltersChange({ ...filters, [key]: value });

	const toggle = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K], off: SearchFilters[K]) =>
		set(key, filters[key] === value ? off : value);

	const activeCount = countActive(filters);

	if (!visible) return null;

	// ── mobile toggle button ──────────────────────────────────────────────────
	const MobileToggle = (
		<div className="lg:hidden mb-4">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl font-semibold text-gray-800 dark:text-gray-100 hover:border-amber-400 transition-all ${isAr ? "flex-row-reverse" : ""}`}
			>
				<span className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
					<SlidersHorizontal className="w-5 h-5" />
					{isAr ? "تصفية" : "Filters"}
					{activeCount > 0 && (
						<span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
							{activeCount}
						</span>
					)}
				</span>
				<motion.span
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.2 }}
				>
					<SlidersHorizontal className="w-4 h-4 text-gray-400" />
				</motion.span>
			</button>
		</div>
	);

	// ── panel content ─────────────────────────────────────────────────────────
	const Panel = (
		<div className="space-y-7">
			{/* Sort By */}
			<div>
				<SectionTitle>{isAr ? "ترتيب حسب" : "Sort by"}</SectionTitle>
				<div className="space-y-2">
					{SORT_OPTIONS.map(({ value, labelEn, labelAr, Icon }) => (
						<button
							key={value}
							onClick={() => set("sortBy", value)}
							className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 text-sm font-medium ${filters.sortBy === value
									? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
									: "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
								} ${isAr ? "flex-row-reverse text-right" : ""}`}
						>
							<Icon className="w-4 h-4 flex-shrink-0" />
							{isAr ? labelAr : labelEn}
						</button>
					))}
				</div>
			</div>

			{/* Min Rating */}
			<div>
				<SectionTitle>{isAr ? "الحد الأدنى للتقييم" : "Min rating"}</SectionTitle>
				<div className="flex gap-2">
					{[4, 3, 2, 1].map((r) => (
						<button
							key={r}
							onClick={() => toggle("minRating", r, null)}
							className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border text-sm font-bold transition-all duration-150 ${filters.minRating === r
									? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
									: "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
								}`}
						>
							<Star
								className={`w-4 h-4 ${filters.minRating === r ? "fill-amber-400 text-amber-400" : ""}`}
							/>
							{r}+
						</button>
					))}
				</div>
			</div>

			{/* Price Range */}
			<div>
				<SectionTitle>{isAr ? "نطاق السعر" : "Price range"}</SectionTitle>
				<div className="flex flex-wrap gap-2">
					{PRICE_RANGES.map((opt) => {
						const isActive =
							filters.priceRange?.min === opt.range.min &&
							filters.priceRange?.max === opt.range.max;
						return (
							<ToggleChip
								key={opt.labelEn}
								active={isActive}
								onClick={() => set("priceRange", isActive ? null : opt.range)}
							>
								{isAr ? opt.labelAr : opt.labelEn}
								{" "}
								<span className="text-xs opacity-70">{isAr ? "ر.س" : "SAR"}</span>
							</ToggleChip>
						);
					})}
				</div>
			</div>

			{/* Dietary */}
			<div>
				<SectionTitle>{isAr ? "الفئة الغذائية" : "Dietary"}</SectionTitle>
				<div className="flex flex-wrap gap-2">
					{DIETARY_OPTIONS.map(({ value, labelEn, labelAr, icon }) => (
						<ToggleChip
							key={value}
							active={filters.dietary === value}
							onClick={() => set("dietary", filters.dietary === value ? undefined : value as any)}
						>
							<span>{icon} {isAr ? labelAr : labelEn}</span>
						</ToggleChip>
					))}
				</div>
			</div>

			{/* Availability toggles */}
			<div>
				<SectionTitle>{isAr ? "التوفر" : "Availability"}</SectionTitle>
				<div className="space-y-2">
					<button
						onClick={() => set("availableNow", !filters.availableNow)}
						className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-150 ${filters.availableNow
								? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
								: "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
							} ${isAr ? "flex-row-reverse" : ""}`}
					>
						<span className={`flex items-center gap-2 text-sm font-medium ${isAr ? "flex-row-reverse" : ""}`}>
							<Clock className="w-4 h-4" />
							{isAr ? "متاح الآن" : "Available now"}
						</span>
						<div
							className={`w-8 h-4 rounded-full transition-colors duration-200 relative ${filters.availableNow ? "bg-amber-400" : "bg-gray-200 dark:bg-gray-700"
								}`}
						>
							<div
								className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${filters.availableNow ? "translate-x-4" : "translate-x-0.5"
									}`}
							/>
						</div>
					</button>

					<button
						onClick={() => set("inStock", !filters.inStock)}
						className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-150 ${filters.inStock
								? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
								: "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
							} ${isAr ? "flex-row-reverse" : ""}`}
					>
						<span className={`flex items-center gap-2 text-sm font-medium ${isAr ? "flex-row-reverse" : ""}`}>
							<Package className="w-4 h-4" />
							{isAr ? "في المخزون" : "In stock"}
						</span>
						<div
							className={`w-8 h-4 rounded-full transition-colors duration-200 relative ${filters.inStock ? "bg-amber-400" : "bg-gray-200 dark:bg-gray-700"
								}`}
						>
							<div
								className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${filters.inStock ? "translate-x-4" : "translate-x-0.5"
									}`}
							/>
						</div>
					</button>
				</div>
			</div>

			{/* Reset */}
			{activeCount > 0 && (
				<button
					onClick={() => { onReset(); setIsOpen(false); }}
					className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold transition-colors"
				>
					<X className="w-4 h-4" />
					{isAr ? "إعادة تعيين" : "Reset filters"}
					<span className="px-1.5 py-0.5 bg-gray-300 dark:bg-gray-600 rounded-full text-xs">{activeCount}</span>
				</button>
			)}
		</div>
	);

	return (
		<>
			{MobileToggle}

			<AnimatePresence>
				{(isOpen || isDesktop) && (
					<motion.div
						key="filter-panel"
						initial={{ opacity: 0, x: isAr ? 12 : -12 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: isAr ? 12 : -12 }}
						transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
						className={`lg:sticky lg:top-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm mb-6 lg:mb-0 ${!isOpen && !isDesktop ? "hidden" : ""}`}
					>
						{/* Panel header */}
						<div className={`flex items-center justify-between mb-6 ${isAr ? "flex-row-reverse" : ""}`}>
							<div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
								<SlidersHorizontal className="w-4 h-4 text-gray-500" />
								<span className="text-base font-bold text-gray-900 dark:text-gray-100">
									{isAr ? "تصفية" : "Filters"}
								</span>
								{activeCount > 0 && (
									<span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-bold">
										{activeCount}
									</span>
								)}
							</div>
							<button
								onClick={() => setIsOpen(false)}
								className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
							>
								<X className="w-4 h-4 text-gray-500" />
							</button>
						</div>

						{Panel}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}