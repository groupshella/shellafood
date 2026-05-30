"use client";

/**
 * Hook for Service Category Page logic
 * Handles service data fetching, search, and computed values
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ServiceCategoryData, getServiceCategoryBySlug as getDemoServiceCategoryBySlug } from "@/lib/data/serve-me/services";
import { getServiceCategoryBySlug } from "../api/serve-me.api";

export function useServiceCategory(serviceSlug: string, isArabic: boolean) {
	const router = useRouter();
	
	const [serviceData, setServiceData] = useState<ServiceCategoryData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch service data from API with fallback to demo data
	useEffect(() => {
		const fetchServiceData = async () => {
			setIsLoading(true);
			try {
				// Try to fetch from API first
				const apiResponse = await getServiceCategoryBySlug(serviceSlug, isArabic ? 'ar' : 'en');
				
				if (apiResponse.data) {
					// Use API data if available
					setServiceData(apiResponse.data);
				} else {
					// Fallback to demo data if API returns no data
					const demoData = getDemoServiceCategoryBySlug(serviceSlug);
					if (demoData) {
						setServiceData(demoData);
					}
				}
			} catch (error) {
				// On error, fallback to demo data
				console.warn('Failed to fetch service category from API, using demo data:', error);
				const demoData = getDemoServiceCategoryBySlug(serviceSlug);
				if (demoData) {
					setServiceData(demoData);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchServiceData();
	}, [serviceSlug, isArabic]);

	// Memoize computed values
	const title = useMemo(() => 
		isArabic ? serviceData?.titleAr : serviceData?.titleEn, 
		[isArabic, serviceData]
	);

	const description = useMemo(() => 
		isArabic ? serviceData?.descriptionAr : serviceData?.descriptionEn, 
		[isArabic, serviceData]
	);

	const mainServices = useMemo(() => 
		isArabic ? serviceData?.mainServices.ar : serviceData?.mainServices.en, 
		[isArabic, serviceData]
	);

	const whyChooseUs = useMemo(() => 
		isArabic ? serviceData?.whyChooseUs.ar : serviceData?.whyChooseUs.en, 
		[isArabic, serviceData]
	);

	const availableWorkshops = useMemo(() => 
		isArabic ? serviceData?.availableWorkshops.ar : serviceData?.availableWorkshops.en, 
		[isArabic, serviceData]
	);

	// Prefetch all service routes on mount for instant navigation
	useEffect(() => {
		if (mainServices) {
			mainServices.forEach((service) => {
				router.prefetch(service.path);
			});
		}
	
	}, [router, mainServices]);

	

	const handleBookAppointment = useCallback((workshopName: string) => {
		console.log("Book appointment:", workshopName);
		// TODO: Implement booking functionality
	}, []);



	return {
		// State
	
		serviceData,
		isLoading,
		
		// Computed values
		title,
		description,
		mainServices,
		whyChooseUs,
		availableWorkshops,
		
	
		handleBookAppointment,
	};
}

