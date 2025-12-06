"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/providers";
import { useBooking } from "@/providers";
import StepperNavigation from "../StepperNavigation";
import WorkerAutoSelectConfirmModal from "../modals/WorkerAutoSelectConfirmModal";
import { ArrowRight, Edit2, FileText, MapPin, Calendar, Clock, Image as ImageIcon, Video, Sparkles, Star, Loader2 } from "lucide-react";
import { findBestWorker, STORAGE_KEYS } from "../../../lib/utils/workerUtils";
import { calculatePricing } from "../../../lib/utils/pricing";
import type { RecommendedWorker } from "../../../types/serve-me.types";

export default function BookingSummaryPage({ service, serviceType }: { service: string; serviceType: string }) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { bookingData, updateBooking } = useBooking();
	
	const [isFindingWorker, setIsFindingWorker] = useState(false);
	const [recommendedWorker, setRecommendedWorker] = useState<RecommendedWorker | null>(null);
	const [showAutoSelectModal, setShowAutoSelectModal] = useState(false);
	const [isAutoSelectLoading, setIsAutoSelectLoading] = useState(false);

	// Memoized paths
	const detailsPath = useMemo(() => `/serve-me/${service}/${serviceType}/book/details`, [service, serviceType]);
	const chooseWorkerPath = useMemo(() => `/serve-me/${service}/${serviceType}/book/choose-worker`, [service, serviceType]);
	const paymentPath = useMemo(() => `/serve-me/${service}/${serviceType}/book/payment`, [service, serviceType]);

	// Redirect if no booking data
	useEffect(() => {
		if (!bookingData || !bookingData.description) {
			router.prefetch(detailsPath);
			router.push(detailsPath);
		}
	}, [bookingData, router, detailsPath]);

	// Restore auto-select modal when coming back from worker details
	useEffect(() => {
		// Check sessionStorage for modal state
		const modalShouldBeOpen = sessionStorage.getItem("autoSelectModalOpen") === "true";
		
		// Also check URL for fromModal parameter (handles browser back button)
		const urlParams = new URLSearchParams(window.location.search);
		const fromModal = urlParams.get("fromModal");
		
		if ((fromModal === "true" || modalShouldBeOpen) && recommendedWorker) {
			// Small delay to ensure page is fully loaded
			setTimeout(() => {
				setShowAutoSelectModal(true);
			}, 300);
		}
	}, [recommendedWorker]);

	// Listen for browser back/forward navigation
	useEffect(() => {
		const handlePopState = () => {
			const modalShouldBeOpen = sessionStorage.getItem("autoSelectModalOpen") === "true";
			if (modalShouldBeOpen && recommendedWorker) {
				setTimeout(() => {
					setShowAutoSelectModal(true);
				}, 100);
			}
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [recommendedWorker]);

	// Handlers with useCallback
	const handleEdit = useCallback(() => {
		router.push(detailsPath);
	}, [router, detailsPath]);

	const handleProceed = useCallback(() => {
		router.push(chooseWorkerPath);
	}, [router, chooseWorkerPath]);

	const handlePlatformRecommendation = useCallback(async () => {
		setIsFindingWorker(true);
		setIsAutoSelectLoading(true);
		try {
			const worker = await findBestWorker();
			setRecommendedWorker(worker);
			// Show loading state first, then show modal
			setTimeout(() => {
				setIsAutoSelectLoading(false);
				setShowAutoSelectModal(true);
			}, 500);
		} catch (error) {
			console.error("Error finding worker:", error);
			setIsAutoSelectLoading(false);
		} finally {
			setIsFindingWorker(false);
		}
	}, []);

	// Calculate pricing breakdown for the recommended worker
	const priceBreakdown = useMemo(() => {
		if (!recommendedWorker) return null;
		return calculatePricing(recommendedWorker.price);
	}, [recommendedWorker]);

	// Convert RecommendedWorker to Worker format for modal
	const selectedWorker = useMemo(() => {
		if (!recommendedWorker) return null;
		return {
			id: recommendedWorker.id,
			name: recommendedWorker.name,
			nameAr: recommendedWorker.nameAr,
			rating: recommendedWorker.rating,
			reviewsCount: recommendedWorker.reviewsCount,
			price: recommendedWorker.price,
			experience: recommendedWorker.experience,
			experienceAr: recommendedWorker.experienceAr,
			location: recommendedWorker.location,
			specialization: recommendedWorker.specialization,
			specializationAr: recommendedWorker.specializationAr,
			distance: recommendedWorker.distance,
			avatar: recommendedWorker.avatar,
			estimatedTime: Math.round(recommendedWorker.distance * 3), // Estimate: 3 minutes per km
		};
	}, [recommendedWorker]);

	const handleConfirmAutoSelect = useCallback(() => {
		if (!recommendedWorker || !priceBreakdown) return;

		setShowAutoSelectModal(false);
		// Clean up sessionStorage
		sessionStorage.removeItem("autoSelectModalOpen");
		sessionStorage.removeItem("autoSelectModalWorkerId");

		// Store worker data in sessionStorage before navigating
		if (typeof window !== "undefined") {
			const workerData = {
				id: recommendedWorker.id,
				name: recommendedWorker.name,
				nameAr: recommendedWorker.nameAr,
				avatar: recommendedWorker.avatar,
				rating: recommendedWorker.rating,
				reviewsCount: recommendedWorker.reviewsCount,
				experience: recommendedWorker.experience,
				experienceAr: recommendedWorker.experienceAr,
				location: recommendedWorker.location,
				specialization: recommendedWorker.specialization,
				specializationAr: recommendedWorker.specializationAr,
				distance: recommendedWorker.distance,
				estimatedTime: Math.round(recommendedWorker.distance * 3),
				price: recommendedWorker.price,
			};
			sessionStorage.setItem(`worker_${recommendedWorker.id}`, JSON.stringify(workerData));
		}

		// Store pricing data for payment page
		if (priceBreakdown && typeof window !== "undefined") {
			sessionStorage.setItem("orderPricing", JSON.stringify(priceBreakdown));
		}

		// Navigate to waiting worker page
		setTimeout(() => {
			router.push(`/serve-me/${service}/${serviceType}/order/waiting-worker?workerId=${recommendedWorker.id}&autoSelect=true`);
		}, 300);
	}, [recommendedWorker, priceBreakdown, router, service, serviceType]);

	const handleCloseModal = useCallback(() => {
		setShowAutoSelectModal(false);
		sessionStorage.removeItem("autoSelectModalOpen");
		sessionStorage.removeItem("autoSelectModalWorkerId");
		
		// Clean up URL parameter if present
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has("fromModal")) {
			urlParams.delete("fromModal");
			const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;
			window.history.replaceState({}, "", newUrl);
		}
	}, []);

	// Memoized formatted date
	const formattedDate = useMemo(() => {
		if (!bookingData?.date) return null;
		return new Date(bookingData.date).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}, [bookingData?.date, isArabic]);

	// Early return if no booking data
	if (!bookingData || !bookingData.description) {
		return null;
	}

	return (
		<div className={`min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-gray-800/50 to-white dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<StepperNavigation service={service} serviceType={serviceType} />

			<div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				{/* Header */}
				<div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						{isArabic ? "مراجعة الطلب قبل التأكيد" : "Review Your Booking Before Confirmation"}
					</h1>
					<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
						{isArabic 
							? "يرجى مراجعة تفاصيل الطلب قبل الانتقال إلى الدفع." 
							: "Please review your booking details before proceeding to payment."
						}
					</p>
				</div>

				{/* Summary Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
					<div className="space-y-6">
						{/* Service Details Section */}
						<section className="pb-6 border-b border-gray-200 dark:border-gray-700">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
									<FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
								</div>
								<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
									{isArabic ? "تفاصيل الخدمة" : "Service Details"}
								</h2>
							</div>
							<div className="space-y-3 ml-14">
								{/* Service Name */}
								<div className={`flex items-start gap-3 ${bookingData.date ? "pb-3 border-b border-gray-100 dark:border-gray-700" : ""}`}>
									<span className="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5">
										{isArabic ? "الخدمة:" : "Service:"}
									</span>
									<span className={`font-medium text-gray-900 dark:text-gray-100 flex-1 ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? bookingData.serviceNameAr : bookingData.serviceName}
									</span>
								</div>
								{bookingData.date && formattedDate && (
									<div className="flex items-center gap-3">
										<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-shrink-0">
											<Calendar className="w-4 h-4" />
											{isArabic ? "التاريخ:" : "Date:"}
										</span>
										<span className={`font-medium text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
											{formattedDate}
										</span>
									</div>
								)}
								{bookingData.time && (
									<div className="flex items-center gap-3">
										<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-shrink-0">
											<Clock className="w-4 h-4" />
											{isArabic ? "الوقت:" : "Time:"}
										</span>
										<span className={`font-medium text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
											{bookingData.time}
										</span>
									</div>
								)}
								{bookingData.description && (
									<div className={`pt-3 border-t border-gray-100 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{isArabic ? "وصف المشكلة:" : "Problem Description:"}</p>
										<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">{bookingData.description}</p>
									</div>
								)}
							</div>
						</section>

						{/* Address Section */}
						{bookingData.address && (
							<section className="pb-6 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
										<MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
									</div>
									<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
										{isArabic ? "عنوان الخدمة" : "Service Address"}
									</h2>
								</div>
								<div className={`ml-14 ${isArabic ? "text-right" : "text-left"}`}>
									<p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{bookingData.address.title}</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">{bookingData.address.address}</p>
									{bookingData.address.details && (
										<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{bookingData.address.details}</p>
									)}
								</div>
							</section>
						)}

						{/* Attachments Section */}
						{(bookingData.images?.length > 0 || bookingData.video || bookingData.voice) && (
							<section className="pb-6 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
										<ImageIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
									</div>
									<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
										{isArabic ? "المرفقات" : "Attachments"}
									</h2>
								</div>
								<div className="ml-14 space-y-4">
									{/* Images */}
									{bookingData.images && bookingData.images.length > 0 && (
										<div>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{isArabic ? "الصور" : "Images"}</p>
											<div className="grid grid-cols-3 gap-3">
												{bookingData.images.map((img, index) => (
													<div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
														<Image
															src={img}
															alt={`Attachment ${index + 1}`}
															fill
															className="object-cover"
															loading="lazy"
														/>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Video */}
									{bookingData.video && (
										<div>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{isArabic ? "فيديو" : "Video"}</p>
											<div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900">
												<video src={bookingData.video} controls className="w-full h-full object-contain" />
											</div>
										</div>
									)}

									{/* Voice Recording */}
									{bookingData.voice && (
										<div>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{isArabic ? "تسجيل صوتي" : "Voice Recording"}</p>
											<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
												<audio src={bookingData.voice} controls className="w-full" />
											</div>
										</div>
									)}
								</div>
							</section>
						)}

						{/* Notes Section */}
						{bookingData.notes && (
							<section className="pb-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
										<FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
									</div>
									<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
										{isArabic ? "ملاحظات إضافية" : "Additional Notes"}
									</h2>
								</div>
								<div className={`ml-14 ${isArabic ? "text-right" : "text-left"}`}>
									<p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{bookingData.notes}</p>
								</div>
							</section>
						)}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col gap-4 pt-6">
					{/* Edit Button */}
					<button
						onClick={handleEdit}
						className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-50 transition-all shadow-md hover:shadow-lg touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2"
					>
						<Edit2 className="w-5 h-5" />
						<span>{isArabic ? "تعديل التفاصيل" : "Edit Details"}</span>
					</button>

					{/* Worker Selection Buttons */}
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Platform Recommendation Button */}
						<button
							onClick={handlePlatformRecommendation}
							disabled={isFindingWorker || isAutoSelectLoading}
							className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#31A342] dark:bg-green-600 hover:bg-[#2a8f3a] dark:hover:bg-green-700 active:bg-[#2a8f3a] dark:active:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
								isArabic ? "flex-row-reverse" : ""
							}`}
						>
							{(isFindingWorker || isAutoSelectLoading) ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									<span>{isArabic ? "جاري البحث عن أفضل فني..." : "Finding best worker..."}</span>
								</>
							) : (
								<>
									<Sparkles className="w-5 h-5" />
									<span>{isArabic ? "اختيار المنصة لك (تلقائي)" : "Platform Chooses for You (Automatic)"}</span>
									<ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
								</>
							)}
						</button>

						{/* Choose Available Worker Button */}
						<button
							onClick={handleProceed}
							disabled={isFindingWorker}
							className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
								isArabic ? "flex-row-reverse" : ""
							}`}
						>
							<span>{isArabic ? "أنا أختار بنفسي (يدوي)" : "I Choose Myself (Manual)"}</span>
							<ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Loading Overlay for Auto Select */}
			<AnimatePresence>
				{isAutoSelectLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ duration: 0.15 }}
							className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4"
						>
							<Loader2 className="w-12 h-12 text-[#31A342] dark:text-[#4ade80] animate-spin" />
							<p className="text-lg font-bold text-gray-900 dark:text-white">
								{isArabic ? "جاري اختيار أفضل فني..." : "Selecting best worker..."}
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Auto Select Confirmation Modal */}
			{selectedWorker && priceBreakdown && (
				<WorkerAutoSelectConfirmModal
					isOpen={showAutoSelectModal}
					onClose={handleCloseModal}
					onConfirm={handleConfirmAutoSelect}
					worker={selectedWorker}
					priceBreakdown={priceBreakdown}
					isArabic={isArabic}
					service={service}
					serviceType={serviceType}
				/>
			)}
		</div>
	);
}
