"use client";

import React, { memo } from "react";
import { Sparkles, ArrowRight, Zap, Shield, Clock } from "lucide-react";

interface OfferCTABarProps {
	isArabic: boolean;
	isExpired: boolean;
	isLoading: boolean;
	onBookNow: () => void;
}

const OfferCTABar = memo(function OfferCTABar({
	isArabic,
	isExpired,
	isLoading,
	onBookNow,
}: OfferCTABarProps) {
	return (
		<div className="sticky bottom-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				{/* Trust Badges */}
				<div className="flex items-center justify-center gap-4 mb-3 text-xs text-gray-600 dark:text-gray-400">
					<div className="flex items-center gap-1.5">
						<Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
						<span>{isArabic ? "آمن ومضمون" : "Secure & Guaranteed"}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
						<span>{isArabic ? "تأكيد فوري" : "Instant Confirmation"}</span>
					</div>
				</div>

				{/* Primary CTA Button */}
				<button
					onClick={onBookNow}
					disabled={isExpired || isLoading}
					className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
				>
					{isLoading ? (
						<>
							<Zap className="w-5 h-5 animate-spin" />
							<span>{isArabic ? "جاري التحميل..." : "Loading..."}</span>
						</>
					) : (
						<>
							<Sparkles className="w-5 h-5" />
							<span>{isArabic ? "احجز الآن واحصل على الخصم" : "Book Now & Get Discount"}</span>
							<ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
						</>
					)}
				</button>

				{/* Error Message */}
				{isExpired && (
					<div className="mt-3 text-center">
						<p className="text-sm font-semibold text-red-600 dark:text-red-400">
							{isArabic ? "انتهت صلاحية هذا العرض" : "This offer has expired"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
});

export default OfferCTABar;

