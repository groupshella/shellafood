"use client";

import React, { memo } from "react";
import { CheckCircle, Shield, Zap, Clock, HeadphonesIcon, Package } from "lucide-react";
import { Offer } from "@/types/offer.types";

interface OfferBenefitsProps {
	offer: Offer;
	isArabic: boolean;
}

const OfferBenefits = memo(function OfferBenefits({ offer, isArabic }: OfferBenefitsProps) {
	const benefits = [
		{
			icon: <CheckCircle className="w-6 h-6" />,
			title: offer.discount?.type === "percentage"
				? `${offer.discount.value}% ${isArabic ? "خصم على رسوم التوصيل" : "off delivery fee"}`
				: offer.discount?.type === "fixed"
				? `${offer.discount.value} ${isArabic ? "ريال خصم" : "SAR off"}`
				: isArabic
				? "خصم خاص"
				: "Special discount",
			description:
				offer.discount?.maxDiscount
					? `${isArabic ? "حتى" : "Up to"} ${offer.discount.maxDiscount} ${isArabic ? "ريال" : "SAR"}`
					: isArabic
					? "خصم فوري على طلبك"
					: "Instant discount on your order",
			gradient: "from-emerald-500 to-teal-500",
		},
		{
			icon: <Shield className="w-6 h-6" />,
			title: isArabic ? "سائق محترف معتمد" : "Pre-vetted professional driver",
			description: isArabic ? "موثق ومؤمن بالكامل" : "Fully verified & insured",
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			icon: <Zap className="w-6 h-6" />,
			title: isArabic ? "تتبع مباشر في الوقت الفعلي" : "Real-time live tracking",
			description: isArabic ? "تتبع موقع السائق لحظة بلحظة" : "Track driver location every moment",
			gradient: "from-purple-500 to-pink-500",
		},
		{
			icon: <Package className="w-6 h-6" />,
			title: isArabic ? "تأمين شامل على الطرود" : "Full parcel insurance",
			description: isArabic ? "حماية كاملة لطلبك من البداية للنهاية" : "Complete protection from start to finish",
			gradient: "from-orange-500 to-red-500",
		},
		{
			icon: <Clock className="w-6 h-6" />,
			title: isArabic ? "توصيل سريع وموثوق" : "Fast & reliable delivery",
			description: isArabic ? "نضمن الوصول في الوقت المحدد" : "On-time delivery guaranteed",
			gradient: "from-amber-500 to-yellow-500",
		},
		{
			icon: <HeadphonesIcon className="w-6 h-6" />,
			title: isArabic ? "دعم 24/7" : "24/7 customer support",
			description: isArabic ? "فريق دعم متاح على مدار الساعة" : "Support team available around the clock",
			gradient: "from-indigo-500 to-violet-500",
		},
	];

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
			{/* Header */}
			<div className="border-b border-gray-200 dark:border-gray-700 p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
				<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
					{isArabic ? "ما المشمول في العرض" : "What's Included"}
				</h2>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
					{isArabic ? "جميع المميزات والخدمات المتاحة مع هذا العرض" : "All features and services included with this offer"}
				</p>
			</div>

			{/* Benefits Grid */}
			<div className="p-5 sm:p-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{benefits.map((benefit, index) => (
						<div
							key={index}
							className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
						>
							<CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
							<div>
								<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
									{benefit.title}
								</h3>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									{benefit.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
});

export default OfferBenefits;

