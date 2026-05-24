"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import StepperNavigation from "@/shared/components/steppernavigation/StepperNavigation";
import {
	CheckCircle,
	Calendar,
	ArrowLeft,
	Receipt,
	MapPin,
	FileText,
	Car,
	Clock,
	Package,
	Copy,
	Check,
} from "lucide-react";
import { ServiceStorage } from "@/shared/lib/serviceStorage";

interface BookingData {
	serviceType?: string;
	serviceSubtype?: string;
	make?: string;
	model?: string;
	year?: string;
	date?: string;
	time?: string;
	scheduleType?: string;
	location?: string;
	description?: string;
	notes?: string;
	bookingId?: string;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
	maintenance: "صيانة السيارات",
	trade: "بيع وشراء السيارات",
	parts: "قطع الغيار",
};

const SERVICE_SUBTYPE_LABELS: Record<string, string> = {
	mechanical: "صيانة ميكانيكا",
	electrical: "صيانة كهرباء",
	comprehensive: "صيانة دورية شاملة",
	bodywork: "سمكرة ودهان",
	sell: "عرض سيارة للبيع",
	buy: "طلب شراء سيارة",
	used: "قطع غيار تشليح/مستعمل",
	new: "قطع غيار جديدة",
};

export default function ConfirmationPage({ service }: { service: string }) {
	const router = useRouter();
	const [bookingData, setBookingData] = useState<BookingData | null>(null);
	const [locationAddress, setLocationAddress] = useState<string>("");
	const [copied, setCopied] = useState(false);
	const [showConfetti, setShowConfetti] = useState(true);

	// Generate booking ID if not exists
	const bookingId = useMemo(() => {
		if (bookingData?.bookingId) return bookingData.bookingId;
		return `BK-${Date.now().toString().slice(-8)}`;
	}, [bookingData?.bookingId]);

	// Load confirmation data (one-time use)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			try {
				// Load from sessionStorage (cleared after reading)
				const confirmationData = ServiceStorage.loadConfirmationData(service);

				if (confirmationData) {
					setBookingData(confirmationData);
				} else {
					// Fallback: try to load from localStorage (backward compatibility)
					const fallbackData = ServiceStorage.loadBookingData(service);
					if (fallbackData) {
						setBookingData(fallbackData);
					}
				}
			} catch (error) {
				console.error('Error loading booking data:', error);
			}
		}

		// Hide confetti after 3 seconds
		const timer = setTimeout(() => setShowConfetti(false), 3000);
		return () => clearTimeout(timer);
	}, [service]);

	// Clear all service data after user has viewed confirmation
	useEffect(() => {
		const clearTimer = setTimeout(() => {
			ServiceStorage.clearAllServiceData(service);
		}, 30000); // Clear after 30 seconds
		return () => clearTimeout(clearTimer);
	}, [service]);

	// Reverse geocode location
	useEffect(() => {
		const reverseGeocode = async (lat: number, lng: number) => {
			if (typeof google === 'undefined') return;

			try {
				const geocoder = new google.maps.Geocoder();
				const response = await geocoder.geocode({
					location: { lat, lng },
					language: 'ar',
				});

				if (response.results && response.results[0]) {
					setLocationAddress(response.results[0].formatted_address);
				}
			} catch (error) {
				console.error("Reverse geocoding error:", error);
			}
		};

		if (bookingData?.location) {
			const [lat, lng] = bookingData.location.split(",").map(parseFloat);
			if (!isNaN(lat) && !isNaN(lng)) {
				reverseGeocode(lat, lng);
			}
		}
	}, [bookingData?.location]);

	const handleBackToProjects = useCallback(() => {
		// Ensure everything is cleared
		ServiceStorage.clearAllServiceData(service);
		router.push("/projects");
	}, [router, service]);

	const handleCopyBookingId = useCallback(() => {
		navigator.clipboard.writeText(bookingId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);


	}, [bookingId]);

	const handleDownloadReceipt = useCallback(() => {

	}, [bookingId]);

	const handleShare = useCallback(() => {
		if (navigator.share) {
			navigator.share({
				title: 'تأكيد الحجز',
				text: `رقم الحجز: ${bookingId}`,
			});
		}
	}, [bookingId]);

	const formattedDate = useMemo(() => {
		if (!bookingData?.date) return null;
		try {
			return new Date(bookingData.date).toLocaleDateString("ar-SA", {
				weekday: 'long',
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return bookingData.date;
		}
	}, [bookingData?.date]);

	const serviceLabel = useMemo(() => {
		if (!bookingData?.serviceType) return null;
		const main = SERVICE_TYPE_LABELS[bookingData.serviceType];
		const sub = bookingData.serviceSubtype ? SERVICE_SUBTYPE_LABELS[bookingData.serviceSubtype] : null;
		return sub ? `${main} - ${sub}` : main;
	}, [bookingData?.serviceType, bookingData?.serviceSubtype]);

	if (!bookingData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50  via-green-50/20  to-white  flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 ">جاري التحميل...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50  via-green-50/20  to-white  rtl mb-12" dir="rtl">
			<StepperNavigation service={service} />

			{/* Confetti Animation */}
			{showConfetti && (
				<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
					{[...Array(30)].map((_, i) => (
						<div
							key={i}
							className="absolute w-2 h-2 bg-green-500 rounded-full animate-confetti"
							style={{
								left: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 2}s`,
								animationDuration: `${2 + Math.random() * 2}s`,
							}}
						/>
					))}
				</div>
			)}

			<div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				{/* Success Animation */}
				<div className="flex justify-center mb-8 relative">
					<div className="relative">
						<div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600   rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
							<CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
						</div>
						<div className="absolute inset-0 bg-green-400  rounded-full animate-ping opacity-20"></div>
					</div>
				</div>

				{/* Main Card */}
				<div className="bg-white  rounded-2xl shadow-2xl border border-gray-200  overflow-hidden">

					{/* Header */}
					<div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50    px-6 sm:px-8 py-8 border-b border-gray-200 ">
						<div className="text-center space-y-3">
							<h1 className="text-3xl sm:text-4xl font-bold text-gray-900  mb-2">
								تم تأكيد الحجز بنجاح! 🎉
							</h1>
							<p className="text-base text-gray-600 ">
								شكراً لثقتك بنا. سنتواصل معك قريباً
							</p>

							{/* Booking ID Badge */}
							<div className="inline-flex items-center gap-2 bg-white  px-4 py-2.5 rounded-full shadow-md border border-gray-200  mt-4">
								<Receipt className="w-4 h-4 text-green-600 " />
								<span className="text-sm text-gray-600 ">رقم الحجز:</span>
								<span className="font-bold text-gray-900  font-mono">{bookingId}</span>
								<button
									onClick={handleCopyBookingId}
									className="p-1.5 hover:bg-gray-100  rounded-lg transition-colors"
									title="نسخ رقم الحجز"
								>
									{copied ? (
										<Check className="w-4 h-4 text-green-600 " />
									) : (
										<Copy className="w-4 h-4 text-gray-400 " />
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-6 sm:p-8 space-y-6">

						{/* Service Details */}
						<section className="bg-gradient-to-br from-gray-50 to-white   rounded-xl p-5 border border-gray-200 ">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 rounded-lg bg-green-100  flex items-center justify-center">
									<FileText className="w-5 h-5 text-green-600 " />
								</div>
								<h2 className="text-lg font-bold text-gray-900 ">
									تفاصيل الخدمة
								</h2>
							</div>
							<div className="space-y-3 mr-12">
								{serviceLabel && (
									<DetailRow label="الخدمة" value={serviceLabel} />
								)}
								{bookingData.make && bookingData.model && (
									<DetailRow
										label="السيارة"
										value={`${bookingData.make} ${bookingData.model}${bookingData.year ? ` - ${bookingData.year}` : ''}`}
										icon={<Car className="w-4 h-4" />}
									/>
								)}
								{bookingData.description && (
									<div className="pt-3 border-t border-gray-200 ">
										<p className="text-xs text-gray-500  mb-1">الوصف:</p>
										<p className="text-sm text-gray-700  leading-relaxed">
											{bookingData.description}
										</p>
									</div>
								)}
							</div>
						</section>

						{/* Schedule */}
						{(bookingData.date || bookingData.scheduleType === 'instant') && (
							<section className="bg-gradient-to-br from-gray-50 to-white   rounded-xl p-5 border border-gray-200 ">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-lg bg-blue-100  flex items-center justify-center">
										<Clock className="w-5 h-5 text-blue-600 0" />
									</div>
									<h2 className="text-lg font-bold text-gray-900 ">
										موعد الخدمة
									</h2>
								</div>
								<div className="space-y-3 mr-12">
									{bookingData.scheduleType === 'instant' ? (
										<div className="flex items-center gap-3 bg-orange-50  px-4 py-3 rounded-lg border border-orange-200 ">
											<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
											<span className="font-semibold text-orange-700 ">
												خدمة فورية - سنتواصل معك خلال دقائق
											</span>
										</div>
									) : (
										<>
											{formattedDate && (
												<DetailRow
													label="التاريخ"
													value={formattedDate}
													icon={<Calendar className="w-4 h-4" />}
												/>
											)}
											{bookingData.time && (
												<DetailRow
													label="الوقت"
													value={bookingData.time}
													icon={<Clock className="w-4 h-4" />}
												/>
											)}
										</>
									)}
								</div>
							</section>
						)}

						{/* Location */}
						{bookingData.location && (
							<section className="bg-gradient-to-br from-gray-50 to-white   rounded-xl p-5 border border-gray-200 ">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-lg bg-purple-100  flex items-center justify-center">
										<MapPin className="w-5 h-5 text-purple-600 " />
									</div>
									<h2 className="text-lg font-bold text-gray-900 ">
										موقع الخدمة
									</h2>
								</div>
								<div className="mr-12">
									<p className="text-sm text-gray-700  leading-relaxed">
										{locationAddress || "موقع محدد على الخريطة"}
									</p>
									<p className="text-xs text-gray-500  font-mono mt-2">
										{bookingData.location}
									</p>
								</div>
							</section>
						)}

						{/* Notes */}
						{bookingData.notes && (
							<section className="bg-gradient-to-br from-gray-50 to-white   rounded-xl p-5 border border-gray-200 ">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-lg bg-amber-100  flex items-center justify-center">
										<FileText className="w-5 h-5 text-amber-600 " />
									</div>
									<h2 className="text-lg font-bold text-gray-900 ">
										ملاحظات إضافية
									</h2>
								</div>
								<div className="mr-12">
									<p className="text-sm text-gray-700  leading-relaxed whitespace-pre-wrap">
										{bookingData.notes}
									</p>
								</div>
							</section>
						)}

						{/* Action Buttons */}
						<div className="pt-4 space-y-3">
							{/* Track Order */}
							<button
								onClick={handleBackToProjects}
								className="w-full bg-gradient-to-r from-green-600 to-emerald-600   hover:from-green-700 hover:to-emerald-700  text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group"
							>
								<Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
								<span>تتبع الطلب</span>
							</button>


						</div>
					</div>


				</div>

				{/* Info Banner */}
				<div className="mt-6 bg-blue-50  border border-blue-200  rounded-xl p-4">
					<p className="text-sm text-blue-800 text-center">
						💡 احتفظ برقم الحجز للمراجعة. سنرسل لك رسالة تأكيد عبر الجوال
					</p>
				</div>
			</div>
		</div>
	);
}

function DetailRow({
	label,
	value,
	icon
}: {
	label: string;
	value: string;
	icon?: React.ReactNode;
}) {
	return (
		<div className="flex items-start gap-3">
			{icon && <span className="text-gray-400  mt-0.5">{icon}</span>}
			<span className="text-sm text-gray-600  flex-shrink-0">
				{label}:
			</span>
			<span className="font-medium text-gray-900  flex-1 text-right">
				{value}
			</span>
		</div>
	);
}

