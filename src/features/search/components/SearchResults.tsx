"use client";

import React, { memo } from "react";
import { motion, Variants } from "framer-motion";
import {
	Star, Clock, MapPin, ShoppingBag,
	Leaf, Flame, BadgeCheck, Tag,
} from "lucide-react";
import { useLanguage } from "@/providers";
import type { ApiStore } from "../types/search.types";

const listVariants: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.06 } },
};
const cardVariants: Variants = {
	hidden: { opacity: 0, y: 18 },
	show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

function StatusBadge({ isOpen, isAr }: { isOpen: boolean; isAr: boolean }) {
	return (
		<span
			className={`absolute top-3 ${isAr ? "left-3" : "right-3"} px-2.5 py-1 rounded-full text-[11px] font-bold shadow ${isOpen
				? "bg-emerald-500 text-white"
				: "bg-gray-900/70 text-gray-300"
				}`}
		>
			{isOpen ? (isAr ? "مفتوح" : "Open") : (isAr ? "مغلق" : "Closed")}
		</span>
	);
}

function Rating({ avg, count }: { avg: number; count: number }) {
	if (count === 0) return null;
	return (
		<span className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
			<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
			{avg.toFixed(1)}
			<span className="font-normal text-gray-400 dark:text-gray-500">({count})</span>
		</span>
	);
}

function Pill({ icon, label }: { icon?: React.ReactNode; label: string }) {
	return (
		<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[11px] text-gray-600 dark:text-gray-400 font-medium">
			{icon}
			{label}
		</span>
	);
}

interface StoreCardProps {
	store: ApiStore;
	onClick: (store: ApiStore) => void;
}

export const StoreCard = memo(function StoreCard({ store, onClick }: StoreCardProps) {
	const { language } = useLanguage();
	const isAr = language === "ar";

	const name = store.name || (isAr ? "متجر" : "Store");
	const category = isAr ? store.category_display_ar : store.category_display;
	const distance = isAr ? store.distance_display_ar : store.distance_display;
	const deliveryFee = isAr ? store.delivery_fee_display_ar : store.delivery_fee_display;
	const deliveryTime = store.delivery?.delivery_time_range ?? store.delivery_time ?? "";

	return (
		<motion.article
			variants={cardVariants}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			onClick={() => onClick(store)}
			className={`group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 cursor-pointer ${!store.is_open ? "opacity-75" : ""
				}`}
			role="button"
			tabIndex={0}
			aria-label={name}
			onKeyDown={(e) => e.key === "Enter" && onClick(store)}
		>
			<div className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
				{store.cover_photo_full_url ? (
					<img
						src={store.cover_photo_full_url}
						alt=""
						aria-hidden
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						loading="lazy"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-700" />
					</div>
				)}

				<StatusBadge isOpen={store.is_open} isAr={isAr} />


				{store.logo_full_url && (
					<div className={`absolute bottom-0 ${isAr ? "right-3" : "left-3"} translate-y-1/2 w-12 h-12 rounded-xl border-2 border-white dark:border-gray-900 overflow-hidden shadow-md bg-white dark:bg-gray-900 flex-shrink-0`}>
						<img
							src={store.logo_full_url}
							alt={name}
							className="w-full h-full object-cover"
							loading="lazy"
						/>
					</div>
				)}


				{store.discount_status && store.discount ? (
					<span className={`absolute bottom-3 ${isAr ? "left-3" : "right-3"} px-2 py-0.5 bg-red-500 text-white text-[11px] font-bold rounded-full`}>
						<Tag className="w-3 h-3 inline mr-0.5" />
						{isAr ? "خصم" : "Offer"}
					</span>
				) : null}
			</div>

			<div className={`px-4 pt-7 pb-4 ${isAr ? "text-right" : "text-left"}`}>
				<div className={`flex items-start justify-between gap-2 mb-1 `}>
					<h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight truncate">
						{name}
					</h3>
					<Rating avg={store.avg_rating} count={store.rating_count} />
				</div>

				{category && (
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{category}</p>
				)}

				<div className={`flex flex-wrap gap-1.5 mb-3 ${isAr ? "justify-end" : ""}`}>
					{deliveryTime && (
						<Pill icon={<Clock className="w-3 h-3" />} label={deliveryTime} />
					)}
					{distance && (
						<Pill icon={<MapPin className="w-3 h-3" />} label={distance} />
					)}
					{store.halal_tag_status && (
						<Pill icon={<BadgeCheck className="w-3 h-3 text-emerald-500" />} label={isAr ? "حلال" : "Halal"} />
					)}
					{store.veg === 1 && store.non_veg === 0 && (
						<Pill icon={<Leaf className="w-3 h-3 text-green-500" />} label={isAr ? "نباتي" : "Veg"} />
					)}
					{store.busy_mode && (
						<Pill icon={<Flame className="w-3 h-3 text-orange-400" />} label={isAr ? "مشغول" : "Busy"} />
					)}
				</div>

				<div className={`flex items-center justify-between `}>
					<span className="text-xs text-gray-500 dark:text-gray-400">
						{isAr ? "رسوم التوصيل" : "Delivery"}
					</span>
					<span className="text-xs font-bold text-gray-800 dark:text-gray-200">
						{store.free_delivery
							? <span className="text-emerald-600 dark:text-emerald-400">{isAr ? "مجاني" : "Free"}</span>
							: deliveryFee || (isAr ? "يُحسب لاحقاً" : "Calculated")
						}
					</span>
				</div>
			</div>
		</motion.article>
	);
});

interface SearchResultsProps {
	stores: ApiStore[];
	totalSize: number;
	onStoreClick: (store: ApiStore) => void;
}

export default function SearchResults({ stores, totalSize, onStoreClick }: SearchResultsProps) {
	return (
		<motion.div
			key="results"
			variants={listVariants}
			initial="hidden"
			animate="show"
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
		>
			{stores.map((store) => (
				<StoreCard key={store.id} store={store} onClick={onStoreClick} />
			))}
		</motion.div>
	);
}