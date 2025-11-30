"use client";

import React from "react";
import { motion } from "framer-motion";
import type { RouteSegment } from "../../types/routeSegment";
import { QuickTipsBanner } from "./QuickTipsBanner";
import { SegmentCardHeader } from "./SegmentCardHeader";
import { PointCard } from "./PointCard";
import { PackageSummaryCard } from "./PackageSummaryCard";

interface SegmentCardProps {
	segment: RouteSegment;
	index: number;
	isActive?: boolean;
	isReviewMode?: boolean;
	onClick?: () => void;
	onEdit?: () => void;
	onRemove?: () => void;
	canRemove?: boolean;
	isArabic: boolean;
	completionPercentage?: number;
	onUpdatePhone?: (pointType: "pickup" | "dropoff", phone: string) => void;
}

export const SegmentCard: React.FC<SegmentCardProps> = ({
	segment,
	index,
	isActive = false,
	isReviewMode = false,
	onClick,
	onEdit,
	onRemove,
	canRemove = true,
	isArabic,
	completionPercentage = 0,
}) => {
	const hasPickup = !!segment.pickupPoint.location;
	const hasDropoff = !!segment.dropoffPoint.location;
	const hasPackage = !!segment.packageDetails.description;
	const isCompleted = completionPercentage === 100;
	const isInProgress = completionPercentage > 0 && completionPercentage < 100;
	// Hide dropoff point if nothing is filled yet and dropoff is unselected
	const shouldShowDropoff = hasDropoff || hasPickup || hasPackage;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			whileHover={onClick ? { y: -4, scale: 1.02 } : {}}
			onClick={onClick}
			className={`
				relative bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 transition-all duration-300
				${isActive 
					? "border-[#31A342] dark:border-[#4ade80] shadow-xl shadow-[#31A342]/10 dark:shadow-[#4ade80]/10 ring-4 ring-[#31A342]/20 dark:ring-[#4ade80]/20" 
					: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
				}
				${onClick ? "cursor-pointer" : ""}
				overflow-hidden
			`}
		>
			{/* Active Indicator Bar */}
			{isActive && (
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: "100%" }}
					className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#31A342] to-[#4ade80]"
				/>
			)}

			{/* Quick Tips Banner */}
			<QuickTipsBanner
				hasPickup={hasPickup}
				hasDropoff={hasDropoff}
				hasPackage={hasPackage}
				isReviewMode={isReviewMode}
				isArabic={isArabic}
			/>

			{/* Header */}
			<SegmentCardHeader
				index={index}
				isCompleted={isCompleted}
				isInProgress={isInProgress}
				completionPercentage={completionPercentage}
				isReviewMode={isReviewMode}
				isArabic={isArabic}
				onEdit={onEdit}
				onRemove={onRemove}
				canRemove={canRemove}
			/>

			{/* Route Flow */}
			<div className="space-y-2 sm:space-y-3">
				{/* Pickup Point */}
				<PointCard
					point={segment.pickupPoint}
					type="pickup"
					hasPoint={hasPickup}
					isReviewMode={isReviewMode}
					isArabic={isArabic}
				/>

				{/* Dropoff Point */}
				{shouldShowDropoff && (
					<PointCard
						point={segment.dropoffPoint}
						type="dropoff"
						hasPoint={hasDropoff}
						isReviewMode={isReviewMode}
						isArabic={isArabic}
					/>
				)}
			</div>

			{/* Package Summary */}
			<PackageSummaryCard
				packageDetails={segment.packageDetails}
				hasPackage={hasPackage}
				isReviewMode={isReviewMode}
				isArabic={isArabic}
			/>
		</motion.div>
	);
};

