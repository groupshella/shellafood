"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, User, Phone } from "lucide-react";
import { HelpTooltip } from "./HelpTooltip";
import type { LocationPointRouteSegment } from "../../../../types/pick-and-order.types";

interface PointCardProps {
	point: LocationPointRouteSegment;
	type: "pickup" | "dropoff";
	hasPoint: boolean;
	isReviewMode: boolean;
	isArabic: boolean;
}

export const PointCard: React.FC<PointCardProps> = ({
	point,
	type,
	hasPoint,
	isReviewMode,
	isArabic,
}) => {
	const [showHelp, setShowHelp] = useState(false);
	const helpRef = useRef<HTMLDivElement>(null);

	// Close tooltip when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
				setShowHelp(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const isPickup = type === "pickup";
	const colorClasses = isPickup
		? {
				bg: hasPoint ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-900/50",
				border: hasPoint ? "border-green-200 dark:border-green-800" : "border-gray-200 dark:border-gray-700",
				iconBg: hasPoint ? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700" : "bg-gray-300 dark:bg-gray-600",
				text: "text-green-600 dark:text-green-400",
				hoverText: "hover:text-green-700 dark:hover:text-green-300",
				hoverBg: "hover:bg-green-100 dark:hover:bg-green-900/30",
			}
		: {
				bg: hasPoint ? "bg-orange-50 dark:bg-orange-900/20" : "bg-gray-50 dark:bg-gray-900/50",
				border: hasPoint ? "border-orange-200 dark:border-orange-800" : "border-gray-200 dark:border-gray-700",
				iconBg: hasPoint ? "bg-gradient-to-br from-orange-500 to-orange-600" : "bg-gray-300 dark:bg-gray-600",
				text: "text-orange-600 dark:text-orange-400",
				hoverText: "hover:text-orange-700 dark:hover:text-orange-300",
				hoverBg: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
			};

	const helpContent = isPickup
		? (isArabic 
			? "انقر على الخريطة لتحديد موقع الالتقاط. يمكنك البحث عن عنوان أو استخدام موقعك الحالي."
			: "Click on the map to select pickup location. You can search for an address or use your current location.")
		: (isArabic
			? "حدد موقع التوصيل النهائي على الخريطة. تأكد من إضافة معلومات الاتصال للمستلم."
			: "Select the final delivery location on the map. Make sure to add contact information for the recipient.");

	return (
		<div className={`
			relative p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200
			${colorClasses.bg} border ${colorClasses.border}
		`}>
			<div className="flex items-start gap-2 sm:gap-3">
				<div className={`
					w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
					${colorClasses.iconBg}
				`}>
					{isPickup ? (
						<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
					) : (
						<Navigation className="w-5 h-5 text-white" />
					)}
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex-1">
							{isArabic 
								? (isPickup ? "نقطة الالتقاط" : "نقطة التوصيل")
								: (isPickup ? "Pickup Point" : "Dropoff Point")
							}
						</p>
						{!hasPoint && !isReviewMode && (
							<HelpTooltip
								isOpen={showHelp}
								onToggle={() => setShowHelp(!showHelp)}
								title={isArabic ? "نصيحة سريعة:" : "Quick Tip:"}
								content={helpContent}
								isArabic={isArabic}
								tooltipRef={helpRef}
							/>
						)}
					</div>
					{hasPoint ? (
						<>
							<p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
								{point.streetName || point.areaName || point.city}
							</p>
							{point.contactName && (
								<div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600 dark:text-gray-400">
									<User className="w-3.5 h-3.5" />
									<span className="font-medium">{point.contactName}</span>
								</div>
							)}
							{point.contactPhone && (
								<div className="mt-2">
									<div className="flex items-center gap-1.5">
										<Phone className={`w-3.5 h-3.5 flex-shrink-0 ${colorClasses.text}`} />
										<span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate" dir="ltr">
											{point.contactPhone}
										</span>
									</div>
								</div>
							)}
						</>
					) : (
						<p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 italic">
							{isArabic ? "غير محدد" : "Not selected"}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

