"use client";

/**
 * Hook for Driver Profile Page logic
 * Handles driver data fetching, state management, and actions
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Driver } from "../types/pick-and-order.types";
import {
	DRIVER_STORAGE_KEYS,
	DEFAULT_DRIVER_VALUES,
	DEFAULT_DRIVER_SPECIALTIES,
} from "../constants/pick-and-order.constants";

interface UseDriverProfileProps {
	driverId: string;
	transportType?: string;
	orderType?: string;
	returnUrl?: string;
	isArabic: boolean;
}

export function useDriverProfile({
	driverId,
	transportType,
	orderType,
	returnUrl,
	isArabic,
}: UseDriverProfileProps) {
	const router = useRouter();
	const [driver, setDriver] = useState<Driver | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch driver data
	useEffect(() => {
		const fetchDriverData = async () => {
			setIsLoading(true);
			try {
				// First, try to get driver data from sessionStorage (from ChooseDriverPage)
				const storedDriverData = sessionStorage.getItem(
					`${DRIVER_STORAGE_KEYS.DRIVER_PREFIX}${driverId}`
				);

				if (storedDriverData) {
					try {
						const parsedDriver = JSON.parse(storedDriverData);

						// Map the stored driver data to the Driver interface
						const driverData: Driver = {
							id: parsedDriver.id || driverId,
							name: parsedDriver.name || "Driver",
							nameAr: parsedDriver.nameAr || "سائق",
							avatar: parsedDriver.avatar || DEFAULT_DRIVER_VALUES.AVATAR,
							rating: parsedDriver.rating || 4.5,
							reviewsCount: parsedDriver.reviewsCount || 0,
							pricePerKm:
								parsedDriver.pricePerKm ||
								(transportType === "motorbike"
									? DEFAULT_DRIVER_VALUES.PRICE_PER_KM_MOTORBIKE
									: DEFAULT_DRIVER_VALUES.PRICE_PER_KM_TRUCK),
							experience: parsedDriver.experience || (isArabic ? "5 سنوات" : "5 years"),
							vehicleType:
								parsedDriver.vehicleType ||
								(transportType === "motorbike" ? "motorbike" : "truck"),
							vehicleModel:
								parsedDriver.vehicleModel ||
								(transportType === "motorbike"
									? "Honda CB500X 2023"
									: "Isuzu D-Max 2022"),
							licensePlate: parsedDriver.licensePlate || "ABC 1234",
							phone: parsedDriver.phone || "+966500000000",
							completedOrders: parsedDriver.reviewsCount || 0,
							joinDate: DEFAULT_DRIVER_VALUES.JOIN_DATE,
							specialties: isArabic
								? Array.from(DEFAULT_DRIVER_SPECIALTIES.ar)
								: Array.from(DEFAULT_DRIVER_SPECIALTIES.en),
							bio: `Experienced delivery driver with ${parsedDriver.experience || "5 years"} of professional service. Specialized in fast and safe deliveries.`,
							bioAr: `سائق توصيل محترف مع ${parsedDriver.experience || "5 سنوات"} من الخبرة. متخصص في التوصيل السريع والآمن.`,
							verified: true,
							responseTime: isArabic ? "أقل من دقيقة" : "< 1 min",
							acceptanceRate: 98,
						};

						setDriver(driverData);
						setIsLoading(false);
						return;
					} catch (parseError) {
						console.error("Error parsing stored driver data:", parseError);
					}
				}

				// Fallback to mock data if not found in sessionStorage
				// TODO: Replace with actual API call
				// const response = await fetch(`/api/drivers/${driverId}`);
				// const data = await response.json();

				await new Promise((resolve) => setTimeout(resolve, 800));

				const mockDriver: Driver = {
					id: driverId,
					name: "Ahmed Mohammed",
					nameAr: "أحمد محمد",
					avatar: DEFAULT_DRIVER_VALUES.AVATAR,
					rating: 4.9,
					reviewsCount: 234,
					pricePerKm:
						transportType === "motorbike"
							? DEFAULT_DRIVER_VALUES.PRICE_PER_KM_MOTORBIKE
							: DEFAULT_DRIVER_VALUES.PRICE_PER_KM_TRUCK,
					experience: isArabic ? "8 سنوات" : "8 years",
					vehicleType: transportType === "motorbike" ? "motorbike" : "truck",
					vehicleModel:
						transportType === "motorbike" ? "Honda CB500X 2023" : "Isuzu D-Max 2022",
					licensePlate: "ABC 1234",
					phone: "+966500000000",
					completedOrders: 1250,
					joinDate: DEFAULT_DRIVER_VALUES.JOIN_DATE,
					specialties: isArabic
						? Array.from(DEFAULT_DRIVER_SPECIALTIES.ar)
						: Array.from(DEFAULT_DRIVER_SPECIALTIES.en),
					bio: "Experienced delivery driver with over 8 years of professional service. Specialized in fast and safe deliveries across Riyadh.",
					bioAr:
						"سائق توصيل محترف مع أكثر من 8 سنوات من الخبرة. متخصص في التوصيل السريع والآمن في جميع أنحاء الرياض.",
					verified: true,
					responseTime: isArabic ? "أقل من دقيقة" : "< 1 min",
					acceptanceRate: 98,
				};

				setDriver(mockDriver);
			} catch (error) {
				console.error("Error fetching driver:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDriverData();
	}, [driverId, transportType, isArabic]);

	// Action handlers
	const handleBack = useCallback(() => {
		if (returnUrl) {
			router.push(returnUrl);
		} else {
			router.back();
		}
	}, [router, returnUrl]);

	const handleChat = useCallback(() => {
		router.push(`/driver/${driverId}/chat`);
	}, [router, driverId]);

	const handleCall = useCallback(() => {
		if (driver?.phone) {
			window.location.href = `tel:${driver.phone}`;
		}
	}, [driver]);

	const handleSelectDriver = useCallback(() => {
		if (transportType && orderType) {
			router.push(
				`/pickandorder/${transportType}/${orderType}/order/payment?driverId=${driverId}`
			);
		}
	}, [router, transportType, orderType, driverId]);

	// Computed values
	const vehicleIcon = useMemo(
		() => (driver?.vehicleType === "truck" ? "truck" : "bike"),
		[driver]
	);

	return {
		// State
		driver,
		isLoading,

		// Actions
		handleBack,
		handleChat,
		handleCall,
		handleSelectDriver,

		// Computed
		vehicleIcon,
	};
}

