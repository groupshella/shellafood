"use client";

import React, { memo, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Offer } from "@/types/offer.types";

interface OfferTermsProps {
	offer: Offer;
	isArabic: boolean;
}

const OfferTerms = memo(function OfferTerms({ offer, isArabic }: OfferTermsProps) {
	const terms = useMemo(
		() =>
			[
				isArabic
					? "صالح للطلبات داخل الرياض فقط"
					: "Valid for orders within Riyadh only",
				offer.discount?.minOrder
					? `${isArabic ? "الحد الأدنى للطلب:" : "Minimum order value:"} ${offer.discount.minOrder} ${isArabic ? "ريال" : "SAR"}`
					: null,
				offer.discount?.maxDiscount
					? `${isArabic ? "الحد الأقصى للخصم:" : "Maximum discount:"} ${offer.discount.maxDiscount} ${isArabic ? "ريال" : "SAR"}`
					: null,
				isArabic ? "استخدام واحد فقط لكل عميل" : "One use per customer",
				isArabic
					? "لا يمكن دمجه مع عروض أخرى"
					: "Cannot be combined with other offers",
				offer.validUntil
					? `${isArabic ? "صالح حتى" : "Valid until"} ${new Date(offer.validUntil).toLocaleDateString(
							isArabic ? "ar-SA" : "en-US",
							{ year: "numeric", month: "long", day: "numeric" }
					  )}`
					: null,
			].filter(Boolean) as string[],
		[offer, isArabic]
	);

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
			{/* Header */}
			<div className="border-b border-gray-200 dark:border-gray-700 p-6 sm:p-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
				<div className="flex items-center gap-4">
					<div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
						<AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
					</div>
					<div>
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
							{isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
							{isArabic ? "يرجى قراءة الشروط والأحكام بعناية" : "Please read the terms and conditions carefully"}
						</p>
					</div>
				</div>
			</div>

			{/* Terms List */}
			<div className="p-5 sm:p-6">
				<ul className="space-y-3">
					{terms.map((term, index) => (
						<li key={index} className="flex items-start gap-3 text-sm">
							<div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
							<span className="text-gray-700 dark:text-gray-300">{term}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
});

export default OfferTerms;

