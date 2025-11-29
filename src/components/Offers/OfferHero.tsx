"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Tag, Calendar, TrendingDown, Copy, Check, Clock } from "lucide-react";
import { Offer } from "@/types/offer.types";

interface OfferHeroProps {
	offer: Offer;
	isArabic: boolean;
	copiedPromo: boolean;
	daysRemaining: number | null;
	onCopyPromo: () => void;
}

const OfferHero = memo(function OfferHero({
	offer,
	isArabic,
	copiedPromo,
	daysRemaining,
	onCopyPromo,
}: OfferHeroProps) {
	return (
		<div className="relative h-[450px] sm:h-[500px] md:h-[550px] overflow-hidden bg-gray-100 dark:bg-gray-800">
			{/* Background Image */}
			<div className="absolute inset-0">
				<Image
					src={offer.image}
					alt={isArabic ? offer.title : offer.titleEn}
					fill
					className="object-cover"
					priority
					unoptimized
				/>
			</div>

			{/* Enhanced Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

			{/* Content Container */}
			<div className="relative h-full flex flex-col justify-end">
				<div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
					{/* Badges */}
					<div className="flex flex-wrap gap-3 mb-6">
						{/* Discount Badge */}
						{offer.discount && (
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg">
								<TrendingDown className="w-4 h-4" />
								<span className="font-bold text-sm">
									{offer.discount.type === "percentage"
										? `${offer.discount.value}% ${isArabic ? "خصم" : "OFF"}`
										: `${offer.discount.value} ${isArabic ? "ر.س خصم" : "SAR OFF"}`}
								</span>
							</div>
						)}

						{/* Urgency Badge */}
						{daysRemaining !== null && daysRemaining <= 7 && (
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg shadow-lg">
								<Clock className="w-4 h-4" />
								<span className="text-sm font-bold">
									{daysRemaining} {isArabic ? "أيام متبقية" : "days left"}
								</span>
							</div>
						)}
					</div>

					{/* Title & Description */}
					<div className="mb-6">
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
							{isArabic ? offer.title : offer.titleEn}
						</h1>
						<p className="text-base sm:text-lg text-gray-100 max-w-2xl">
							{isArabic ? offer.description : offer.descriptionEn}
						</p>
					</div>

					{/* Promo Code & Validity */}
					<div className="flex flex-wrap gap-3">
						{/* Promo Code */}
						{offer.promoCode && (
							<div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
								<Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
								<div className="flex-1">
									<p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
										{isArabic ? "الرمز" : "Code"}
									</p>
									<code className="text-sm font-bold text-gray-900 dark:text-white">
										{offer.promoCode}
									</code>
								</div>
								<button
									onClick={onCopyPromo}
									className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
								>
									{copiedPromo ? (
										<Check className="w-4 h-4 text-emerald-600" />
									) : (
										<Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
									)}
								</button>
							</div>
						)}

						{/* Valid Until */}
						{offer.validUntil && (
							<div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
								<Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
								<div>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{isArabic ? "صالح حتى" : "Valid until"}{" "}
										<span className="font-bold text-gray-900 dark:text-white">
											{new Date(offer.validUntil).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
												month: "short",
												day: "numeric",
											})}
										</span>
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

export default OfferHero;

