"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers";
import {
	OfferHero,
	OfferDriverCard,
	OfferBenefits,
	OfferCTABar,
	OfferTerms,
	OfferLoading,
	OfferNotFound,
} from "./index";
import type { Offer, OfferDriver, OfferBookingData } from "../types";
import offerService from "../services/offer.service";

interface OfferDetailsClientProps {
	params: Promise<{ offerId: string }>;
}

export default function OfferDetailsClient({
	params,
}: OfferDetailsClientProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	// State
	const [offer, setOffer] = useState<Offer | null>(null);
	const [driver, setDriver] = useState<OfferDriver | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [copiedPromo, setCopiedPromo] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [transportType, setTransportType] = useState<string>("motorbike");
	const [orderType, setOrderType] = useState<string>("one-way");

	// Load offer data
	useEffect(() => {
		async function loadOfferData() {
			try {
				const resolvedParams = await params;
				const offerId = parseInt(resolvedParams.offerId);

				// Fetch offer
				const fetchedOffer = await offerService.getOfferById(offerId);

				if (!fetchedOffer) {
					setIsLoading(false);
					return;
				}

				setOffer(fetchedOffer);

				// Extract transport type and order type from offer link
				let tType = "motorbike";
				let oType = "one-way";

				if (fetchedOffer.link) {
					// New structure: /pickandorder/[transportType]/[type]/order/details
					const pathParts = fetchedOffer.link.split("/").filter(Boolean);
					if (pathParts.length >= 2) {
						tType = pathParts[1]; // transportType
					}
					if (pathParts.length >= 3) {
						oType = pathParts[2]; // type
					}
				}

				setTransportType(tType);
				setOrderType(oType);

				// Generate mock driver
				const mockDriver = offerService.getMockDriver(fetchedOffer, language);
				setDriver(mockDriver);

				setIsLoading(false);
			} catch (error) {
				console.error("Error loading offer:", error);
				setIsLoading(false);
			}
		}

		loadOfferData();
	}, [params, language]);

	// Copy promo code
	const handleCopyPromo = useCallback(() => {
		if (offer?.promoCode) {
			navigator.clipboard.writeText(offer.promoCode);
			setCopiedPromo(true);
			setTimeout(() => setCopiedPromo(false), 2000);
		}
	}, [offer]);

	// Book offer
	const handleBookOffer = useCallback(() => {
		if (!offer || !driver) return;

		setIsProcessing(true);

		// Clear all temporary order tracking data to start fresh
		if (typeof window !== "undefined") {
			sessionStorage.removeItem("pickAndOrderDetails");
			sessionStorage.removeItem("multiDirectionOrder");
			sessionStorage.removeItem("orderPricing");
			sessionStorage.removeItem("orderConfirmation");
			// Clear route segments if exists
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key && key.startsWith("routeSegments")) {
					sessionStorage.removeItem(key);
				}
			}
		}

		// Store offer data in sessionStorage
		const offerBookingData: OfferBookingData = {
			offerId: offer.id,
			offerTitle: offer.title,
			offerTitleEn: offer.titleEn,
			discount: offer.discount || { type: "percentage", value: 0 },
			promoCode: offer.promoCode || "",
			preSelectedDriver: driver,
			transportType,
			orderType,
			validUntil: offer.validUntil || "2025-12-31",
		};

		sessionStorage.setItem("offerBooking", JSON.stringify(offerBookingData));

		// Navigate to order details
		setTimeout(() => {
			router.push(
				`/pickandorder/${transportType}/${orderType}/order/details?fromOffer=true`
			);
		}, 300);
	}, [offer, driver, transportType, orderType, router]);

	// Store driver data in sessionStorage (shared helper function)
	const storeDriverData = useCallback(() => {
		if (driver && typeof window !== "undefined") {
			// Store driver data in sessionStorage (same format as ChooseDriverPage)
			// This ensures the chat/profile pages can access the same driver data
			const driverData: any = {
				id: driver.id,
				name: driver.name,
				nameAr: driver.nameAr,
				avatar: driver.avatar,
				rating: driver.rating,
				reviewsCount: driver.reviewsCount,
				pricePerKm: driver.pricePerKm || (transportType === "motorbike" ? 2.5 : 5.0),
				experience: driver.experience || (driver.yearsOfExperience ? `${driver.yearsOfExperience} ${isArabic ? "سنوات" : "years"}` : (isArabic ? "5 سنوات" : "5 years")),
				vehicleType: driver.vehicleType || (transportType === "motorbike" ? "motorbike" : "truck"),
				vehicleModel: driver.vehicleModel || "",
				licensePlate: driver.licensePlate || "",
				phone: driver.phone || "+966500000000",
				location: driver.location || "",
				distance: typeof driver.distance === "number" ? driver.distance : 0,
				estimatedTime: typeof driver.estimatedTime === "number" ? `${driver.estimatedTime} ${isArabic ? "دقيقة" : "min"}` : driver.estimatedTime || "",
				verified: driver.verified || false,
				insured: driver.insured || false,
			};
			
			// Add lat/lng if available (they might not be in OfferDriver type)
			if ((driver as any).lat) driverData.lat = (driver as any).lat;
			if ((driver as any).lng) driverData.lng = (driver as any).lng;
			
			sessionStorage.setItem(`driver_${driver.id}`, JSON.stringify(driverData));
		}
	}, [driver, transportType, isArabic]);

	// Chat with driver
	const handleChatDriver = useCallback(() => {
		if (driver) {
			storeDriverData();
			router.push(`/driver/${driver.id}/chat`);
		}
	}, [driver, router, storeDriverData]);

	// View driver profile
	const handleViewDriverProfile = useCallback(() => {
		if (driver) {
			storeDriverData();
			router.push(`/driver/${driver.id}`);
		}
	}, [driver, router, storeDriverData]);

	// Check if expired
	const isExpired = useMemo(() => {
		if (!offer?.validUntil) return false;
		return new Date(offer.validUntil) < new Date();
	}, [offer]);

	// Calculate days remaining
	const daysRemaining = useMemo(() => {
		if (!offer?.validUntil) return null;
		const diff = new Date(offer.validUntil).getTime() - new Date().getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	}, [offer]);

	// Loading state
	if (isLoading) {
		return <OfferLoading isArabic={isArabic} />;
	}

	// Not found state
	if (!offer) {
		return <OfferNotFound isArabic={isArabic} />;
	}

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			className="flex-1 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
		>
			{/* Hero Section */}
			<OfferHero
				offer={offer}
				isArabic={isArabic}
				copiedPromo={copiedPromo}
				daysRemaining={daysRemaining}
				onCopyPromo={handleCopyPromo}
			/>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 pb-32">
				{/* Pre-Selected Driver Card */}
				{driver && (
					<OfferDriverCard
						driver={driver}
						isArabic={isArabic}
						onViewProfile={handleViewDriverProfile}
						onChat={handleChatDriver}
					/>
				)}

				{/* Benefits Section */}
				<OfferBenefits offer={offer} isArabic={isArabic} />

				{/* Terms & Conditions */}
				<OfferTerms offer={offer} isArabic={isArabic} />
			</main>

			{/* Sticky CTA Bar */}
			<OfferCTABar
				isArabic={isArabic}
				isExpired={isExpired}
				isLoading={isProcessing}
				onBookNow={handleBookOffer}
			/>
		</div>
	);
}
