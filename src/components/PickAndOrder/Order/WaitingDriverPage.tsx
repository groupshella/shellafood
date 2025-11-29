"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
	Clock, 
	Loader2, 
	CheckCircle, 
	X, 
	User, 
	Star, 
	MapPin,
	Truck,
	Bike,
	AlertCircle
} from "lucide-react";
import Image from "next/image";

interface WaitingDriverPageProps {
	transportType: string;
	orderType?: string; // Optional, will be read from searchParams if not provided
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

const WAIT_TIME_SECONDS = 30; // 30 seconds countdown

export default function WaitingDriverPage({ transportType }: WaitingDriverPageProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";

	const driverId = searchParams.get("driverId");
	const autoSelect = searchParams.get("autoSelect") === "true";
	const orderType = searchParams.get("type") || "one-way";

	const [timeRemaining, setTimeRemaining] = useState(WAIT_TIME_SECONDS);
	const [driverStatus, setDriverStatus] = useState<"waiting" | "accepted" | "rejected" | "timeout">("waiting");
	const [driver, setDriver] = useState<Driver | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Load driver data from sessionStorage
	useEffect(() => {
		if (typeof window !== "undefined" && driverId) {
			try {
				const driverDataStr = sessionStorage.getItem(`driver_${driverId}`);
				if (driverDataStr) {
					const driverData = JSON.parse(driverDataStr);
					setDriver(driverData);
				} else {
					// If not found in sessionStorage, try to get from available drivers or create mock data
					console.warn("Driver data not found in sessionStorage, creating fallback data");
					// Try to get from order data or create minimal driver data
					const fallbackDriver: Driver = {
						id: driverId,
						name: "Driver",
						nameAr: "سائق",
						avatar: "/driver1.jpg",
						rating: 4.5,
						reviewsCount: 100,
						vehicleType: isMotorbike ? "motorbike" : "truck",
						vehicleModel: isMotorbike ? "Honda" : "Isuzu",
						licensePlate: "ABC 1234",
						distance: 0,
						estimatedTime: 15,
					};
					setDriver(fallbackDriver);
				}
			} catch (error) {
				console.error("Error loading driver data:", error);
			} finally {
				setIsLoading(false);
			}
		} else if (!driverId) {
			setIsLoading(false);
		}
	}, [driverId, isMotorbike]);

	// Countdown timer
	useEffect(() => {
		if (driverStatus !== "waiting" || !driverId) return;

		const interval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					handleTimeout();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [driverStatus, driverId]);

	// Simulate driver response (mock - in production this would be from WebSocket/API)
	useEffect(() => {
		if (driverStatus !== "waiting" || !driverId) return;

		// Simulate driver acceptance/rejection after random time (5-25 seconds)
		const responseTime = Math.random() * 20000 + 5000; // 5-25 seconds
		const willAccept = Math.random() > 0.3; // 70% acceptance rate

		const timer = setTimeout(() => {
			if (willAccept) {
				setDriverStatus("accepted");
				// Navigate to payment after short delay
				setTimeout(() => {
					router.push(`/pickandorder/${transportType}/order/payment?type=${orderType}&driverId=${driverId}&accepted=true`);
				}, 1500);
			} else {
				setDriverStatus("rejected");
				// Return to choose driver after short delay
				setTimeout(() => {
					handleDriverRejected();
				}, 2000);
			}
		}, responseTime);

		return () => clearTimeout(timer);
	}, [driverStatus, driverId, transportType, orderType, router]);

	// Handle timeout
	const handleTimeout = useCallback(() => {
		setDriverStatus("timeout");
		// Remove driver from available list (store in sessionStorage)
		if (typeof window !== "undefined" && driverId) {
			const rejectedDrivers = JSON.parse(sessionStorage.getItem("rejectedDrivers") || "[]");
			if (!rejectedDrivers.includes(driverId)) {
				rejectedDrivers.push(driverId);
				sessionStorage.setItem("rejectedDrivers", JSON.stringify(rejectedDrivers));
			}
		}
		// Return to choose driver after delay
		setTimeout(() => {
			router.push(`/pickandorder/${transportType}/order/choose-driver?type=${orderType}&timeout=true&rejectedDriverId=${driverId}`);
		}, 2000);
	}, [driverId, transportType, orderType, router]);

	// Handle driver rejection
	const handleDriverRejected = useCallback(() => {
		if (typeof window !== "undefined" && driverId) {
			const rejectedDrivers = JSON.parse(sessionStorage.getItem("rejectedDrivers") || "[]");
			if (!rejectedDrivers.includes(driverId)) {
				rejectedDrivers.push(driverId);
				sessionStorage.setItem("rejectedDrivers", JSON.stringify(rejectedDrivers));
			}
		}
		router.push(`/pickandorder/${transportType}/order/choose-driver?type=${orderType}&rejected=true&rejectedDriverId=${driverId}`);
	}, [driverId, transportType, orderType, router]);

	// Handle cancel
	const handleCancel = useCallback(() => {
		router.push(`/pickandorder/${transportType}/order/choose-driver?type=${orderType}`);
	}, [router, transportType, orderType]);

	const progressPercentage = ((WAIT_TIME_SECONDS - timeRemaining) / WAIT_TIME_SECONDS) * 100;
	const VehicleIcon = isMotorbike ? Bike : Truck;

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
			</div>
		);
	}

	if (!driver) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
						{isArabic ? "خطأ" : "Error"}
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						{isArabic ? "لم يتم العثور على بيانات السائق" : "Driver data not found"}
					</p>
					<button
						onClick={handleCancel}
						className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
					>
						{isArabic ? "العودة" : "Go Back"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Status Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
				>
					{/* Header */}
					<div className="text-center mb-6">
						{driverStatus === "waiting" && (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
								className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
							>
								<Loader2 className="w-10 h-10 text-green-600 dark:text-green-400" />
							</motion.div>
						)}
						{driverStatus === "accepted" && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
							>
								<CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
							</motion.div>
						)}
						{(driverStatus === "rejected" || driverStatus === "timeout") && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
							>
								<X className="w-10 h-10 text-red-600 dark:text-red-400" />
							</motion.div>
						)}

						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							{driverStatus === "waiting" && (isArabic ? "في انتظار قبول السائق" : "Waiting for Driver")}
							{driverStatus === "accepted" && (isArabic ? "تم قبول الطلب!" : "Request Accepted!")}
							{driverStatus === "rejected" && (isArabic ? "تم رفض الطلب" : "Request Rejected")}
							{driverStatus === "timeout" && (isArabic ? "انتهى الوقت" : "Time Expired")}
						</h2>

						{driverStatus === "waiting" && (
							<p className="text-gray-600 dark:text-gray-400">
								{isArabic 
									? "يرجى الانتظار بينما نتحقق من قبول السائق لطلبك"
									: "Please wait while we confirm the driver's acceptance"
								}
							</p>
						)}
					</div>

					{/* Countdown Progress Bar */}
					{driverStatus === "waiting" && (
						<div className="mb-6">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
									<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
										{isArabic ? "الوقت المتبقي" : "Time Remaining"}
									</span>
								</div>
								<span className="text-lg font-bold text-green-600 dark:text-green-400">
									{timeRemaining}s
								</span>
							</div>
							<div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: "0%" }}
									animate={{ width: `${progressPercentage}%` }}
									transition={{ duration: 1, ease: "linear" }}
									className="h-full bg-gradient-to-r from-green-500 to-green-600"
								/>
							</div>
						</div>
					)}

					{/* Driver Info Card */}
					<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 mb-6">
						<div className="flex items-center gap-4">
							<div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-500">
								{driver.avatar ? (
									<Image
										src={driver.avatar}
										alt={isArabic ? driver.nameAr : driver.name}
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
										<User className="w-8 h-8 text-white" />
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
									{isArabic ? driver.nameAr : driver.name}
								</h3>
								<div className="flex items-center gap-2 mb-1">
									<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
									<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
										{driver.rating.toFixed(1)}
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										({driver.reviewsCount} {isArabic ? "تقييم" : "reviews"})
									</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<VehicleIcon className="w-4 h-4" />
									<span className="truncate">{driver.vehicleModel}</span>
									<span className="text-xs">•</span>
									<span>{driver.licensePlate}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Status Messages */}
					<AnimatePresence>
						{driverStatus === "accepted" && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4"
							>
								<p className="text-green-800 dark:text-green-200 text-center font-semibold">
									{isArabic 
										? "تم قبول طلبك بنجاح! جاري التوجيه إلى صفحة الدفع..."
										: "Your request has been accepted! Redirecting to payment..."
									}
								</p>
							</motion.div>
						)}

						{(driverStatus === "rejected" || driverStatus === "timeout") && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4"
							>
								<p className="text-red-800 dark:text-red-200 text-center font-semibold">
									{driverStatus === "rejected" 
										? (isArabic 
											? "عذراً، رفض السائق الطلب. جاري العودة لاختيار سائق آخر..."
											: "Sorry, the driver rejected the request. Returning to choose another driver...")
										: (isArabic 
											? "انتهى وقت الانتظار. جاري العودة لاختيار سائق آخر..."
											: "Wait time expired. Returning to choose another driver...")
									}
								</p>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Cancel Button (only show when waiting) */}
					{driverStatus === "waiting" && (
						<button
							onClick={handleCancel}
							className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
						>
							{isArabic ? "إلغاء" : "Cancel"}
						</button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

