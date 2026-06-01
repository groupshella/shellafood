"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/providers";
import { motion, AnimatePresence } from "framer-motion";
import StepperNavigation from "./StepperNavigation/StepperNavigation"
import {
	CheckCircle,
	User,
	Star,
	AlertCircle,
	Loader2,
	MapPin,
	Clock,
	Eye,
	MessageCircle,
	Briefcase
} from "lucide-react";
import Image from "next/image";
import { calculatePricing, formatPrice } from "@/features/(services)/serve-me/lib/utils/pricing";

interface AcceptedWorkersPageProps {
	service: string;
	serviceType: string;
}

interface Worker {
	id: string;
	name: string;
	nameAr: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	experience: string;
	location: string;
	distance?: number;
	estimatedTime?: number;
	price?: number;
}

interface WorkerWithPricing extends Worker {
	pricing: {
		basePrice: number;
		platformFee: number;
		subtotal: number;
		vat: number;
		total: number;
	};
}

const AcceptedWorkersPage: React.FC<AcceptedWorkersPageProps> = ({ service, serviceType }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const [acceptedWorkers, setAcceptedWorkers] = useState<WorkerWithPricing[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	// Load accepted workers and calculate pricing
	useEffect(() => {
		if (typeof window === "undefined") {
			setIsLoading(false);
			return;
		}

		try {
			// Load accepted workers from sessionStorage
			const acceptedWorkersStr = sessionStorage.getItem("acceptedWorkers");
			if (!acceptedWorkersStr) {
				setIsLoading(false);
				return;
			}

			const workers: Worker[] = JSON.parse(acceptedWorkersStr);

			// Calculate pricing for each worker
			const workersWithPricing: WorkerWithPricing[] = workers.map((worker) => {
				// Use worker's price or default to 200 SAR
				const basePrice = worker.price || 200;
				const pricing = calculatePricing(basePrice);

				return {
					...worker,
					pricing,
				};
			});

			setAcceptedWorkers(workersWithPricing);
		} catch (error) {
			console.error("Error loading accepted workers:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Handle worker selection and navigate to payment
	const handleSelectWorker = useMemo(() => {
		return async (workerId: string) => {
			if (isProcessing) return;

			setSelectedWorkerId(workerId);
			setIsProcessing(true);

			try {
				// Store selected worker data
				const selectedWorker = acceptedWorkers.find(w => w.id === workerId);
				if (selectedWorker && typeof window !== "undefined") {
					sessionStorage.setItem(`worker_${workerId}`, JSON.stringify(selectedWorker));
					sessionStorage.setItem("orderPricing", JSON.stringify(selectedWorker.pricing));

					// Store worker data for booking context (will be picked up by payment page)
					sessionStorage.setItem("selectedWorkerForBooking", JSON.stringify({
						worker: {
							id: selectedWorker.id,
							name: isArabic ? selectedWorker.nameAr : selectedWorker.name,
							avatar: selectedWorker.avatar,
							rating: selectedWorker.rating,
							phone: "+966500000000", // Mock phone
						},
						unitPrice: selectedWorker.pricing.basePrice, // Use base price from pricing breakdown
					}));
				}

				// Small delay for UX
				await new Promise(resolve => setTimeout(resolve, 300));

				// Navigate to payment page
				router.push(`/serve-me/${service}/${serviceType}/book/payment?workerId=${workerId}&accepted=true`);
			} catch (error) {
				console.error("Error selecting worker:", error);
				setIsProcessing(false);
			}
		};
	}, [acceptedWorkers, service, serviceType, router, isProcessing, isArabic]);

	// Handle back navigation
	const handleBack = () => {
		router.push(`/serve-me/${service}/${serviceType}/book/choose-worker`);
	};

	// Handle view worker details
	const handleViewDetails = (worker: WorkerWithPricing, e: React.MouseEvent) => {
		e.stopPropagation();
		// Store worker data in sessionStorage for the profile page
		if (typeof window !== "undefined") {
			sessionStorage.setItem(`worker_${worker.id}`, JSON.stringify({
				id: worker.id,
				name: worker.name,
				nameAr: worker.nameAr,
				avatar: worker.avatar,
				rating: worker.rating,
				reviewsCount: worker.reviewsCount,
				experience: worker.experience,
				location: worker.location,
				distance: worker.distance,
				estimatedTime: worker.estimatedTime,
			}));

			// Navigate to worker profile page
			const returnUrl = encodeURIComponent(`/serve-me/${service}/${serviceType}/order/accepted-workers`);
			router.push(`/worker/${worker.id}?returnUrl=${returnUrl}&service=${service}&serviceType=${serviceType}`);
		}
	};

	// Handle chat with worker
	const handleChat = (workerId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/worker/${workerId}/chat`);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white dark:bg-gray-900">
				<StepperNavigation service={service} serviceType={serviceType} />
				<div className="flex items-center justify-center h-[calc(100vh-80px)]">
					<Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
				</div>
			</div>
		);
	}

	if (acceptedWorkers.length === 0) {
		return (
			<div className="min-h-screen bg-white dark:bg-gray-900">
				<StepperNavigation service={service} serviceType={serviceType} />
				<div className="flex items-center justify-center h-[calc(100vh-80px)] p-4">
					<div className="text-center max-w-md">
						<AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							{isArabic ? "لا يوجد فنيين مقبولين" : "No Accepted Workers"}
						</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-6">
							{isArabic
								? "عذراً، لم يقبل أي فني طلبك. يرجى المحاولة مرة أخرى."
								: "Sorry, no workers accepted your request. Please try again."
							}
						</p>
						<button
							onClick={handleBack}
							className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
						>
							{isArabic ? "العودة لاختيار فني آخر" : "Back to Choose Another Worker"}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-white dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<StepperNavigation service={service} serviceType={serviceType} />
			<div className={`bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 px-4`}>
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center mb-6 sm:mb-8"
					>
						<div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-500/10">
							<CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 dark:text-green-400" />
						</div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
							{isArabic ? "الفنيون المقبولون" : "Accepted Workers"}
						</h1>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
							{isArabic
								? `اختر الفني المناسب من بين ${acceptedWorkers.length} فني قبل طلبك`
								: `Choose the best worker from ${acceptedWorkers.length} worker(s) who accepted your request`
							}
						</p>
					</motion.div>

					{/* Workers List */}
					<div className="space-y-4 mb-6">
						<AnimatePresence>
							{acceptedWorkers.map((worker, index) => (
								<motion.div
									key={worker.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ delay: index * 0.1 }}
									className={`
									bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border-2 transition-all
									${selectedWorkerId === worker.id
											? "border-green-500 dark:border-green-400 shadow-xl scale-[1.02] ring-2 ring-green-500/20"
											: "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl"
										}
								`}
								>
									<div className="p-6">
										<div className="flex flex-col sm:flex-row items-start gap-4">
											{/* Worker Avatar */}
											<div className="relative flex-shrink-0">
												<div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 transition-all ${selectedWorkerId === worker.id
													? "border-green-500 dark:border-green-400 ring-4 ring-green-500/20"
													: "border-gray-200 dark:border-gray-700"
													}`}>
													{worker.avatar ? (
														<Image
															src={worker.avatar}
															alt={isArabic ? worker.nameAr : worker.name}
															width={96}
															height={96}
															className="object-cover w-full h-full"
															unoptimized
														/>
													) : (
														<div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
															<User className="w-10 h-10 text-white" />
														</div>
													)}
												</div>
												{selectedWorkerId === worker.id && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-lg"
													>
														<CheckCircle className="w-5 h-5 text-white" />
													</motion.div>
												)}
												{/* Experience Badge */}
												<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md border-2 border-green-500">
													<Briefcase className="w-4 h-4 text-green-500" />
												</div>
											</div>

											{/* Worker Info */}
											<div className="flex-1 min-w-0 w-full">
												<div className="flex items-start justify-between gap-4 mb-3">
													<div className="flex-1 min-w-0">
														<h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
															{isArabic ? worker.nameAr : worker.name}
														</h3>
														<div className="flex items-center gap-2 mb-2">
															<div className="flex items-center gap-0.5">
																{[...Array(5)].map((_, i) => (
																	<Star
																		key={i}
																		className={`w-4 h-4 ${i < Math.floor(worker.rating)
																			? "text-yellow-400 fill-yellow-400"
																			: "text-gray-300 dark:text-gray-600"
																			}`}
																	/>
																))}
															</div>
															<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
																{worker.rating.toFixed(1)}
															</span>
															<span className="text-xs text-gray-500 dark:text-gray-400">
																({worker.reviewsCount} {isArabic ? "تقييم" : "reviews"})
															</span>
														</div>
														<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
															<Briefcase className="w-4 h-4 text-green-500" />
															<span className="font-medium">{worker.experience}</span>
															<span>•</span>
															<MapPin className="w-4 h-4 text-gray-500" />
															<span>{worker.location}</span>
														</div>
													</div>
												</div>

												{/* Distance & Time */}
												{(worker.distance !== undefined || worker.estimatedTime !== undefined) && (
													<div className="flex items-center gap-4 mb-4 text-sm">
														{worker.distance !== undefined && (
															<div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
																<MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
																<span className="font-medium text-gray-700 dark:text-gray-300">
																	{worker.distance.toFixed(1)} {isArabic ? "كم" : "km"}
																</span>
															</div>
														)}
														{worker.estimatedTime !== undefined && (
															<div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
																<Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
																<span className="font-medium text-gray-700 dark:text-gray-300">
																	~{worker.estimatedTime} {isArabic ? "دقيقة" : "min"}
																</span>
															</div>
														)}
													</div>
												)}

												{/* Pricing */}
												<div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800 mb-4">
													<div className="flex items-center justify-between">
														<div>
															<p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
																{isArabic ? "السعر الإجمالي" : "Total Price"}
															</p>
															<p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
																{formatPrice(worker.pricing.total, isArabic)}
															</p>
															<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
																{isArabic
																	? `السعر الأساسي: ${formatPrice(worker.pricing.basePrice, isArabic)}`
																	: `Base Price: ${formatPrice(worker.pricing.basePrice, isArabic)}`
																}
															</p>
														</div>
														{selectedWorkerId === worker.id && isProcessing && (
															<Loader2 className="w-6 h-6 animate-spin text-green-600 dark:text-green-400" />
														)}
													</div>
												</div>

												{/* Action Buttons - Chat and Details */}
												<div className="flex gap-2 mb-4">
													<button
														onClick={(e) => handleViewDetails(worker, e)}
														className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
													>
														<Eye className="w-4 h-4" />
														<span>{isArabic ? "التفاصيل" : "Details"}</span>
													</button>
													<button
														onClick={(e) => handleChat(worker.id, e)}
														className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-all text-sm"
													>
														<MessageCircle className="w-4 h-4" />
														<span>{isArabic ? "محادثة" : "Chat"}</span>
													</button>
												</div>

												{/* Select Button */}
												<button
													onClick={() => handleSelectWorker(worker.id)}
													disabled={isProcessing && selectedWorkerId === worker.id}
													className="w-full px-4 py-3 bg-[#31A342] hover:bg-[#2a8f3a] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													{isProcessing && selectedWorkerId === worker.id ? (
														<>
															<Loader2 className="w-5 h-5 animate-spin" />
															<span>{isArabic ? "جاري التوجيه..." : "Redirecting..."}</span>
														</>
													) : (
														<>
															<CheckCircle className="w-5 h-5" />
															<span>{isArabic ? "اختيار هذا الفني" : "Select This Worker"}</span>
														</>
													)}
												</button>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>

					{/* Back Button */}
					<div className="flex justify-center mt-6">
						<button
							onClick={handleBack}
							className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
						>
							{isArabic ? "العودة" : "Back"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AcceptedWorkersPage;

