"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Tag, Clock, TrendingDown, ChevronRight } from "lucide-react";
import { Offer } from "@/types/offer.types";

interface OfferSlideProps {
	offer: Offer;
	isArabic: boolean;
	daysRemaining: number | null;
	onClick: () => void;
}

const OfferSlide = memo(function OfferSlide({
	offer,
	isArabic,
	daysRemaining,
	onClick,
}: OfferSlideProps) {
	const isExpired = daysRemaining !== null && daysRemaining < 0;

	return (
		<motion.div
			initial={{ opacity: 0, x: isArabic ? -100 : 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: isArabic ? 100 : -100 }}
			transition={{ duration: 0.5 }}
			className="relative h-full w-full cursor-pointer"
			onClick={onClick}
		>
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

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

			{/* Expired Overlay */}
			{isExpired && (
				<div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
					<span className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-lg">
						{isArabic ? "انتهى العرض" : "Expired"}
					</span>
				</div>
			)}

			{/* Content */}
			<div
				className={`relative h-full flex flex-col justify-end p-4 sm:p-8 md:p-12 lg:p-16 ${
					isArabic ? "items-start text-right" : "items-end text-left"
				}`}
			>
				{/* Badges */}
				<div className="flex flex-wrap gap-3 mb-4 z-10">
					{/* Discount Badge */}
					{offer.discount && !isExpired && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
							className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg"
						>
							<TrendingDown className="w-4 h-4" />
							<span className="font-bold text-sm">
								{offer.discount.type === "percentage"
									? `${offer.discount.value}% ${isArabic ? "خصم" : "OFF"}`
									: `${offer.discount.value} ${isArabic ? "ر.س خصم" : "SAR OFF"}`}
							</span>
						</motion.div>
					)}

					{/* Urgency Badge */}
					{daysRemaining !== null && daysRemaining <= 7 && !isExpired && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3 }}
							className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg shadow-lg"
						>
							<Clock className="w-4 h-4" />
							<span className="text-sm font-bold">
								{daysRemaining} {isArabic ? "أيام متبقية" : "days left"}
							</span>
						</motion.div>
					)}
				</div>

				{/* Text Content with Background */}
				<div className="relative z-10 w-full sm:w-auto sm:max-w-2xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl bg-black/60 sm:bg-black/50 backdrop-blur-sm sm:backdrop-blur-md border border-white/20 shadow-2xl">
					{/* Title */}
					<motion.h3
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
					>
						{isArabic ? offer.title : offer.titleEn}
					</motion.h3>

					{/* Description */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/95 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
					>
						{isArabic ? offer.description : offer.descriptionEn}
					</motion.p>

					{/* Promo Code & Validity */}
					<div className="flex flex-wrap gap-3 mb-4">
						{/* Promo Code */}
						{offer.promoCode && !isExpired && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
							>
								<Tag className="w-4 h-4 text-white" />
								<code className="text-sm font-mono font-bold text-white">
									{offer.promoCode}
								</code>
							</motion.div>
						)}

						{/* Valid Until */}
						{offer.validUntil && !isExpired && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
							>
								<Clock className="w-4 h-4 text-white" />
								<span className="text-xs sm:text-sm text-white">
									{isArabic ? "صالح حتى" : "Valid until"}{" "}
									<span className="font-bold">
										{new Date(offer.validUntil).toLocaleDateString(
											isArabic ? "ar-SA" : "en-US",
											{ month: "short", day: "numeric" }
										)}
									</span>
								</span>
							</motion.div>
						)}
					</div>

					{/* CTA Button */}
					{!isExpired && (
						<motion.button
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={(e) => {
								e.stopPropagation();
								onClick();
							}}
							className="bg-white text-gray-900 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transition-all hover:bg-gray-50 touch-manipulation w-fit flex items-center gap-2"
						>
							<span>{isArabic ? "عرض التفاصيل" : "View Details"}</span>
							<ChevronRight
								className={`w-4 h-4 sm:w-5 sm:h-5 ${isArabic ? "rotate-180" : ""}`}
							/>
						</motion.button>
					)}
				</div>
			</div>
		</motion.div>
	);
});

export default OfferSlide;

