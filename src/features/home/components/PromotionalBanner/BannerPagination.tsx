"use client";

import React from "react";
import { motion } from "framer-motion";

interface BannerPaginationProps {
	banners: any[];
	currentIndex: number;
	onSlideClick: (index: number) => void;
	isArabic: boolean;
}

export default function BannerPagination({
	banners,
	currentIndex,
	onSlideClick,
	isArabic,
}: BannerPaginationProps) {
	return (
		<div
			className={`absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full bg-black/30 sm:bg-black/20 backdrop-blur-sm`}
		>
			{banners.map((_, index) => (
				<button
					key={index}
					onClick={(e) => {
						e.stopPropagation();
						onSlideClick(index);
					}}
					className="relative p-1 touch-manipulation"
					aria-label={`${isArabic ? "انتقل إلى الشريحة" : "Go to slide"} ${index + 1}`}
				>
					{/* Progress bar */}
					{index === currentIndex && (
						<motion.div
							layoutId="activePagination"
							className="absolute inset-0 bg-white rounded-full"
							initial={false}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						/>
					)}
					{/* Dot */}
					<div
						className={`h-1.5 sm:h-2 rounded-full transition-all ${
							index === currentIndex
								? "bg-white w-6 sm:w-8"
								: "bg-white/60 hover:bg-white/80 w-1.5 sm:w-2"
						}`}
					/>
				</button>
			))}
		</div>
	);
}

