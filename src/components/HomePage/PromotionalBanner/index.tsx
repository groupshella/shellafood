"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BannerSlide from "./BannerSlide";
import BannerPagination from "./BannerPagination";
import offerService from "@/services/offer.service";
import { Offer } from "@/types/offer.types";

export default function PromotionalBanner() {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);
	const [offers, setOffers] = useState<Offer[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Minimum swipe distance (in pixels)
	const minSwipeDistance = 50;

	// Load offers from service
	useEffect(() => {
		async function loadOffers() {
			try {
				const allOffers = await offerService.getAllOffers();
				// Use featured offers, or fallback to all offers if no featured ones
				const featuredOffers = allOffers.filter((offer) => offer.featured);
				setOffers(featuredOffers.length > 0 ? featuredOffers : allOffers);
			} catch (error) {
				console.error("Error loading offers:", error);
				setOffers([]);
			} finally {
				setIsLoading(false);
			}
		}

		loadOffers();
	}, []);

	// Auto-play carousel
	useEffect(() => {
		if (!isAutoPlaying || offers.length === 0) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % offers.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, offers.length]);

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};

	const nextSlide = () => {
		if (offers.length === 0) return;
		goToSlide((currentIndex + 1) % offers.length);
	};

	const prevSlide = () => {
		if (offers.length === 0) return;
		goToSlide((currentIndex - 1 + offers.length) % offers.length);
	};

	// Touch handlers for swipe
	const onTouchStart = (e: React.TouchEvent) => {
		// Don't start swipe if touching a button or interactive element
		const target = e.target as HTMLElement;
		if (target.closest("button") || target.closest("a")) {
			return;
		}
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) {
			setTouchStart(null);
			setTouchEnd(null);
			return;
		}

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		// Swipe direction logic (reversed from typical carousel)
		// Swipe left = previous slide, Swipe right = next slide
		if (isLeftSwipe) {
			prevSlide();
		} else if (isRightSwipe) {
			nextSlide();
		}

		// Reset touch values
		setTouchStart(null);
		setTouchEnd(null);
	};

	// Handle banner click
	const handleBannerClick = (offer: Offer) => {
		// Check if it's a delivery offer (has link to pickandorder)
		const isDeliveryOffer = offer.link?.includes("/pickandorder/");

		if (isDeliveryOffer) {
			// Extract transport type and order type from link
			try {
				const url = new URL(offer.link, window.location.origin);
				const pathParts = url.pathname.split("/").filter(Boolean);
				const transportType = pathParts[1] || "motorbike"; // pickandorder/[transportType]
				const orderType = url.searchParams.get("type") || "one-way";

				// Navigate to offer details page
				router.push(`/offers/${offer.id}?transport=${transportType}&type=${orderType}`);
			} catch (error) {
				console.error("Error parsing offer link:", error);
				router.push(`/offers/${offer.id}`);
			}
		} else {
			// For non-delivery offers, navigate to the link or offer details
			if (offer.link && offer.link.startsWith("/")) {
				router.push(offer.link);
			} else {
				router.push(`/offers/${offer.id}`);
			}
		}
	};

	// Don't render if loading or no offers
	if (isLoading || offers.length === 0) {
		return null;
	}

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.3 }}
			className="mb-8 sm:mb-12 relative group"
			onMouseEnter={() => setIsAutoPlaying(false)}
			onMouseLeave={() => setIsAutoPlaying(true)}
		>
			<div
				className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl touch-pan-y"
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			>
				<AnimatePresence mode="wait">
					{offers[currentIndex] && (
						<BannerSlide
							key={currentIndex}
							banner={offers[currentIndex]}
							isArabic={isArabic}
							onClick={() => handleBannerClick(offers[currentIndex])}
						/>
					)}
				</AnimatePresence>

				{/* Navigation Arrows - Hidden on mobile, visible on hover for desktop */}
				{offers.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.stopPropagation();
								prevSlide();
							}}
							className={`absolute ${
								isArabic ? "right-2 sm:right-4" : "left-2 sm:left-4"
							} top-1/2 -translate-y-1/2 z-30 hidden sm:flex w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-0 sm:group-hover:opacity-100 touch-manipulation`}
							aria-label={isArabic ? "السابق" : "Previous"}
						>
							{isArabic ? (
								<ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-gray-100" />
							) : (
								<ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-gray-100" />
							)}
						</button>

						<button
							onClick={(e) => {
								e.stopPropagation();
								nextSlide();
							}}
							className={`absolute ${
								isArabic ? "left-2 sm:left-4" : "right-2 sm:right-4"
							} top-1/2 -translate-y-1/2 z-30 hidden sm:flex w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-0 sm:group-hover:opacity-100 touch-manipulation`}
							aria-label={isArabic ? "التالي" : "Next"}
						>
							{isArabic ? (
								<ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-gray-100" />
							) : (
								<ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-gray-100" />
							)}
						</button>
					</>
				)}

				{/* Pagination */}
				{offers.length > 1 && (
					<BannerPagination
						banners={offers}
						currentIndex={currentIndex}
						onSlideClick={goToSlide}
						isArabic={isArabic}
					/>
				)}
			</div>
		</motion.section>
	);
}
