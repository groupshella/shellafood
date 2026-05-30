"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, Edit2, X } from "lucide-react";

interface SegmentCardHeaderProps {
	index: number;
	isCompleted: boolean;
	isInProgress: boolean;
	completionPercentage: number;
	isReviewMode: boolean;
	isArabic: boolean;
	onEdit?: () => void;
	onRemove?: () => void;
	canRemove: boolean;
}

export const SegmentCardHeader: React.FC<SegmentCardHeaderProps> = ({
	index,
	isCompleted,
	isInProgress,
	completionPercentage,
	isReviewMode,
	isArabic,
	onEdit,
	onRemove,
	canRemove,
}) => {
	return (
		<div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
			{/* Status Badge and Title */}
			<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
				{/* Status Badge */}
				<div className={`
					relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-white text-xs sm:text-sm flex-shrink-0
					shadow-lg transition-all duration-300
					${isCompleted 
						? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700" 
						: isInProgress
						? "bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600"
						: "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
					}
				`}>
					{isCompleted ? (
						<CheckCircle2 className="w-6 h-6" />
					) : (
						<span className="text-base">{index + 1}</span>
					)}
					
					{/* Progress Ring for In-Progress */}
					{isInProgress && (
						<svg 
							className="absolute w-full h-full -rotate-90" 
							viewBox="0 0 48 48"
							preserveAspectRatio="xMidYMid meet"
						>
							<circle
								cx="24"
								cy="24"
								r="20"
								stroke="currentColor"
								strokeWidth="2.5"
								fill="none"
								className="text-white/30"
								vectorEffect="non-scaling-stroke"
							/>
							<circle
								cx="24"
								cy="24"
								r="20"
								stroke="currentColor"
								strokeWidth="2.5"
								fill="none"
								className="text-white"
								strokeDasharray={`${2 * Math.PI * 20}`}
								strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionPercentage / 100)}`}
								strokeLinecap="round"
								vectorEffect="non-scaling-stroke"
							/>
						</svg>
					)}
				</div>
				
				<div className="min-w-0 flex-1">
					<h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
						{isArabic ? `المسار ${index + 1}` : `Segment ${index + 1}`}
					</h4>
					{!isReviewMode && (
						<div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
							{isCompleted ? (
								<span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-green-600 dark:text-green-400">
									<CheckCircle2 className="w-3 h-3 flex-shrink-0" />
									<span>{isArabic ? "مكتمل" : "Completed"}</span>
								</span>
							) : isInProgress ? (
								<span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400">
									<Clock className="w-3 h-3 flex-shrink-0" />
									<span>{completionPercentage}% {isArabic ? "مكتمل" : "Complete"}</span>
								</span>
							) : (
								<span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">
									<AlertCircle className="w-3 h-3 flex-shrink-0" />
									<span>{isArabic ? "في الانتظار" : "Pending"}</span>
								</span>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Action Buttons - Right Side */}
			<div className="flex items-center gap-2 flex-shrink-0">
				{/* Edit Button */}
				{onEdit && isCompleted && (
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={(e) => {
							e.stopPropagation();
							onEdit();
						}}
						className="p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
						aria-label={isArabic ? "تعديل" : "Edit"}
					>
						<Edit2 className="w-4 h-4" />
					</motion.button>
				)}
				{/* Remove Button */}
				{!isReviewMode && canRemove && onRemove && (
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={(e) => {
							e.stopPropagation();
							onRemove();
						}}
						className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
						aria-label={isArabic ? "حذف" : "Remove"}
					>
						<X className="w-4 h-4" />
					</motion.button>
				)}
			</div>
		</div>
	);
};

