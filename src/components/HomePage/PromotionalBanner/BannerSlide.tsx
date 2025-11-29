"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Offer } from "@/types/offer.types";

interface BannerSlideProps {
	banner: Offer;
	isArabic: boolean;
	onClick: () => void;
}

export default function BannerSlide({ banner, isArabic, onClick }: BannerSlideProps) {
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
					src={banner.image}
					alt={isArabic ? banner.title : banner.titleEn}
					fill
					className="object-cover"
					priority
					unoptimized
				/>
			</div>

			{/* Gradient Overlay */}
			<div
				className={`absolute inset-0 bg-gradient-to-r ${
					isArabic ? "from-black/70 via-black/50 to-transparent" : "from-black/70 via-black/50 to-transparent"
				}`}
			/>

			{/* Content */}
			<div
				className={`relative h-full flex flex-col justify-center p-3 sm:p-8 md:p-12 lg:p-16 pb-12 sm:pb-8 md:pb-12 lg:pb-16 ${
					isArabic ? "items-start text-right" : "items-end text-left"
				}`}
			>
				{/* Text Content with Background - Mobile Optimized */}
				<div className="relative z-10 w-full sm:w-auto sm:max-w-2xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl bg-black/60 sm:bg-black/50 backdrop-blur-sm sm:backdrop-blur-md border border-white/20 shadow-2xl">
					<motion.h3
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1.5 sm:mb-2 md:mb-4 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
					>
						{isArabic ? banner.title : banner.titleEn}
					</motion.h3>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/95 mb-3 sm:mb-4 md:mb-6 line-clamp-2 sm:line-clamp-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
					>
						{isArabic ? banner.description : banner.descriptionEn}
					</motion.p>
					<motion.button
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={(e) => {
							e.stopPropagation();
							onClick();
						}}
						className="bg-white text-gray-900 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full font-semibold text-xs sm:text-sm md:text-base lg:text-lg shadow-xl hover:shadow-2xl transition-all hover:bg-gray-50 touch-manipulation w-fit"
					>
						{isArabic ? banner.cta : banner.ctaEn}
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
}

