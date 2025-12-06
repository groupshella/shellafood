"use client";

/**
 * Hook for driver profile data management
 */

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/providers';
import { getDriverProfile } from '../api/driver.api';
import type { Driver } from '../types/driver.types';

export interface UseDriverProfileReturn {
	driver: Driver | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage driver profile data
 * Supports sessionStorage fallback for better UX
 */
export function useDriverProfile(driverId: string): UseDriverProfileReturn {
	const { language } = useLanguage();
	const [driver, setDriver] = useState<Driver | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDriverData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			// First, try to get driver data from sessionStorage (from ChooseDriverPage)
			const storedDriverData = sessionStorage.getItem(`driver_${driverId}`);
			
			if (storedDriverData) {
				try {
					const parsedDriver = JSON.parse(storedDriverData);
					
					// Map the stored driver data to the Driver interface
					const driverData: Driver = {
						id: parsedDriver.id || driverId,
						name: parsedDriver.name || "Driver",
						nameAr: parsedDriver.nameAr || "سائق",
						avatar: parsedDriver.avatar || "/driver1.jpg",
						rating: parsedDriver.rating || 4.5,
						reviewsCount: parsedDriver.reviewsCount || 0,
						pricePerKm: parsedDriver.pricePerKm || 5.0,
						experience: parsedDriver.experience || (language === 'ar' ? "5 سنوات" : "5 years"),
						vehicleType: parsedDriver.vehicleType || "truck",
						vehicleModel: parsedDriver.vehicleModel || "Isuzu D-Max 2022",
						licensePlate: parsedDriver.licensePlate || "ABC 1234",
						phone: parsedDriver.phone || "+966500000000",
						completedOrders: parsedDriver.completedOrders || parsedDriver.reviewsCount || 0,
						joinDate: parsedDriver.joinDate || "2016-03-15",
						specialties: parsedDriver.specialties || [
							language === 'ar' ? "توصيل سريع" : "Fast Delivery",
							language === 'ar' ? "خدمة ممتازة" : "Excellent Service",
							language === 'ar' ? "تعامل احترافي" : "Professional",
							language === 'ar' ? "متاح على مدار الساعة" : "24/7 Available",
						],
						bio: parsedDriver.bio || `Experienced delivery driver with ${parsedDriver.experience || "5 years"} of professional service. Specialized in fast and safe deliveries.`,
						bioAr: parsedDriver.bioAr || `سائق توصيل محترف مع ${parsedDriver.experience || "5 سنوات"} من الخبرة. متخصص في التوصيل السريع والآمن.`,
						verified: parsedDriver.verified !== undefined ? parsedDriver.verified : true,
						responseTime: parsedDriver.responseTime || (language === 'ar' ? "أقل من دقيقة" : "< 1 min"),
						acceptanceRate: parsedDriver.acceptanceRate || 98,
						online: parsedDriver.online !== undefined ? parsedDriver.online : true,
						lastSeen: parsedDriver.lastSeen ? new Date(parsedDriver.lastSeen) : new Date(),
					};
					
					setDriver(driverData);
					setIsLoading(false);
					return;
				} catch (parseError) {
					console.error("Error parsing stored driver data:", parseError);
				}
			}

			// Fetch from API
			const result = await getDriverProfile(driverId, language);
			
			if (result.data) {
				setDriver(result.data);
			} else {
				// Fallback to mock data if API fails
				const mockDriver: Driver = {
					id: driverId,
					name: "Ahmed Mohammed",
					nameAr: "أحمد محمد",
					avatar: "/driver1.jpg",
					rating: 4.9,
					reviewsCount: 234,
					pricePerKm: 5.0,
					experience: language === 'ar' ? "8 سنوات" : "8 years",
					vehicleType: "truck",
					vehicleModel: "Isuzu D-Max 2022",
					licensePlate: "ABC 1234",
					phone: "+966500000000",
					completedOrders: 1250,
					joinDate: "2016-03-15",
					specialties: [
						language === 'ar' ? "توصيل سريع" : "Fast Delivery",
						language === 'ar' ? "خدمة ممتازة" : "Excellent Service",
						language === 'ar' ? "تعامل احترافي" : "Professional",
						language === 'ar' ? "متاح على مدار الساعة" : "24/7 Available",
					],
					bio: "Experienced delivery driver with over 8 years of professional service. Specialized in fast and safe deliveries across Riyadh.",
					bioAr: "سائق توصيل محترف مع أكثر من 8 سنوات من الخبرة. متخصص في التوصيل السريع والآمن في جميع أنحاء الرياض.",
					verified: true,
					responseTime: language === 'ar' ? "أقل من دقيقة" : "< 1 min",
					acceptanceRate: 98,
					online: true,
					lastSeen: new Date(),
				};
				setDriver(mockDriver);
				setError(result.error || 'Failed to load driver profile');
			}
		} catch (err) {
			console.error("Error fetching driver:", err);
			setError(err instanceof Error ? err.message : 'Failed to load driver profile');
		} finally {
			setIsLoading(false);
		}
	}, [driverId, language]);

	useEffect(() => {
		fetchDriverData();
	}, [fetchDriverData]);

	return {
		driver,
		isLoading,
		error,
		refetch: fetchDriverData,
	};
}

