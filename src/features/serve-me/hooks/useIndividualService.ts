"use client";

/**
 * Hook for Individual Service Page logic
 * Handles service data fetching, state management, and computed values
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IndividualServiceData, getIndividualService as getDemoIndividualService } from "@/lib/data/services";
import { getIndividualService } from "../api/serve-me.api";
import { INDIVIDUAL_SERVICE_REVIEW, INDIVIDUAL_SERVICE_FAQS } from "../constants/serve-me.constants";

export function useIndividualService(serviceSlug: string, serviceTypeSlug: string, isArabic: boolean) {
	const router = useRouter();
	
	const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [serviceData, setServiceData] = useState<IndividualServiceData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch service data from API with fallback to demo data
	useEffect(() => {
		const fetchServiceData = async () => {
			setIsLoading(true);
			try {
				// Try to fetch from API first
				const apiResponse = await getIndividualService(serviceSlug, serviceTypeSlug, isArabic ? 'ar' : 'en');
				
				if (apiResponse.data) {
					// Use API data if available
					setServiceData(apiResponse.data);
				} else {
					// Fallback to demo data if API returns no data
					const demoData = getDemoIndividualService(serviceSlug, serviceTypeSlug);
					if (demoData) {
						setServiceData(demoData);
					}
				}
			} catch (error) {
				// On error, fallback to demo data
				console.warn('Failed to fetch individual service from API, using demo data:', error);
				const demoData = getDemoIndividualService(serviceSlug, serviceTypeSlug);
				if (demoData) {
					setServiceData(demoData);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchServiceData();
	}, [serviceSlug, serviceTypeSlug, isArabic]);

	// Memoize computed values
	const title = useMemo(() => 
		isArabic ? serviceData?.titleAr : serviceData?.titleEn, 
		[isArabic, serviceData]
	);

	const description = useMemo(() => 
		isArabic ? serviceData?.descriptionAr : serviceData?.descriptionEn, 
		[isArabic, serviceData]
	);

	const features = useMemo(() => 
		isArabic ? serviceData?.features.ar : serviceData?.features.en, 
		[isArabic, serviceData]
	);

	const serviceDetails = useMemo(() => 
		isArabic ? serviceData?.serviceDetails.ar : serviceData?.serviceDetails.en, 
		[isArabic, serviceData]
	);

	const rating = useMemo(() => 
		serviceData ? Math.floor(serviceData.rating) : 0, 
		[serviceData]
	);

	// Text constants
	const priceText = isArabic ? "ريال" : "SAR";
	const startsFromText = isArabic ? "يبدأ من" : "Starts from";
	const priceIncludesText = isArabic 
		? "السعر يشمل الجلسة والتقييم الكامل" 
		: "Price includes full session and comprehensive assessment";
	const reviewsText = isArabic ? "تقييم" : "reviews";
	const bookNowTitle = isArabic ? "احجز موعدك" : "Book Your Appointment";
	const chooseTechnicianText = isArabic ? "احجز الآن" : "Book Now";
	const statusValue = isArabic ? "متاح الآن" : "Available Now";
	const responseTimeValue = isArabic ? "خلال 24 ساعة" : "Within 24 hours";
	const guaranteeValue = isArabic ? "100% رضا العملاء" : "100% Satisfaction";

	const bookingPath = `/serve-me/${serviceSlug}/${serviceTypeSlug}/book/details`;

	// Prefetch booking route on mount and hover
	useEffect(() => {
		router.prefetch(bookingPath);
	}, [router, bookingPath]);

	const handleBookingMouseEnter = useCallback(() => {
		localStorage.removeItem("bookingData");
		router.prefetch(bookingPath);
	}, [router, bookingPath]);

	// Mock service gallery images
	const galleryImages = useMemo(() => {
		if (!serviceData?.heroImage) return [];
		const baseImages = [
			serviceData.heroImage,
			"https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200",
			"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200",
			"https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200",
		];
		return baseImages.slice(0, 4);
	}, [serviceData]);

	// Get reviews from constants
	const reviews = useMemo(() => 
		INDIVIDUAL_SERVICE_REVIEW[isArabic ? "ar" : "en"],
		[isArabic, INDIVIDUAL_SERVICE_REVIEW]
	);

	// Get FAQs from constants
	const faqs = useMemo(() => 
		isArabic ? INDIVIDUAL_SERVICE_FAQS.ar : INDIVIDUAL_SERVICE_FAQS.en,
		[isArabic]
	);

	// Event handlers
	const scrollToBooking = useCallback(() => {
		const bookingElement = document.getElementById("booking-section");
		if (bookingElement) {
			bookingElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);

	const toggleFAQ = useCallback((index: number) => {
		setOpenFAQIndex(prev => prev === index ? null : index);
	}, []);

	return {
		// State
		openFAQIndex,
		selectedImageIndex,
		setSelectedImageIndex,
		serviceData,
		isLoading,
		
		// Computed values
		title,
		description,
		features,
		serviceDetails,
		rating,
		galleryImages,
		reviews,
		faqs,
		
		// Text constants
		priceText,
		startsFromText,
		priceIncludesText,
		reviewsText,
		bookNowTitle,
		chooseTechnicianText,
		statusValue,
		responseTimeValue,
		guaranteeValue,
		
		// Paths
		bookingPath,
		
		// Event handlers
		scrollToBooking,
		toggleFAQ,
		handleBookingMouseEnter,
	};
}

