"use client";

import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StepperNavigation from "@/shared/components/steppernavigation/StepperNavigation";
import {
	ArrowRight,
	Edit2,
	FileText,
	MapPin,
	Calendar,
	Clock,
	Image as ImageIcon,
	Video,
	Mic,
	Car,
	AlertCircle,
	DollarSign,
	Globe,
	Target,
	Timer,
	Sparkles
} from "lucide-react";
import { useServiceOrderSubmit } from "../hooks/useServiceData";
import { ServiceStorage } from "@/shared/lib/serviceStorage";
import { NotificationDialog } from "@/shared/components/NotificationDialog/NotificationDialog";

interface BookingData {
	// Service details
	category?: string;
	categoryId?: string;
	specailization?: string;
	specailizationId?: string;
	serviceLocation?: string;

	// Car details
	make?: string;
	makeId?: string;
	model?: string;
	modelId?: string;
	year?: string;
	plateNumber?: string;
	mileage?: string;
	transmission?: string;
	fuelType?: string;
	vinNumber?: string;

	// Booking details
	description?: string;
	date?: string;
	time?: string;
	scheduleType?: string;

	// Location
	location?: string;
	serviceAreaCenter?: string;
	serviceAreaRadius?: number;

	// Budget
	minBudget?: string;
	maxBudget?: string;

	// Order settings
	orderExpirationHours?: number;

	// Media
	images?: string[];
	video?: string;
	voice?: string;

	// Additional
	notes?: string;
}

interface SummaryPageProps {
	service: string;
}

const TRANSMISSION_LABELS: Record<string, string> = {
	automatic: "أوتوماتيك",
	manual: "عادي (مانيوال)",
};

const FUEL_TYPE_LABELS: Record<string, string> = {
	gasoline: "بنزين",
	diesel: "ديزل",
	electric: "كهرباء",
	hybrid: "هجين",
};

const SERVICE_LOCATION_LABELS: Record<string, string> = {
	home: "في المنزل",
	salon: "في الصالون",
};

export default function BookingSummaryPage({ service }: SummaryPageProps) {
	const router = useRouter();
	const [bookingData, setBookingData] = useState<BookingData | null>(null);
	const [locationAddress, setLocationAddress] = useState<string>("");
	const [serviceAreaAddress, setServiceAreaAddress] = useState<string>("");
	const [isLoadingAddress, setIsLoadingAddress] = useState(false);
	const [isLoadingServiceArea, setIsLoadingServiceArea] = useState(false);
	const [dataReady, setDataReady] = useState(false);

	const { submitOrder, isSubmitting, error: submitError } = useServiceOrderSubmit();
	const [showNotification, setShowNotification] = useState(false);
	const [authErrorRequiresLogin, setAuthErrorRequiresLogin] = useState(false);
	// Load booking data for this specific service
	useEffect(() => {
		if (typeof window !== 'undefined') {
			try {
				const savedData = ServiceStorage.loadBookingData(service);

				if (savedData) {
					// Validate required fields
					if (!savedData.categoryId || !savedData.specailizationId) {
						console.error('Missing required fields in booking data');
						alert('البيانات غير مكتملة. يرجى العودة وإكمال جميع الحقول المطلوبة.');
						router.push(`/${service}/book/details?new=true`);
						return;
					}

					setBookingData(savedData);
					setDataReady(true);
				} else {
					// No data found - redirect to start new booking
					router.push(`/${service}/book/details?new=true`);
				}
			} catch (error) {
				console.error('Error loading booking data:', error);
				router.push(`/${service}/book/details?new=true`);
			}
		}
	}, [router, service]);

	// Reverse geocode location
	useEffect(() => {
		const reverseGeocode = async (lat: number, lng: number) => {
			if (typeof google === 'undefined') return;

			setIsLoadingAddress(true);
			try {
				const geocoder = new google.maps.Geocoder();
				const response = await geocoder.geocode({
					location: { lat, lng },
					language: 'ar',
				});

				if (response.results && response.results[0]) {
					setLocationAddress(response.results[0].formatted_address);
				} else {
					setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
				}
			} catch (error) {
				console.error("Reverse geocoding error:", error);
				setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
			} finally {
				setIsLoadingAddress(false);
			}
		};

		if (bookingData?.location) {
			const [lat, lng] = bookingData.location.split(",").map(parseFloat);
			if (!isNaN(lat) && !isNaN(lng)) {
				reverseGeocode(lat, lng);
			}
		}
	}, [bookingData?.location]);

	// Reverse geocode service area center
	useEffect(() => {
		const reverseGeocode = async (lat: number, lng: number) => {
			if (typeof google === 'undefined') return;

			setIsLoadingServiceArea(true);
			try {
				const geocoder = new google.maps.Geocoder();
				const response = await geocoder.geocode({
					location: { lat, lng },
					language: 'ar',
				});

				if (response.results && response.results[0]) {
					setServiceAreaAddress(response.results[0].formatted_address);
				} else {
					setServiceAreaAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
				}
			} catch (error) {
				console.error("Service area geocoding error:", error);
				setServiceAreaAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
			} finally {
				setIsLoadingServiceArea(false);
			}
		};

		if (bookingData?.serviceAreaCenter) {
			const [lat, lng] = bookingData.serviceAreaCenter.split(",").map((s) => parseFloat(s.trim()));
			if (!isNaN(lat) && !isNaN(lng)) {
				reverseGeocode(lat, lng);
			}
		}
	}, [bookingData?.serviceAreaCenter]);

	const handleEdit = useCallback(() => {
		router.push(`/${service}/book/details`);
	}, [router, service]);

	const handleProceed = useCallback(async () => {
		// Prevent submission if bookingData is null or incomplete
		if (!bookingData || !bookingData.categoryId || !bookingData.specailizationId) {
			alert('البيانات غير مكتملة. يرجى العودة وإكمال جميع الحقول المطلوبة.');
			router.push(`/${service}/book/details?new=true`);
			return;
		}

		try {
			console.log('Submitting order with data:', bookingData);
			const response = await submitOrder(bookingData);
			console.log('Order submitted successfully:', response);

			// Prepare confirmation data with booking ID
			const confirmationData = {
				...bookingData,
				bookingId: response.orderId || response.id,
			};

			// Save to sessionStorage for confirmation page
			ServiceStorage.saveConfirmationData(service, confirmationData);

			// Clear the booking data (no longer needed)
			ServiceStorage.clearBookingData(service);

			// Navigate to confirmation
			router.push(`/${service}/book/confirmation`);
		} catch (error) {
			const err = error as Error & { status?: number; code?: string };
			const isUnauthorized = err?.status === 401;
			if (isUnauthorized) setAuthErrorRequiresLogin(true);
			setShowNotification(true);
		}
	}, [router, service, bookingData, submitOrder]);

	// Format date
	const formattedDate = useMemo(() => {
		if (!bookingData?.date) return null;
		try {
			return new Date(bookingData.date).toLocaleDateString("ar-SA", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch (error) {
			return bookingData.date;
		}
	}, [bookingData?.date]);

	// Calculate expiration date/time
	const expirationDateTime = useMemo(() => {
		if (!bookingData?.orderExpirationHours) return null;
		const now = new Date();
		const expiration = new Date(now.getTime() + bookingData.orderExpirationHours * 60 * 60 * 1000);
		return expiration.toLocaleString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}, [bookingData?.orderExpirationHours]);

	// Loading state - wait for data to be ready
	if (!dataReady || !bookingData || isSubmitting) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-white flex items-center justify-center p-4">
				<div className="text-center">
					<div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 text-sm sm:text-base">جاري التحميل...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-white rtl pb-20 sm:pb-24" dir="rtl">
			<StepperNavigation service={service} />

			<div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
				{/* Header */}
				<div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
					<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
						مراجعة الطلب قبل التأكيد
					</h1>
					<p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
						يرجى مراجعة تفاصيل الطلب قبل المتابعة
					</p>
				</div>

				{/* Summary Card */}
				<div className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
					<div className="space-y-4 sm:space-y-6">

						{/* Service Type Section */}
						{(bookingData.category || bookingData.specailization) && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										نوع الخدمة
									</h2>
								</div>

								<div className="space-y-2 sm:space-y-3 mr-10 sm:mr-12 md:mr-14">
									{bookingData.category && (
										<DetailRow label="الخدمة" value={bookingData.category} />
									)}
									{bookingData.specailization && (
										<DetailRow label="التخصص" value={bookingData.specailization} />
									)}
									{bookingData.serviceLocation && (
										<DetailRow
											label="مكان الخدمة"
											value={SERVICE_LOCATION_LABELS[bookingData.serviceLocation] || bookingData.serviceLocation}
										/>
									)}
								</div>
							</section>
						)}

						{/* Car Details Section */}
						{(bookingData.make || bookingData.model) && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<Car className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										معلومات السيارة
									</h2>
								</div>

								<div className="space-y-2 sm:space-y-3 mr-10 sm:mr-12 md:mr-14">
									{bookingData.make && (
										<DetailRow label="الماركة" value={bookingData.make} />
									)}
									{bookingData.model && (
										<DetailRow label="الموديل" value={bookingData.model} />
									)}
									{bookingData.year && (
										<DetailRow label="السنة" value={bookingData.year} />
									)}
									{bookingData.plateNumber && (
										<DetailRow label="رقم اللوحة" value={bookingData.plateNumber} />
									)}
									{bookingData.mileage && (
										<DetailRow label="عدد الكيلومترات" value={bookingData.mileage} />
									)}
									{bookingData.transmission && (
										<DetailRow
											label="نوع ناقل الحركة"
											value={TRANSMISSION_LABELS[bookingData.transmission] || bookingData.transmission}
										/>
									)}
									{bookingData.fuelType && (
										<DetailRow
											label="نوع الوقود"
											value={FUEL_TYPE_LABELS[bookingData.fuelType] || bookingData.fuelType}
										/>
									)}
									{bookingData.vinNumber && (
										<DetailRow label="رقم الشاصي (VIN)" value={bookingData.vinNumber} />
									)}
								</div>
							</section>
						)}

						{/* Problem Description */}
						{bookingData.description && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										وصف الطلب
									</h2>
								</div>
								<div className="mr-10 sm:mr-12 md:mr-14 text-right">
									<p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
										{bookingData.description}
									</p>
								</div>
							</section>
						)}

						{/* Budget Range Section */}
						{(bookingData.minBudget || bookingData.maxBudget) && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										نطاق الميزانية
									</h2>
								</div>
								<div className="mr-10 sm:mr-12 md:mr-14">
									<div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 sm:p-4">
										<p className="text-base sm:text-lg font-bold text-green-800 text-center">
											{bookingData.minBudget} - {bookingData.maxBudget} ريال
										</p>
									</div>
								</div>
							</section>
						)}

						{/* Schedule Section */}
						{(bookingData.date || bookingData.scheduleType === 'instant') && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										موعد الخدمة
									</h2>
								</div>

								<div className="space-y-2 sm:space-y-3 mr-10 sm:mr-12 md:mr-14">
									{bookingData.scheduleType === 'instant' ? (
										<div className="flex items-center gap-3">
											<span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
												النوع:
											</span>
											<span className="font-medium text-green-600 flex-1 text-right text-xs sm:text-sm">
												خدمة فورية
											</span>
										</div>
									) : (
										<>
											{formattedDate && (
												<div className="flex items-center gap-2 sm:gap-3">
													<Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
													<span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
														التاريخ:
													</span>
													<span className="font-medium text-gray-900 flex-1 text-right text-xs sm:text-sm">
														{formattedDate}
													</span>
												</div>
											)}
											{bookingData.time && (
												<div className="flex items-center gap-2 sm:gap-3">
													<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
													<span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
														الوقت:
													</span>
													<span className="font-medium text-gray-900 flex-1 text-right text-xs sm:text-sm">
														{bookingData.time}
													</span>
												</div>
											)}
										</>
									)}
								</div>
							</section>
						)}

						{/* Location Section */}
						{bookingData.location && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										الموقع
									</h2>
								</div>
								<div className="mr-10 sm:mr-12 md:mr-14 text-right">
									{isLoadingAddress ? (
										<div className="flex items-center gap-2 text-gray-500">
											<div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
											<span className="text-xs sm:text-sm">جاري تحميل العنوان...</span>
										</div>
									) : (
										<>
											<p className="font-medium text-gray-900 mb-2 text-xs sm:text-sm">
												{locationAddress || "موقع محدد"}
											</p>
											<p className="text-[10px] sm:text-xs text-gray-500 font-mono break-all">
												{bookingData.location}
											</p>
										</>
									)}
								</div>
							</section>
						)}

						{/* Service Area Section */}
						{bookingData.serviceAreaCenter && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										منطقة الخدمة
									</h2>
								</div>
								<div className="mr-10 sm:mr-12 md:mr-14 space-y-2 sm:space-y-3">
									{isLoadingServiceArea ? (
										<div className="flex items-center gap-2 text-gray-500">
											<div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
											<span className="text-xs sm:text-sm">جاري تحميل المنطقة...</span>
										</div>
									) : (
										<>
											<DetailRow
												label="المركز"
												value={serviceAreaAddress || bookingData.serviceAreaCenter}
											/>
											{bookingData.serviceAreaRadius && (
												<DetailRow
													label="نصف القطر"
													value={`${bookingData.serviceAreaRadius} كيلومتر`}
												/>
											)}
										</>
									)}
								</div>
							</section>
						)}

						{/* Order Expiration Section */}
						{bookingData.orderExpirationHours && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
										<Timer className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										وقت انتهاء الطلب
									</h2>
								</div>
								<div className="mr-10 sm:mr-12 md:mr-14">
									<div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 sm:p-4">
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-xs sm:text-sm text-orange-700">
													المدة المتاحة:
												</span>
												<span className="font-bold text-orange-900 text-xs sm:text-sm">
													{bookingData.orderExpirationHours} ساعة
												</span>
											</div>
											{expirationDateTime && (
												<div className="pt-2 border-t border-orange-200">
													<p className="text-[10px] sm:text-xs text-orange-700 text-center">
														سيتم قفل الطلب في: <span className="font-semibold">{expirationDateTime}</span>
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</section>
						)}

						{/* Media Attachments Section */}
						{(bookingData.images?.length || bookingData.video || bookingData.voice) && (
							<section className="pb-4 sm:pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										المرفقات
									</h2>
								</div>
								<div className="mr-10 sm:mr-12 md:mr-14 space-y-3 sm:space-y-4">
									{/* Images */}
									{bookingData.images && bookingData.images.length > 0 && (
										<div>
											<div className="flex items-center gap-2 mb-2 sm:mb-3">
												<ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
												<p className="text-xs sm:text-sm text-gray-600">
													الصور ({bookingData.images.length})
												</p>
											</div>
											<div className="grid grid-cols-3 gap-2 sm:gap-3">
												{bookingData.images.map((img: string, index: number) => (
													<div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-colors">
														<Image
															src={img}
															alt={`صورة ${index + 1}`}
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
											<div className="flex items-center gap-2 mb-2 sm:mb-3">
												<Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
												<p className="text-xs sm:text-sm text-gray-600">فيديو</p>
											</div>
											<div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-900">
												<video src={bookingData.video} controls className="w-full h-full object-contain" />
											</div>
										</div>
									)}

									{/* Voice Recording */}
									{bookingData.voice && (
										<div>
											<div className="flex items-center gap-2 mb-2 sm:mb-3">
												<Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
												<p className="text-xs sm:text-sm text-gray-600">تسجيل صوتي</p>
											</div>
											<div className="p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
												<audio src={bookingData.voice} controls className="w-full" />
											</div>
										</div>
									)}
								</div>
							</section>
						)}

						{/* Notes Section */}
						{bookingData.notes && (
							<section>
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
										<FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
									</div>
									<h2 className="text-lg sm:text-xl font-bold text-gray-900">
										ملاحظات إضافية
									</h2>
								</div>
								<div className="mr-10 sm:mr-12 md:mr-14 text-right">
									<p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
										{bookingData.notes}
									</p>
								</div>
							</section>
						)}
					</div>
				</div>

				{/* Info Notice */}
				<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
					<div className="flex items-start gap-2 sm:gap-3">
						<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
						<p className="text-xs sm:text-sm text-blue-800 text-right leading-relaxed">
							يرجى مراجعة جميع التفاصيل بعناية قبل التأكيد. يمكنك التعديل في أي وقت بالضغط على زر "تعديل التفاصيل"
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col gap-3 sm:gap-4">
					{/* Edit Button */}
					<button
						onClick={handleEdit}
						className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm sm:text-base"
					>
						<Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
						<span>تعديل التفاصيل</span>
					</button>

					{/* Confirm Button */}
					<button
						onClick={handleProceed}
						type="button"
						disabled={isSubmitting || !dataReady}
						className="group relative overflow-hidden w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 sm:py-4 px-6 sm:px-12 rounded-xl sm:rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
					>
						{/* Animated Background */}
						<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>

						{isSubmitting ? (
							<>
								<svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span className="relative z-10">جاري الإرسال...</span>
							</>
						) : (
							<>
								<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 animate-pulse" />
								<span className="relative z-10">تأكيد والمتابعة</span>
								<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
							</>
						)}
					</button>
				</div>
			</div>
			{submitError && (
				<NotificationDialog
					message={submitError}
					type="error"
					isVisible={showNotification}
					onClose={() => {
						setShowNotification(false);
						if (authErrorRequiresLogin) {
							setAuthErrorRequiresLogin(false);
							router.push('/login');
						}
					}}
				/>
			)}
		</div>
	);
}

// Helper component for detail rows
function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-start gap-2 sm:gap-3">
			<span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
				{label}:
			</span>
			<span className="font-medium text-gray-900 flex-1 text-right text-xs sm:text-sm break-words">
				{value}
			</span>
		</div>
	);
}