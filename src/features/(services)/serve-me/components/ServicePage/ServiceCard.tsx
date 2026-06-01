"use client";

import React, { memo, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { BookingData } from "@/providers/BookingContext";

interface ServiceCardProps {
	title: string;
	icon: React.ReactNode | null;
	image: string;
	serviceSlugPath: string;
	buttonText: string;
	isArabic: boolean;
	serviceSlug: string;
	description?: string;
	onClick?: () => void;
}

/**
 * Service Card Component
 * Modern, professional service card with image, icon, title, description, and CTA button
 * Enhanced UI/UX with smooth animations and responsive design
 * Full RTL/LTR support for Arabic and English
 */
export const ServiceCard: React.FC<ServiceCardProps> = memo(({
	title,
	icon,
	image,
	buttonText,
	isArabic,
	serviceSlugPath,
	serviceSlug,
	description,
	onClick,
}) => {
	console.log(serviceSlug);
	const router = useRouter();
	const [hasExistingBooking, setHasExistingBooking] = useState(false);

	// Check if service exists in localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				const bookingDataStr = localStorage.getItem("bookingData");
				if (bookingDataStr) {
					const bookingData: BookingData = JSON.parse(bookingDataStr);
					// Check if serviceId matches the current serviceSlug
					// serviceId is set to serviceType (serviceTypeSlug) in the booking form
					console.log("BookingData serviceId:", bookingData.serviceId);
					console.log("Current serviceSlug:", serviceSlug);
					if (bookingData.serviceId === serviceSlug) {
						setHasExistingBooking(true);
						console.log("✅ Matching booking found - showing Return Order button");
					} else {
						setHasExistingBooking(false);
						console.log("❌ No matching booking found");
					}
				} else {
					setHasExistingBooking(false);
					console.log("❌ No bookingData in localStorage");
				}
			} catch (error) {
				console.error("Error reading bookingData from localStorage:", error);
				setHasExistingBooking(false);
			}
		}
	}, [serviceSlug]);

	const handleOrderClick = useCallback((e: React.MouseEvent) => {
		if (onClick) {
			onClick();
		}
		// Remove localStorage when clicking "Order" to start fresh
		if (typeof window !== "undefined") {
			console.log("🗑️ Removing bookingData from localStorage (starting new order)");
			localStorage.removeItem("bookingData");
		}
	}, [onClick]);

	const handleReturnOrderClick = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		if (onClick) {
			onClick();
		}
		// Keep localStorage when clicking "Return Order" (form will auto-fill)
		console.log("↩️ Returning to existing order - keeping bookingData in localStorage");
		router.push(serviceSlugPath);
	}, [onClick, router, serviceSlugPath]);

	// Prefetch route on hover for instant navigation
	const handleMouseEnter = useCallback(() => {
		router.prefetch(serviceSlugPath);
	}, [router, serviceSlugPath]);

	return (
		<motion.div
			whileHover={{ y: -4, scale: 1.02 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-[#10b981]/30 dark:hover:border-green-500/50 ${
				isArabic ? "rtl" : "ltr"
			}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Image Container */}
			<div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
				<Image
					src={image}
					alt={title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover transition-transform duration-500 group-hover:scale-110"
					priority={false}
				/>
				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
				
				{/* Icon Overlay - Centered */}
				{icon && (
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border-2 border-white/50 dark:border-gray-700/50 group-hover:scale-110 transition-transform duration-300"
					>
						<div className="text-[#10b981] dark:text-green-400 flex items-center justify-center">
							{icon}
						</div>
					</motion.div>
				)}
			</div>

			{/* Content */}
			<div className="p-5 sm:p-6">
				{/* Title */}
				<h3 className={`text-lg sm:text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100 mb-3 text-center ${
					isArabic ? "text-right" : "text-left"
				}`}>
					{title}
				</h3>

				{/* Description */}
				{description && (
					<p className={`text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed ${
						isArabic ? "text-right" : "text-left"
					}`}>
						{description}
					</p>
				)}

				{/* Buttons Container */}
				<div className={`flex gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
					{/* Order Button - Always visible */}
					<Link
						href={serviceSlugPath}
						onClick={handleOrderClick}
						onMouseEnter={handleMouseEnter}
						prefetch={true}
						aria-label={isArabic ? `${buttonText} - ${title}` : `${buttonText} - ${title}`}
						className={`group/btn flex-1 rounded-xl bg-gradient-to-r from-[#10b981] via-emerald-600 to-teal-600 hover:from-[#059669] hover:via-emerald-700 hover:to-teal-700 text-white py-3 sm:py-3.5 px-4 sm:px-6 font-bold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#10b981]/30 text-center focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-offset-2 active:scale-[0.98]`}
					>
						<span className="flex items-center justify-center gap-2">
							{buttonText}
							<motion.span
								animate={{ x: isArabic ? [0, -4, 0] : [0, 4, 0] }}
								transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
								className="inline-block"
							>
								{isArabic ? "←" : "→"}
							</motion.span>
						</span>
					</Link>

					{/* Return Order Button - Only visible if booking exists */}
					{hasExistingBooking && (
						<Link
							href={serviceSlugPath}
							onClick={handleReturnOrderClick}
							onMouseEnter={handleMouseEnter}
							prefetch={true}
							aria-label={isArabic ? `العودة للطلب - ${title}` : `Return Order - ${title}`}
							className={`group/btn flex-1 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white py-3 sm:py-3.5 px-4 sm:px-6 font-bold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/30 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]`}
						>
							<span className="flex items-center justify-center gap-2">
								{isArabic ? "العودة للطلب" : "Return Order"}
								<motion.span
									animate={{ x: isArabic ? [0, -4, 0] : [0, 4, 0] }}
									transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
									className="inline-block"
								>
									{isArabic ? "←" : "→"}
								</motion.span>
							</span>
						</Link>
					)}
				</div>
			</div>
		</motion.div>
	);
});

ServiceCard.displayName = "ServiceCard";
