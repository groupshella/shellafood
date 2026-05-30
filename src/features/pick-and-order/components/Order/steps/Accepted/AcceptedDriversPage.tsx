"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/providers";
import { motion, AnimatePresence } from "framer-motion";
import { 
	CheckCircle, 
	User, 
	Star, 
	Truck,
	Bike,
	AlertCircle,
	Loader2,
	MapPin,
	Clock,
	Eye,
	MessageCircle
} from "lucide-react";
import Image from "next/image";
import { calculateOrderPricing, loadAndConvertOrderData } from "@/features/pick-and-order/lib/utils";

interface AcceptedDriversPageProps {
	transportType: string;
	orderType?: string;
}

interface Driver {
	id: string;
	name: string;
	nameAr: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	vehicleType: "truck" | "motorbike";
	vehicleModel: string;
	licensePlate: string;
	distance?: number;
	estimatedTime?: number;
}

interface DriverWithPricing extends Driver {
	pricing: {
		basePrice: number;
		platformFee: number;
		subtotal: number;
		vat: number;
		total: number;
		distance: number;
	};
}

const AcceptedDriversPage: React.FC<AcceptedDriversPageProps> = ({ transportType, orderType = "one-way" }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";

	const [acceptedDrivers, setAcceptedDrivers] = useState<DriverWithPricing[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const VehicleIcon = isMotorbike ? Bike : Truck;

	// Load accepted drivers and calculate pricing
	useEffect(() => {
		if (typeof window === "undefined") {
			setIsLoading(false);
			return;
		}

		try {
			// Load accepted drivers from sessionStorage
			const acceptedDriversStr = sessionStorage.getItem("acceptedDrivers");
			if (!acceptedDriversStr) {
				setIsLoading(false);
				return;
			}

			const drivers: Driver[] = JSON.parse(acceptedDriversStr);
			
			// Load order data for pricing calculation
			const orderData = loadAndConvertOrderData();
			
			if (!orderData || !orderData.locationPoints || orderData.locationPoints.length === 0) {
				console.error("No order data found for pricing calculation");
				setIsLoading(false);
				return;
			}

			// Calculate pricing for each driver
			const driversWithPricing: DriverWithPricing[] = drivers.map((driver) => {
				const validLocationPoints = orderData.locationPoints.filter(
					(point: any) => point.location && point.location.lat && point.location.lng
				);

				if (validLocationPoints.length === 0) {
					console.warn("No valid location points for pricing");
					return {
						...driver,
						pricing: {
							basePrice: 0,
							platformFee: 0,
							subtotal: 0,
							vat: 0,
							total: 0,
							distance: 0,
						},
					};
				}

				const pricing = calculateOrderPricing({
					transportType: (transportType === "motorbike" ? "motorbike" : "truck") as "motorbike" | "truck",
					locationPoints: validLocationPoints,
					isExpress: orderData.isExpress || false,
					requiresRefrigeration: orderData.requiresRefrigeration || false,
					loadingEquipmentNeeded: orderData.loadingEquipmentNeeded || false,
				});

				return {
					...driver,
					pricing,
				};
			});

			setAcceptedDrivers(driversWithPricing);
		} catch (error) {
			console.error("Error loading accepted drivers:", error);
		} finally {
			setIsLoading(false);
		}
	}, [transportType]);

	// Handle driver selection and navigate to payment
	const handleSelectDriver = useMemo(() => {
		return async (driverId: string) => {
			if (isProcessing) return;
			
			setSelectedDriverId(driverId);
			setIsProcessing(true);

			try {
				// Store selected driver data
				const selectedDriver = acceptedDrivers.find(d => d.id === driverId);
				if (selectedDriver && typeof window !== "undefined") {
					sessionStorage.setItem(`driver_${driverId}`, JSON.stringify(selectedDriver));
					sessionStorage.setItem("orderPricing", JSON.stringify(selectedDriver.pricing));
				}

				// Small delay for UX
				await new Promise(resolve => setTimeout(resolve, 300));

				// Navigate to payment page
				router.push(`/pickandorder/${transportType}/${orderType}/order/payment?driverId=${driverId}&accepted=true`);
			} catch (error) {
				console.error("Error selecting driver:", error);
				setIsProcessing(false);
			}
		};
	}, [acceptedDrivers, transportType, orderType, router, isProcessing]);

	// Handle back navigation
	const handleBack = () => {
		router.push(`/pickandorder/${transportType}/${orderType}/order/choose-driver`);
	};

	// Handle view driver details
	const handleViewDetails = (driver: DriverWithPricing, e: React.MouseEvent) => {
		e.stopPropagation();
		// Store driver data in sessionStorage for the profile page
		if (typeof window !== "undefined") {
			sessionStorage.setItem(`driver_${driver.id}`, JSON.stringify({
				id: driver.id,
				name: driver.name,
				nameAr: driver.nameAr,
				avatar: driver.avatar,
				rating: driver.rating,
				reviewsCount: driver.reviewsCount,
				vehicleType: driver.vehicleType,
				vehicleModel: driver.vehicleModel,
				licensePlate: driver.licensePlate,
				location: driver.distance ? `${driver.distance.toFixed(1)} km away` : "",
				distance: driver.distance,
				estimatedTime: driver.estimatedTime,
			}));
			
			// Navigate to driver profile page
			const returnUrl = encodeURIComponent(`/pickandorder/${transportType}/${orderType}/order/accepted-drivers`);
			router.push(`/driver/${driver.id}?returnUrl=${returnUrl}&transportType=${transportType}&orderType=${orderType}`);
		}
	};

	// Handle chat with driver
	const handleChat = (driverId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/driver/${driverId}/chat`);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
			</div>
		);
	}

	if (acceptedDrivers.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
				<div className="text-center max-w-md">
					<AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						{isArabic ? "لا يوجد سائقين مقبولين" : "No Accepted Drivers"}
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						{isArabic 
							? "عذراً، لم يقبل أي سائق طلبك. يرجى المحاولة مرة أخرى."
							: "Sorry, no drivers accepted your request. Please try again."
						}
					</p>
					<button
						onClick={handleBack}
						className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
					>
						{isArabic ? "العودة لاختيار سائق آخر" : "Back to Choose Another Driver"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 px-4 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
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
						{isArabic ? "السائقون المقبولون" : "Accepted Drivers"}
					</h1>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
						{isArabic 
							? `اختر السائق المناسب من بين ${acceptedDrivers.length} سائق قبل طلبك`
							: `Choose the best driver from ${acceptedDrivers.length} driver(s) who accepted your request`
						}
					</p>
				</motion.div>

				{/* Drivers List */}
				<div className="space-y-4 mb-6">
					<AnimatePresence>
						{acceptedDrivers.map((driver, index) => (
							<motion.div
								key={driver.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ delay: index * 0.1 }}
								className={`
									bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border-2 transition-all
									${selectedDriverId === driver.id
										? "border-green-500 dark:border-green-400 shadow-xl scale-[1.02] ring-2 ring-green-500/20"
										: "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl"
									}
								`}
							>
								<div className="p-6">
									<div className="flex flex-col sm:flex-row items-start gap-4">
										{/* Driver Avatar */}
										<div className="relative flex-shrink-0">
											<div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 transition-all ${
												selectedDriverId === driver.id
													? "border-green-500 dark:border-green-400 ring-4 ring-green-500/20"
													: "border-gray-200 dark:border-gray-700"
											}`}>
												{driver.avatar ? (
													<Image
														src={driver.avatar}
														alt={isArabic ? driver.nameAr : driver.name}
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
											{selectedDriverId === driver.id && (
												<motion.div
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-lg"
												>
													<CheckCircle className="w-5 h-5 text-white" />
												</motion.div>
											)}
											{/* Vehicle Type Badge */}
											<div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md border-2 ${
												isMotorbike 
													? "border-yellow-500" 
													: "border-green-500"
											}`}>
												<VehicleIcon className={`w-4 h-4 ${
													isMotorbike ? "text-yellow-500" : "text-green-500"
												}`} />
											</div>
										</div>

										{/* Driver Info */}
										<div className="flex-1 min-w-0 w-full">
											<div className="flex items-start justify-between gap-4 mb-3">
												<div className="flex-1 min-w-0">
													<h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
														{isArabic ? driver.nameAr : driver.name}
													</h3>
													<div className="flex items-center gap-2 mb-2">
														<div className="flex items-center gap-0.5">
															{[...Array(5)].map((_, i) => (
																<Star
																	key={i}
																	className={`w-4 h-4 ${
																		i < Math.floor(driver.rating)
																			? "text-yellow-400 fill-yellow-400"
																			: "text-gray-300 dark:text-gray-600"
																	}`}
																/>
															))}
														</div>
														<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
															{driver.rating.toFixed(1)}
														</span>
														<span className="text-xs text-gray-500 dark:text-gray-400">
															({driver.reviewsCount} {isArabic ? "تقييم" : "reviews"})
														</span>
													</div>
													<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
														<VehicleIcon className={`w-4 h-4 ${
															isMotorbike ? "text-yellow-500" : "text-green-500"
														}`} />
														<span className="font-medium">{driver.vehicleModel}</span>
														<span>•</span>
														<span>{driver.licensePlate}</span>
													</div>
												</div>
											</div>

											{/* Distance & Time */}
											{(driver.distance !== undefined || driver.estimatedTime !== undefined) && (
												<div className="flex items-center gap-4 mb-4 text-sm">
													{driver.distance !== undefined && (
														<div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
															<MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
															<span className="font-medium text-gray-700 dark:text-gray-300">
																{driver.distance.toFixed(1)} {isArabic ? "كم" : "km"}
															</span>
														</div>
													)}
													{driver.estimatedTime !== undefined && (
														<div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
															<Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
															<span className="font-medium text-gray-700 dark:text-gray-300">
																~{driver.estimatedTime} {isArabic ? "دقيقة" : "min"}
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
															{driver.pricing.total.toFixed(2)} {isArabic ? "ر.س" : "SAR"}
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
															{isArabic 
																? `المسافة: ${driver.pricing.distance.toFixed(1)} كم`
																: `Distance: ${driver.pricing.distance.toFixed(1)} km`
															}
														</p>
													</div>
													{selectedDriverId === driver.id && isProcessing && (
														<Loader2 className="w-6 h-6 animate-spin text-green-600 dark:text-green-400" />
													)}
												</div>
											</div>

											{/* Action Buttons - Chat and Details */}
											<div className="flex gap-2 mb-4">
												<button
													onClick={(e) => handleViewDetails(driver, e)}
													className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
												>
													<Eye className="w-4 h-4" />
													<span>{isArabic ? "التفاصيل" : "Details"}</span>
												</button>
												<button
													onClick={(e) => handleChat(driver.id, e)}
													className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-all text-sm"
												>
													<MessageCircle className="w-4 h-4" />
													<span>{isArabic ? "محادثة" : "Chat"}</span>
												</button>
											</div>

											{/* Select Button */}
											<button
												onClick={() => handleSelectDriver(driver.id)}
												disabled={isProcessing && selectedDriverId === driver.id}
												className={`w-full px-4 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
													isMotorbike 
														? "bg-yellow-500 hover:bg-yellow-600" 
														: "bg-[#31A342] hover:bg-[#2a8f3a]"
												} disabled:opacity-50 disabled:cursor-not-allowed`}
											>
												{isProcessing && selectedDriverId === driver.id ? (
													<>
														<Loader2 className="w-5 h-5 animate-spin" />
														<span>{isArabic ? "جاري التوجيه..." : "Redirecting..."}</span>
													</>
												) : (
													<>
														<CheckCircle className="w-5 h-5" />
														<span>{isArabic ? "اختيار هذا السائق" : "Select This Driver"}</span>
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
	);
};

export default AcceptedDriversPage;

