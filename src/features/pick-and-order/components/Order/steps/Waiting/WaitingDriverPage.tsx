"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/providers";
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
	AlertCircle,
	Send,
	Users
} from "lucide-react";
import Image from "next/image";

interface WaitingDriverPageProps {
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

type DriverStatus = "waiting" | "accepted" | "rejected" | "timeout";

interface DriverWithStatus extends Driver {
	status: DriverStatus;
}

const WAIT_TIME_SECONDS = 30;

export default function WaitingDriverPage({ transportType, orderType = "one-way" }: WaitingDriverPageProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";

	const driverId = searchParams.get("driverId");
	const driverIdsParam = searchParams.get("driverIds");
	const sendToAll = searchParams.get("sendToAll") === "true";

	// Parse driver IDs if sendToAll mode
	const driverIds = useMemo(() => {
		if (sendToAll && driverIdsParam) {
			return driverIdsParam.split(",").filter(id => id.trim() !== "");
		}
		return driverId ? [driverId] : [];
	}, [sendToAll, driverIdsParam, driverId]);

	const [timeRemaining, setTimeRemaining] = useState(WAIT_TIME_SECONDS);
	const [drivers, setDrivers] = useState<DriverWithStatus[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasNavigated, setHasNavigated] = useState(false);

	// Load driver data from sessionStorage
	useEffect(() => {
		if (typeof window === "undefined" || driverIds.length === 0) {
			setIsLoading(false);
			return;
		}

		try {
			const loadedDrivers: DriverWithStatus[] = [];
			
			driverIds.forEach((id) => {
				const driverDataStr = sessionStorage.getItem(`driver_${id}`);
				if (driverDataStr) {
					const driverData = JSON.parse(driverDataStr);
					loadedDrivers.push({
						...driverData,
						status: "waiting" as DriverStatus,
					});
				} else {
					// Fallback data
					loadedDrivers.push({
						id: id,
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
						status: "waiting" as DriverStatus,
					});
				}
			});

			setDrivers(loadedDrivers);
		} catch (error) {
			console.error("Error loading driver data:", error);
		} finally {
			setIsLoading(false);
		}
	}, [driverIds, isMotorbike]);

	// Handle timeout
	const handleTimeout = useCallback(() => {
		setDrivers((prev) => {
			const updated = prev.map((d) => (d.status === "waiting" ? { ...d, status: "timeout" as DriverStatus } : d));
			
			// Store rejected drivers
			if (typeof window !== "undefined") {
				const rejectedDrivers = JSON.parse(sessionStorage.getItem("rejectedDrivers") || "[]");
				updated.forEach((driver) => {
					if (driver.status === "timeout" && !rejectedDrivers.includes(driver.id)) {
						rejectedDrivers.push(driver.id);
					}
				});
				sessionStorage.setItem("rejectedDrivers", JSON.stringify(rejectedDrivers));
			}

			// Return to choose driver after delay
			setTimeout(() => {
				const rejectedIds = updated.map(d => d.id).join(',');
				router.push(`/pickandorder/${transportType}/${orderType}/order/choose-driver?timeout=true&rejectedDriverIds=${rejectedIds}`);
			}, 2000);

			return updated;
		});
	}, [transportType, orderType, router]);

	// Watch for single driver acceptance - navigate immediately
	useEffect(() => {
		if (drivers.length !== 1 || sendToAll) return; // Only for single driver mode

		const driver = drivers[0];
		
		// If single driver accepts, navigate immediately
		if (driver.status === "accepted") {
			// Store accepted driver data
			if (typeof window !== "undefined") {
				sessionStorage.setItem("acceptedDrivers", JSON.stringify([driver]));
			}
			// Navigate to accepted drivers page after short delay for UX
			setTimeout(() => {
				router.push(`/pickandorder/${transportType}/${orderType}/order/accepted-drivers?sendToAll=false`);
			}, 1500);
		}
	}, [drivers, sendToAll, transportType, orderType, router]);

	// Watch for timer end and navigate to accepted drivers page (for multi-driver mode)
	useEffect(() => {
		if (drivers.length === 0 || timeRemaining > 0 || !sendToAll) return; // Only for multi-driver mode

		const acceptedDrivers = drivers.filter(d => d.status === "accepted");
		
		// If there are accepted drivers, navigate to accepted drivers page
		if (acceptedDrivers.length > 0) {
			// Store accepted drivers data
			if (typeof window !== "undefined") {
				sessionStorage.setItem("acceptedDrivers", JSON.stringify(acceptedDrivers));
			}
			// Navigate to accepted drivers page
			setTimeout(() => {
				router.push(`/pickandorder/${transportType}/${orderType}/order/accepted-drivers?sendToAll=${sendToAll}`);
			}, 500);
		} else {
			// No accepted drivers, handle timeout
			handleTimeout();
		}
	}, [timeRemaining, drivers, transportType, orderType, router, sendToAll, handleTimeout]);

	// Countdown timer
	useEffect(() => {
		if (drivers.length === 0) return;

		const interval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [drivers]);

	// Handle driver rejection
	const handleDriverRejected = useCallback((rejectedDriverId: string) => {
		if (hasNavigated) return; // Prevent multiple navigations
		
		setHasNavigated(true);
		
		if (typeof window !== "undefined") {
			const rejectedDrivers = JSON.parse(sessionStorage.getItem("rejectedDrivers") || "[]");
			if (!rejectedDrivers.includes(rejectedDriverId)) {
				rejectedDrivers.push(rejectedDriverId);
				sessionStorage.setItem("rejectedDrivers", JSON.stringify(rejectedDrivers));
			}
		}
		// Return to choose driver after delay
		setTimeout(() => {
			router.push(`/pickandorder/${transportType}/${orderType}/order/choose-driver?rejected=true&rejectedDriverId=${rejectedDriverId}`);
		}, 2000);
	}, [transportType, orderType, router, hasNavigated]);

	// Simulate driver responses (mock - in production this would be from WebSocket/API)
	useEffect(() => {
		if (drivers.length === 0) return;

		const timers: NodeJS.Timeout[] = [];

		drivers.forEach((driver) => {
			if (driver.status !== "waiting") return;

			// Simulate response time (5-25 seconds, different for each driver)
			const responseTime = Math.random() * 20000 + 5000 + (Math.random() * 5000);
			const willAccept = Math.random() > 0.3; // 70% acceptance rate

			const timer = setTimeout(() => {
				setDrivers((prev) => {
					const updated = prev.map((d) => {
						if (d.id === driver.id) {
							return {
								...d,
								status: (willAccept ? "accepted" : "rejected") as DriverStatus,
							};
						}
						return d;
					});

					return updated;
				});
			}, responseTime);

			timers.push(timer);
		});

		return () => {
			timers.forEach(timer => clearTimeout(timer));
		};
	}, [drivers]);

	// Watch for rejection in single driver mode and navigate back
	useEffect(() => {
		if (!sendToAll && drivers.length === 1) {
			const driver = drivers[0];
			if (driver.status === "rejected" && !hasNavigated) {
				handleDriverRejected(driver.id);
			}
		}
	}, [drivers, sendToAll, handleDriverRejected, hasNavigated]);

	// Handle cancel
	const handleCancel = useCallback(() => {
		router.push(`/pickandorder/${transportType}/${orderType}/order/choose-driver`);
	}, [router, transportType, orderType]);

	const progressPercentage = ((WAIT_TIME_SECONDS - timeRemaining) / WAIT_TIME_SECONDS) * 100;
	const VehicleIcon = isMotorbike ? Bike : Truck;

	// Calculate statistics
	const stats = useMemo(() => {
		const waiting = drivers.filter(d => d.status === "waiting").length;
		const accepted = drivers.filter(d => d.status === "accepted").length;
		const rejected = drivers.filter(d => d.status === "rejected").length;
		const timeout = drivers.filter(d => d.status === "timeout").length;
		return { waiting, accepted, rejected, timeout, total: drivers.length };
	}, [drivers]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
			</div>
		);
	}

	if (drivers.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
						{isArabic ? "خطأ" : "Error"}
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						{isArabic ? "لم يتم العثور على بيانات السائقين" : "Driver data not found"}
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

	// Single driver mode (original UI)
	if (!sendToAll || drivers.length === 1) {
		const driver = drivers[0];
		const driverStatus = driver.status;

		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4">
				<div className="w-full max-w-md">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
					>
						<div className="text-center mb-4 sm:mb-6">
							{driverStatus === "waiting" && (
								<div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
									<Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400 animate-spin" />
								</div>
							)}
							{driverStatus === "accepted" && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
								>
									<CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
								</motion.div>
							)}
							{(driverStatus === "rejected" || driverStatus === "timeout") && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
								>
									<X className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
								</motion.div>
							)}

							<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
								{driverStatus === "waiting" && (isArabic ? "في انتظار قبول السائق" : "Waiting for Driver")}
								{driverStatus === "accepted" && (isArabic ? "تم قبول الطلب!" : "Request Accepted!")}
								{driverStatus === "rejected" && (isArabic ? "تم رفض الطلب" : "Request Rejected")}
								{driverStatus === "timeout" && (isArabic ? "انتهى الوقت" : "Time Expired")}
							</h2>

							{driverStatus === "waiting" && (
								<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
									{isArabic 
										? "يرجى الانتظار بينما نتحقق من قبول السائق لطلبك"
										: "Please wait while we confirm the driver's acceptance"
									}
								</p>
							)}
						</div>

						{driverStatus === "waiting" && (
							<div className="mb-4 sm:mb-6">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-1.5 sm:gap-2">
										<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
										<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
											{isArabic ? "الوقت المتبقي" : "Time Remaining"}
										</span>
									</div>
									<span className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
										{timeRemaining}s
									</span>
								</div>
								<div className="w-full h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<motion.div
										initial={{ width: "0%" }}
										animate={{ width: `${progressPercentage}%` }}
										transition={{ duration: 1, ease: "linear" }}
										className="h-full bg-gradient-to-r from-green-500 to-green-600"
									/>
								</div>
							</div>
						)}

						<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
							<div className="flex items-center gap-3 sm:gap-4">
								<div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-500">
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
									<h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-1">
										{isArabic ? driver.nameAr : driver.name}
									</h3>
									<div className="flex items-center gap-1.5 sm:gap-2 mb-1">
										<Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
										<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
											{driver.rating.toFixed(1)}
										</span>
										<span className="text-xs text-gray-500 dark:text-gray-400">
											({driver.reviewsCount} {isArabic ? "تقييم" : "reviews"})
										</span>
									</div>
									<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
										<VehicleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										<span className="truncate">{driver.vehicleModel}</span>
										<span className="text-xs">•</span>
										<span className="truncate">{driver.licensePlate}</span>
									</div>
								</div>
							</div>
						</div>

						<AnimatePresence>
							{driverStatus === "accepted" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4"
								>
									<p className="text-green-800 dark:text-green-200 text-center font-semibold text-xs sm:text-sm">
										{isArabic 
											? "تم قبول طلبك بنجاح! جاري التوجيه لعرض التفاصيل والسعر..."
											: "Your request has been accepted! Redirecting to view details and pricing..."
										}
									</p>
								</motion.div>
							)}

							{(driverStatus === "rejected" || driverStatus === "timeout") && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4"
								>
									<p className="text-red-800 dark:text-red-200 text-center font-semibold text-xs sm:text-sm">
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

						{driverStatus === "waiting" && (
							<button
								onClick={handleCancel}
								className="w-full py-2.5 sm:py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-colors"
							>
								{isArabic ? "إلغاء" : "Cancel"}
							</button>
						)}
					</motion.div>
				</div>
			</div>
		);
	}

	// Multi-driver mode (Send to All)
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4">
			<div className="w-full max-w-4xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
				>
					{/* Header */}
					<div className="text-center mb-4 sm:mb-6">
						<div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center">
							<Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
						</div>
						<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
							{isArabic ? "في انتظار رد السائقين" : "Waiting for Drivers' Response"}
						</h2>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
							{isArabic 
								? `تم إرسال الطلب إلى ${stats.total} سائق. ننتظر ردهم...`
								: `Request sent to ${stats.total} drivers. Waiting for their response...`
							}
						</p>
					</div>

					{/* Statistics Bar */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-blue-200 dark:border-blue-800">
							<div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.waiting}</div>
							<div className="text-xs text-blue-700 dark:text-blue-300 mt-0.5 sm:mt-1">
								{isArabic ? "في الانتظار" : "Waiting"}
							</div>
						</div>
						<div className="bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-green-200 dark:border-green-800">
							<div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{stats.accepted}</div>
							<div className="text-xs text-green-700 dark:text-green-300 mt-0.5 sm:mt-1">
								{isArabic ? "مقبول" : "Accepted"}
							</div>
						</div>
						<div className="bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-red-200 dark:border-red-800">
							<div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
							<div className="text-xs text-red-700 dark:text-red-300 mt-0.5 sm:mt-1">
								{isArabic ? "مرفوض" : "Rejected"}
							</div>
						</div>
						<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-gray-200 dark:border-gray-700">
							<div className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.timeout}</div>
							<div className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 sm:mt-1">
								{isArabic ? "انتهى الوقت" : "Timeout"}
							</div>
						</div>
					</div>

					{/* Countdown Timer */}
					{stats.waiting > 0 && (
						<div className="mb-4 sm:mb-6">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-1.5 sm:gap-2">
									<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
									<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
										{isArabic ? "الوقت المتبقي" : "Time Remaining"}
									</span>
								</div>
								<span className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
									{timeRemaining}s
								</span>
							</div>
							<div className="w-full h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: "0%" }}
									animate={{ width: `${progressPercentage}%` }}
									transition={{ duration: 1, ease: "linear" }}
									className="h-full bg-gradient-to-r from-green-500 to-green-600"
								/>
							</div>
						</div>
					)}

					{/* Drivers List */}
					<div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto mb-4 sm:mb-6">
						<AnimatePresence>
							{drivers.map((driver, index) => (
								<motion.div
									key={driver.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ delay: index * 0.1 }}
									className={`
										bg-gradient-to-br rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 transition-all
										${driver.status === "accepted"
											? "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-700 shadow-lg"
											: driver.status === "rejected"
											? "from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-300 dark:border-red-700"
											: driver.status === "timeout"
											? "from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border-gray-300 dark:border-gray-700"
											: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300 dark:border-blue-700"
										}
									`}
								>
									<div className="flex items-center gap-2 sm:gap-4">
										{/* Avatar */}
										<div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 ${
											driver.status === "accepted"
												? "border-green-500"
												: driver.status === "rejected"
												? "border-red-500"
												: driver.status === "timeout"
												? "border-gray-500"
												: "border-blue-500"
										}`}>
											{driver.avatar ? (
												<Image
													src={driver.avatar}
													alt={isArabic ? driver.nameAr : driver.name}
													fill
													className="object-cover"
													unoptimized
												/>
											) : (
												<div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
													<User className="w-7 h-7 text-white" />
												</div>
											)}
										</div>

										{/* Driver Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-1.5 sm:gap-2 mb-1">
												<h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
													{isArabic ? driver.nameAr : driver.name}
												</h3>
												{driver.status === "accepted" && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className="bg-green-500 rounded-full p-0.5 sm:p-1 flex-shrink-0"
													>
														<CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
													</motion.div>
												)}
												{driver.status === "rejected" && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className="bg-red-500 rounded-full p-0.5 sm:p-1 flex-shrink-0"
													>
														<X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
													</motion.div>
												)}
											</div>
											<div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
												<Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
												<span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
													{driver.rating.toFixed(1)}
												</span>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													({driver.reviewsCount})
												</span>
												<span className="text-xs text-gray-400 hidden sm:inline">•</span>
												<VehicleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
												<span className="text-xs text-gray-600 dark:text-gray-400 truncate">
													{driver.vehicleModel}
												</span>
											</div>
										</div>

										{/* Status Badge */}
										<div className="flex-shrink-0">
											{driver.status === "waiting" && (
												<div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
													<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 animate-spin" />
													<span className="text-xs font-semibold text-blue-700 dark:text-blue-300 hidden sm:inline">
														{isArabic ? "في الانتظار" : "Waiting"}
													</span>
												</div>
											)}
											{driver.status === "accepted" && (
												<div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
													<CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
													<span className="text-xs font-semibold text-green-700 dark:text-green-300 hidden sm:inline">
														{isArabic ? "مقبول" : "Accepted"}
													</span>
												</div>
											)}
											{driver.status === "rejected" && (
												<div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
													<X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
													<span className="text-xs font-semibold text-red-700 dark:text-red-300 hidden sm:inline">
														{isArabic ? "مرفوض" : "Rejected"}
													</span>
												</div>
											)}
											{driver.status === "timeout" && (
												<div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full">
													<Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
													<span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline">
														{isArabic ? "انتهى الوقت" : "Timeout"}
													</span>
												</div>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>

					{/* Info Message */}
					{stats.accepted > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4"
						>
							<div className="flex items-center gap-2 sm:gap-3">
								<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
								<div className="flex-1">
									<p className="text-green-800 dark:text-green-200 font-semibold text-xs sm:text-sm">
										{isArabic 
											? `${stats.accepted} سائق قبل الطلب. انتظر حتى انتهاء الوقت لاختيار السائق المناسب.`
											: `${stats.accepted} driver(s) accepted. Wait until time ends to choose the best driver.`
										}
									</p>
								</div>
							</div>
						</motion.div>
					)}

					{/* Cancel Button */}
					{stats.waiting > 0 && (
						<button
							onClick={handleCancel}
							className="w-full py-2.5 sm:py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-colors"
						>
							{isArabic ? "إلغاء" : "Cancel"}
						</button>
					)}
				</motion.div>
			</div>
		</div>
	);
}
