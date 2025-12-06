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
	AlertCircle,
	Users,
	Briefcase
} from "lucide-react";
import Image from "next/image";

interface WaitingWorkerPageProps {
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
}

type WorkerStatus = "waiting" | "accepted" | "rejected" | "timeout";

interface WorkerWithStatus extends Worker {
	status: WorkerStatus;
}

const WAIT_TIME_SECONDS = 30;

export default function WaitingWorkerPage({ service, serviceType }: WaitingWorkerPageProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const workerId = searchParams.get("workerId");
	const workerIdsParam = searchParams.get("workerIds");
	const sendToAll = searchParams.get("sendToAll") === "true";

	// Parse worker IDs if sendToAll mode
	const workerIds = useMemo(() => {
		if (sendToAll && workerIdsParam) {
			return workerIdsParam.split(",").filter(id => id.trim() !== "");
		}
		return workerId ? [workerId] : [];
	}, [sendToAll, workerIdsParam, workerId]);

	const [timeRemaining, setTimeRemaining] = useState(WAIT_TIME_SECONDS);
	const [workers, setWorkers] = useState<WorkerWithStatus[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasNavigated, setHasNavigated] = useState(false);

	// Load worker data from sessionStorage
	useEffect(() => {
		if (typeof window === "undefined" || workerIds.length === 0) {
			setIsLoading(false);
			return;
		}

		try {
			const loadedWorkers: WorkerWithStatus[] = [];
			
			workerIds.forEach((id) => {
				const workerDataStr = sessionStorage.getItem(`worker_${id}`);
				if (workerDataStr) {
					const workerData = JSON.parse(workerDataStr);
					loadedWorkers.push({
						...workerData,
						status: "waiting" as WorkerStatus,
					});
				} else {
					// Fallback data
					loadedWorkers.push({
						id: id,
						name: "Worker",
						nameAr: "عامل",
						avatar: "/worker1.jpg",
						rating: 4.5,
						reviewsCount: 100,
						experience: isArabic ? "5 سنوات" : "5 years",
						location: isArabic ? "الرياض" : "Riyadh",
						distance: 0,
						estimatedTime: 15,
						status: "waiting" as WorkerStatus,
					});
				}
			});

			setWorkers(loadedWorkers);
		} catch (error) {
			console.error("Error loading worker data:", error);
		} finally {
			setIsLoading(false);
		}
	}, [workerIds, isArabic]);

	// Handle timeout
	const handleTimeout = useCallback(() => {
		setWorkers((prev) => {
			const updated = prev.map((w) => (w.status === "waiting" ? { ...w, status: "timeout" as WorkerStatus } : w));
			
			// Store rejected workers
			if (typeof window !== "undefined") {
				const rejectedWorkers = JSON.parse(sessionStorage.getItem("rejectedWorkers") || "[]");
				updated.forEach((worker) => {
					if (worker.status === "timeout" && !rejectedWorkers.includes(worker.id)) {
						rejectedWorkers.push(worker.id);
					}
				});
				sessionStorage.setItem("rejectedWorkers", JSON.stringify(rejectedWorkers));
			}

			// Return to choose worker after delay
			setTimeout(() => {
				const rejectedIds = updated.map(w => w.id).join(',');
				router.push(`/serve-me/${service}/${serviceType}/book/choose-worker?timeout=true&rejectedWorkerIds=${rejectedIds}`);
			}, 2000);

			return updated;
		});
	}, [service, serviceType, router]);

	// Watch for single worker acceptance - navigate immediately
	useEffect(() => {
		if (workers.length !== 1 || sendToAll) return; // Only for single worker mode

		const worker = workers[0];
		
		// If single worker accepts, navigate immediately
		if (worker.status === "accepted") {
			// Store accepted worker data
			if (typeof window !== "undefined") {
				sessionStorage.setItem("acceptedWorkers", JSON.stringify([worker]));
			}
			// Navigate to accepted workers page after short delay for UX
			setTimeout(() => {
				router.push(`/serve-me/${service}/${serviceType}/order/accepted-workers?sendToAll=false`);
			}, 1500);
		}
	}, [workers, sendToAll, service, serviceType, router]);

	// Watch for timer end and navigate to accepted workers page (for multi-worker mode)
	useEffect(() => {
		if (workers.length === 0 || timeRemaining > 0 || !sendToAll) return; // Only for multi-worker mode

		const acceptedWorkers = workers.filter(w => w.status === "accepted");
		
		// If there are accepted workers, navigate to accepted workers page
		if (acceptedWorkers.length > 0) {
			// Store accepted workers data
			if (typeof window !== "undefined") {
				sessionStorage.setItem("acceptedWorkers", JSON.stringify(acceptedWorkers));
			}
			// Navigate to accepted workers page
			setTimeout(() => {
				router.push(`/serve-me/${service}/${serviceType}/order/accepted-workers?sendToAll=${sendToAll}`);
			}, 500);
		} else {
			// No accepted workers, handle timeout
			handleTimeout();
		}
	}, [timeRemaining, workers, service, serviceType, router, sendToAll, handleTimeout]);

	// Countdown timer
	useEffect(() => {
		if (workers.length === 0) return;

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
	}, [workers]);

	// Handle worker rejection
	const handleWorkerRejected = useCallback((rejectedWorkerId: string) => {
		if (hasNavigated) return; // Prevent multiple navigations
		
		setHasNavigated(true);
		
		if (typeof window !== "undefined") {
			const rejectedWorkers = JSON.parse(sessionStorage.getItem("rejectedWorkers") || "[]");
			if (!rejectedWorkers.includes(rejectedWorkerId)) {
				rejectedWorkers.push(rejectedWorkerId);
				sessionStorage.setItem("rejectedWorkers", JSON.stringify(rejectedWorkers));
			}
		}
		// Return to choose worker after delay
		setTimeout(() => {
			router.push(`/serve-me/${service}/${serviceType}/book/choose-worker?rejected=true&rejectedWorkerId=${rejectedWorkerId}`);
		}, 2000);
	}, [service, serviceType, router, hasNavigated]);

	// Simulate worker responses (mock - in production this would be from WebSocket/API)
	useEffect(() => {
		if (workers.length === 0) return;

		const timers: NodeJS.Timeout[] = [];

		workers.forEach((worker) => {
			if (worker.status !== "waiting") return;

			// Simulate response time (5-25 seconds, different for each worker)
			const responseTime = Math.random() * 20000 + 5000 + (Math.random() * 5000);
			const willAccept = Math.random() > 0.3; // 70% acceptance rate

			const timer = setTimeout(() => {
				setWorkers((prev) => {
					const updated = prev.map((w) => {
						if (w.id === worker.id) {
							return {
								...w,
								status: (willAccept ? "accepted" : "rejected") as WorkerStatus,
							};
						}
						return w;
					});

					return updated;
				});
			}, responseTime);

			timers.push(timer);
		});

		return () => {
			timers.forEach(timer => clearTimeout(timer));
		};
	}, [workers]);

	// Watch for rejection in single worker mode and navigate back
	useEffect(() => {
		if (!sendToAll && workers.length === 1) {
			const worker = workers[0];
			if (worker.status === "rejected" && !hasNavigated) {
				handleWorkerRejected(worker.id);
			}
		}
	}, [workers, sendToAll, handleWorkerRejected, hasNavigated]);

	// Handle cancel
	const handleCancel = useCallback(() => {
		router.push(`/serve-me/${service}/${serviceType}/book/choose-worker`);
	}, [router, service, serviceType]);

	const progressPercentage = ((WAIT_TIME_SECONDS - timeRemaining) / WAIT_TIME_SECONDS) * 100;

	// Calculate statistics
	const stats = useMemo(() => {
		const waiting = workers.filter(w => w.status === "waiting").length;
		const accepted = workers.filter(w => w.status === "accepted").length;
		const rejected = workers.filter(w => w.status === "rejected").length;
		const timeout = workers.filter(w => w.status === "timeout").length;
		return { waiting, accepted, rejected, timeout, total: workers.length };
	}, [workers]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white dark:bg-gray-900">
				<div className="flex items-center justify-center h-screen">
					<Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
				</div>
			</div>
		);
	}

	if (workers.length === 0) {
		return (
			<div className="min-h-screen bg-white dark:bg-gray-900">
				<div className="flex items-center justify-center h-screen p-4">
					<div className="text-center">
						<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							{isArabic ? "خطأ" : "Error"}
						</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							{isArabic ? "لم يتم العثور على بيانات العمال" : "Worker data not found"}
						</p>
						<button
							onClick={handleCancel}
							className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
						>
							{isArabic ? "العودة" : "Go Back"}
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Single worker mode (original UI)
	if (!sendToAll || workers.length === 1) {
		const worker = workers[0];
		const workerStatus = worker.status;

		return (
			<div className="min-h-screen bg-white dark:bg-gray-900">
				<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4 min-h-screen">
					<div className="w-full max-w-md">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
					>
						<div className="text-center mb-4 sm:mb-6">
							{workerStatus === "waiting" && (
								<div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
									<Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400 animate-spin" />
								</div>
							)}
							{workerStatus === "accepted" && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
								>
									<CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
								</motion.div>
							)}
							{(workerStatus === "rejected" || workerStatus === "timeout") && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
								>
									<X className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
								</motion.div>
							)}

							<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
								{workerStatus === "waiting" && (isArabic ? "في انتظار قبول الفني" : "Waiting for Worker")}
								{workerStatus === "accepted" && (isArabic ? "تم قبول الطلب!" : "Request Accepted!")}
								{workerStatus === "rejected" && (isArabic ? "تم رفض الطلب" : "Request Rejected")}
								{workerStatus === "timeout" && (isArabic ? "انتهى الوقت" : "Time Expired")}
							</h2>

							{workerStatus === "waiting" && (
								<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
									{isArabic 
										? "يرجى الانتظار بينما نتحقق من قبول الفني لطلبك"
										: "Please wait while we confirm the worker's acceptance"
									}
								</p>
							)}
						</div>

						{workerStatus === "waiting" && (
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
									{worker.avatar ? (
										<Image
											src={worker.avatar}
											alt={isArabic ? worker.nameAr : worker.name}
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
										{isArabic ? worker.nameAr : worker.name}
									</h3>
									<div className="flex items-center gap-1.5 sm:gap-2 mb-1">
										<Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
										<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
											{worker.rating.toFixed(1)}
										</span>
										<span className="text-xs text-gray-500 dark:text-gray-400">
											({worker.reviewsCount} {isArabic ? "تقييم" : "reviews"})
										</span>
									</div>
									<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
										<Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										<span className="truncate">{worker.experience}</span>
										<span className="text-xs">•</span>
										<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										<span className="truncate">{worker.location}</span>
									</div>
								</div>
							</div>
						</div>

						<AnimatePresence>
							{workerStatus === "accepted" && (
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

							{(workerStatus === "rejected" || workerStatus === "timeout") && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4"
								>
									<p className="text-red-800 dark:text-red-200 text-center font-semibold text-xs sm:text-sm">
										{workerStatus === "rejected" 
											? (isArabic 
												? "عذراً، رفض الفني الطلب. جاري العودة لاختيار فني آخر..."
												: "Sorry, the worker rejected the request. Returning to choose another worker...")
											: (isArabic 
												? "انتهى وقت الانتظار. جاري العودة لاختيار فني آخر..."
												: "Wait time expired. Returning to choose another worker...")
										}
									</p>
								</motion.div>
							)}
						</AnimatePresence>

						{workerStatus === "waiting" && (
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
			</div>
		);
	}

	// Multi-worker mode (Send to All)
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4 min-h-screen">
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
							{isArabic ? "في انتظار رد الفنيين" : "Waiting for Workers' Response"}
						</h2>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
							{isArabic 
								? `تم إرسال الطلب إلى ${stats.total} فني. ننتظر ردهم...`
								: `Request sent to ${stats.total} workers. Waiting for their response...`
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

					{/* Workers List */}
					<div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto mb-4 sm:mb-6">
						<AnimatePresence>
							{workers.map((worker, index) => (
								<motion.div
									key={worker.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ delay: index * 0.1 }}
									className={`
										bg-gradient-to-br rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 transition-all
										${worker.status === "accepted"
											? "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-700 shadow-lg"
											: worker.status === "rejected"
											? "from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-300 dark:border-red-700"
											: worker.status === "timeout"
											? "from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border-gray-300 dark:border-gray-700"
											: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300 dark:border-blue-700"
										}
									`}
								>
									<div className="flex items-center gap-2 sm:gap-4">
										{/* Avatar */}
										<div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 ${
											worker.status === "accepted"
												? "border-green-500"
												: worker.status === "rejected"
												? "border-red-500"
												: worker.status === "timeout"
												? "border-gray-500"
												: "border-blue-500"
										}`}>
											{worker.avatar ? (
												<Image
													src={worker.avatar}
													alt={isArabic ? worker.nameAr : worker.name}
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

										{/* Worker Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-1.5 sm:gap-2 mb-1">
												<h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
													{isArabic ? worker.nameAr : worker.name}
												</h3>
												{worker.status === "accepted" && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className="bg-green-500 rounded-full p-0.5 sm:p-1 flex-shrink-0"
													>
														<CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
													</motion.div>
												)}
												{worker.status === "rejected" && (
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
													{worker.rating.toFixed(1)}
												</span>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													({worker.reviewsCount})
												</span>
												<span className="text-xs text-gray-400 hidden sm:inline">•</span>
												<Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
												<span className="text-xs text-gray-600 dark:text-gray-400 truncate">
													{worker.experience}
												</span>
											</div>
										</div>

										{/* Status Badge */}
										<div className="flex-shrink-0">
											{worker.status === "waiting" && (
												<div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
													<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 animate-spin" />
													<span className="text-xs font-semibold text-blue-700 dark:text-blue-300 hidden sm:inline">
														{isArabic ? "في الانتظار" : "Waiting"}
													</span>
												</div>
											)}
											{worker.status === "accepted" && (
												<div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
													<CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
													<span className="text-xs font-semibold text-green-700 dark:text-green-300 hidden sm:inline">
														{isArabic ? "مقبول" : "Accepted"}
													</span>
												</div>
											)}
											{worker.status === "rejected" && (
												<div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
													<X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
													<span className="text-xs font-semibold text-red-700 dark:text-red-300 hidden sm:inline">
														{isArabic ? "مرفوض" : "Rejected"}
													</span>
												</div>
											)}
											{worker.status === "timeout" && (
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
											? `${stats.accepted} فني قبل الطلب. انتظر حتى انتهاء الوقت لاختيار الفني المناسب.`
											: `${stats.accepted} worker(s) accepted. Wait until time ends to choose the best worker.`
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
		</div>
	);
}

