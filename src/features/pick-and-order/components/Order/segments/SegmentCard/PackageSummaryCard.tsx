"use client";

import React from "react";
import { Package, AlertCircle } from "lucide-react";
import type { PackageDetails } from "../../../../types/pick-and-order.types";

interface PackageSummaryCardProps {
	packageDetails: PackageDetails;
	hasPackage: boolean;
	isReviewMode: boolean;
	isArabic: boolean;
}

export const PackageSummaryCard: React.FC<PackageSummaryCardProps> = ({
	packageDetails,
	hasPackage,
	isReviewMode,
	isArabic,
}) => {
	if (hasPackage) {
		return (
			<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
				<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
							<Package className="w-4 h-4 text-white" />
						</div>
						<span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
							{isArabic ? "الطرد" : "Package"}
						</span>
					</div>
					<p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
						{packageDetails.description}
					</p>
					<div className="flex items-center flex-wrap gap-2">
						{packageDetails.weight && (
							<span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
								<Package className="w-3 h-3" />
								{packageDetails.weight} {isArabic ? "كجم" : "kg"}
							</span>
						)}
						{packageDetails.isFragile && (
							<span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg shadow-sm border border-amber-300 dark:border-amber-700">
								<AlertCircle className="w-3 h-3" />
								{isArabic ? "قابل للكسر" : "Fragile"}
							</span>
						)}
					</div>
				</div>
			</div>
		);
	}

	if (isReviewMode) return null;

	return (
		<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800 border-dashed">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 flex-1">
						<div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
							<Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
						</div>
						<div className="flex-1">
							<p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
								{isArabic ? "الطرد" : "Package"}
							</p>
							<p className="text-sm text-gray-400 dark:text-gray-500 italic">
								{isArabic ? "غير محدد" : "Not added"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

