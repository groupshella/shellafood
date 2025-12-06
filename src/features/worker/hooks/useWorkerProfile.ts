"use client";

/**
 * Hook for worker profile data management
 */

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/providers';
import { getWorkerProfile } from '../api/worker.api';
import type { Worker } from '../types/worker.types';

export interface UseWorkerProfileReturn {
	worker: Worker | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage worker profile data
 * Supports sessionStorage fallback for better UX
 */
export function useWorkerProfile(workerId: string): UseWorkerProfileReturn {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const [worker, setWorker] = useState<Worker | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchWorkerData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Base mock worker data with all required fields
			const baseMockWorker: Worker = {
				id: workerId,
				name: "Ahmed Mohammed",
				nameAr: "أحمد محمد",
				avatar: "/worker1.jpg",
				rating: 4.8,
				reviewsCount: 127,
				experience: isArabic ? "8 سنوات" : "8 years",
				location: isArabic ? "الرياض" : "Riyadh",
				responseTime: isArabic ? "خلال ساعة" : "Within 1 hour",
				phone: "+966 50 123 4567",
				about: "Professional lawyer with extensive experience in commercial and real estate law.",
				aboutAr: "محامي محترف مع خبرة واسعة في القانون التجاري والعقاري.",
				skills: isArabic 
					? ["استشارة قانونية", "كتابة العقود", "قضايا تجارية"]
					: ["Legal Consultation", "Contract Writing", "Commercial Cases"],
				education: isArabic 
					? ["ماجستير في القانون - جامعة الملك سعود"]
					: ["Master's in Law - King Saud University"],
				certifications: isArabic 
					? ["شهادة المحاماة السعودية"]
					: ["Saudi Bar Association License"],
				verified: true,
				online: true,
				lastSeen: new Date(),
			};

			// Try to get sessionStorage data to merge with mock data (only in browser)
			let storedWorkerData: Partial<Worker> | null = null;
			if (typeof window !== 'undefined') {
				const storedData = sessionStorage.getItem(`worker_${workerId}`);
				if (storedData) {
					try {
						storedWorkerData = JSON.parse(storedData);
					} catch (parseError) {
						console.error("Error parsing stored worker data:", parseError);
					}
				}
			}

			// Merge sessionStorage data with mock data (sessionStorage values override mock where present)
			// But always ensure skills, about, education, certifications are present
			const finalWorker: Worker = {
				...baseMockWorker,
				...(storedWorkerData || {}),
				// Ensure these fields are always present (use mock if not in sessionStorage)
				skills: storedWorkerData?.skills && storedWorkerData.skills.length > 0 
					? storedWorkerData.skills 
					: baseMockWorker.skills,
				about: storedWorkerData?.about || baseMockWorker.about,
				aboutAr: storedWorkerData?.aboutAr || baseMockWorker.aboutAr,
				education: storedWorkerData?.education && storedWorkerData.education.length > 0
					? storedWorkerData.education
					: baseMockWorker.education,
				certifications: storedWorkerData?.certifications && storedWorkerData.certifications.length > 0
					? storedWorkerData.certifications
					: baseMockWorker.certifications,
			};

			setWorker(finalWorker);
			
			// TODO: Uncomment when API is ready
			// const result = await getWorkerProfile(workerId, language);
			// if (result.data) {
			// 	setWorker(result.data);
			// } else {
			// 	setWorker(finalWorker);
			// 	setError(result.error || null);
			// }
		} catch (err) {
			console.error("Error fetching worker:", err);
			setError(err instanceof Error ? err.message : (isArabic ? "خطأ غير متوقع" : "An unexpected error occurred"));
		} finally {
			setIsLoading(false);
		}
	}, [workerId, isArabic, language]);

	useEffect(() => {
		fetchWorkerData();
	}, [fetchWorkerData]);

	return {
		worker,
		isLoading,
		error,
		refetch: fetchWorkerData,
	};
}

