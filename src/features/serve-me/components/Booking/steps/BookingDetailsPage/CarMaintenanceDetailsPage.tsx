"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/providers";
import { useBooking, BookingData } from "@/providers";
import StepperNavigation from "../../StepperNavigation";
import { AddEditAddressModal } from "@/features/profile";
import DescriptionTooltipModal from "../../modals/DescriptionTooltipModal";
import AttachmentGuidelinesModal from "../../modals/AttachmentGuidelinesModal";
import {  ArrowRight, Upload, X, HelpCircle, Image as ImageIcon, Video, Mic } from "lucide-react";
import { getIndividualService } from "@/lib/data/services";
import { BookingAddress, BookingServiceType } from "../../../../types/serve-me.types";
import { TIME_SLOTS, MEDIA_LIMITS, DEFAULT_LOCATION } from "../../../../constants/serve-me.constants";
import { validateVideoType, validateVideoSize, validateVideoDuration, formatTime } from "../../../../lib/utils/validation";
import { FormInput, FormSelect } from "@/shared/components/forms";
import useBookingDetails from "@/features/serve-me/hooks/useBookingDetails";
import useAddress from "@/features/serve-me/hooks/useAddress";

export default function CarMaintenanceDetailsPage({ service, serviceType }: { service: string; serviceType: string }) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { bookingData, updateBooking } = useBooking();
	const {handleSaveAddress,handleAddAddress,handleAddressSelect,handleCloseAddressModal,selectedAddress,addresses,isAddressModalOpen,setAddresses,editingAddress}=useAddress();
const {recordingTime,removeImage,removeVideo,removeVoice,isRecording,voice,video,images,startRecording,stopRecording,handleImageUpload,handleVideoUpload,audioURL}=useBookingDetails();
	// Unified form state
	const [formData, setFormData] = useState({
		date: bookingData?.date || "",
		time: bookingData?.time || "",
		serviceType: (bookingData?.serviceType || "scheduled") as BookingServiceType,
		description: bookingData?.description || "",
		notes: bookingData?.notes || "",
		carInfo: {
			make: bookingData?.carInfo?.make || "",
			model: bookingData?.carInfo?.model || "",
			year: bookingData?.carInfo?.year || "",
			plateNumber: bookingData?.carInfo?.plateNumber || "",
			mileage: bookingData?.carInfo?.mileage || "",
			transmission: bookingData?.carInfo?.transmission || "",
			fuelType: bookingData?.carInfo?.fuelType || "",
			vinNumber: bookingData?.carInfo?.vinNumber || "",
		},
	});

	const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false);
	const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
	// Refs
	const imageInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	// Memoized service data
	const serviceData = useMemo(() => getIndividualService(service, serviceType), [service, serviceType]);
	const serviceName = useMemo(() => 
		isArabic ? serviceData?.titleAr || "" : serviceData?.titleEn || "",
		[isArabic, serviceData]
	);

	

	// Initialize booking data
	useEffect(() => {
		if (serviceData) {
			updateBooking({
				serviceId: `${service}-${serviceType}`,
				serviceName: serviceData.titleEn,
				serviceNameAr: serviceData.titleAr,
				unitPrice: serviceData.priceStartsFrom,
			});
		}
	}, [service, serviceType, serviceData, updateBooking]);

	// Mock addresses - in real app, fetch from API
	useEffect(() => {
		setAddresses([
			{
				id: "1",
				type: "home",
				title: isArabic ? "المنزل" : "Home",
				address: "123 Main Street",
				details: "Building 5, Floor 2, Apartment 201",
				phone: "+966501234567",
				isDefault: true,
				coordinates: DEFAULT_LOCATION,
			},
		]);
	}, [isArabic]);


	// Unified change handler for all form fields
	const handleFormChange = useCallback((field: string, value: any) => {
		setFormData((prev) => {
			const newData = { ...prev };
			
			if (field.startsWith('carInfo.')) {
				const carField = field.split('.')[1];
				newData.carInfo = { ...newData.carInfo, [carField]: value };
				// Reset model when make changes
				if (carField === 'make') {
					newData.carInfo.model = "";
				}
				// Update booking context with complete carInfo
				updateBooking({
					carInfo: {
						...newData.carInfo,
						plateNumber: newData.carInfo.plateNumber || undefined,
						vinNumber: newData.carInfo.vinNumber || undefined,
					},
				});
			} else {
				(newData as any)[field] = value;
				// Update booking context
				updateBooking({ [field]: value });
			}
			
			return newData;
		});
	}, [updateBooking]);

	// Handlers with useCallback for performance
	const handleServiceTypeChange = useCallback((type: BookingServiceType) => {
		handleFormChange('serviceType', type);
		if (type === "instant") {
			handleFormChange('date', "");
			handleFormChange('time', "");
			updateBooking({ date: null, time: null });
		}
	}, [handleFormChange, updateBooking]);



	const handleNext = useCallback(() => {
		if (!formData.description.trim()) {
			alert(isArabic ? "يرجى وصف المشكلة" : "Please describe the problem");
			return;
		}
		if (!formData.carInfo.make.trim()) {
			alert(isArabic ? "يرجى اختيار ماركة السيارة" : "Please select car make");
			return;
		}
		if (!formData.carInfo.model.trim()) {
			alert(isArabic ? "يرجى إدخال موديل السيارة" : "Please enter car model");
			return;
		}
		if (!formData.carInfo.year) {
			alert(isArabic ? "يرجى اختيار سنة السيارة" : "Please select car year");
			return;
		}
		if (!formData.carInfo.mileage.trim()) {
			alert(isArabic ? "يرجى إدخال عدد الكيلومترات" : "Please enter car mileage");
			return;
		}
		if (!formData.carInfo.transmission) {
			alert(isArabic ? "يرجى اختيار نوع ناقل الحركة" : "Please select transmission type");
			return;
		}
		if (!formData.carInfo.fuelType) {
			alert(isArabic ? "يرجى اختيار نوع الوقود" : "Please select fuel type");
			return;
		}
		if (formData.serviceType === "scheduled" && (!formData.date || !formData.time)) {
			alert(isArabic ? "يرجى اختيار التاريخ والوقت" : "Please select date and time");
			return;
		}
		if (!selectedAddress) {
			alert(isArabic ? "يرجى اختيار العنوان" : "Please select an address");
			return;
		}

		updateBooking({
			description: formData.description,
			date: formData.date || null,
			time: formData.time || null,
			serviceType: formData.serviceType,
			notes: formData.notes,
			address: selectedAddress,
			carInfo: {
				make: formData.carInfo.make,
				model: formData.carInfo.model,
				year: formData.carInfo.year,
				plateNumber: formData.carInfo.plateNumber || undefined,
				mileage: formData.carInfo.mileage,
				transmission: formData.carInfo.transmission,
				fuelType: formData.carInfo.fuelType,
				vinNumber: formData.carInfo.vinNumber || undefined,
			},
		});

		// Prefetch summary page for instant navigation
		const summaryPath = `/serve-me/${service}/${serviceType}/book/summary`;
		router.prefetch(summaryPath);
		router.push(summaryPath);
	}, [formData, selectedAddress, updateBooking, service, serviceType, router, isArabic]);



	// Wrapper handlers for form inputs (text/textarea)
	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		handleFormChange(name, value);
	}, [handleFormChange]);

	// Special handler for time selection (button click)
	const handleTimeSelect = useCallback((time: string) => {
		handleFormChange('time', time);
	}, [handleFormChange]);

	// Memoized formatted recording time
	const formattedRecordingTime = useMemo(() => formatTime(recordingTime), [recordingTime]);

	// Car makes and models data - memoized
	const carMakes = useMemo(() => [
		{ value: "toyota", label: isArabic ? "تويوتا" : "Toyota" },
		{ value: "hyundai", label: isArabic ? "هيونداي" : "Hyundai" },
		{ value: "ford", label: isArabic ? "فورد" : "Ford" },
		{ value: "chevrolet", label: isArabic ? "شيفروليه" : "Chevrolet" },
		{ value: "nissan", label: isArabic ? "نيسان" : "Nissan" },
		{ value: "honda", label: isArabic ? "هوندا" : "Honda" },
		{ value: "kia", label: isArabic ? "كيا" : "Kia" },
		{ value: "mitsubishi", label: isArabic ? "ميتسوبيشي" : "Mitsubishi" },
		{ value: "mercedes", label: isArabic ? "مرسيدس" : "Mercedes-Benz" },
		{ value: "bmw", label: isArabic ? "بي إم دبليو" : "BMW" },
		{ value: "audi", label: isArabic ? "أودي" : "Audi" },
		{ value: "volkswagen", label: isArabic ? "فولكس واجن" : "Volkswagen" },
		{ value: "mazda", label: isArabic ? "مازدا" : "Mazda" },
		{ value: "lexus", label: isArabic ? "لكزس" : "Lexus" },
		{ value: "infiniti", label: isArabic ? "إنفينيتي" : "Infiniti" },
		{ value: "other", label: isArabic ? "أخرى" : "Other" },
	], [isArabic]);

	const transmissionOptions = useMemo(() => [
		{ value: "automatic", label: isArabic ? "أوتوماتيك" : "Automatic" },
		{ value: "manual", label: isArabic ? "يدوي" : "Manual" },
	], [isArabic]);

	const fuelTypeOptions = useMemo(() => [
		{ value: "gasoline", label: isArabic ? "بنزين" : "Gasoline" },
		{ value: "diesel", label: isArabic ? "ديزل" : "Diesel" },
		{ value: "hybrid", label: isArabic ? "هجين" : "Hybrid" },
		{ value: "electric", label: isArabic ? "كهربائي" : "Electric" },
	], [isArabic]);

	// Generate year options (current year - 50 years to current year + 1)
	const yearOptions = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return Array.from({ length: 51 }, (_, i) => {
			const year = currentYear - i + 1;
			return { value: year.toString(), label: year.toString() };
		});
	}, []);


	// Memoized validation states
	const canProceed = useMemo(() => {
		return formData.description.trim() !== '' && 
			   (formData.serviceType === "instant" || (formData.date && formData.time)) &&
			   selectedAddress !== null &&
			   formData.carInfo.make.trim() !== '' &&
			   formData.carInfo.model.trim() !== '' &&
			   formData.carInfo.year !== '' &&
			   formData.carInfo.mileage.trim() !== '' &&
			   formData.carInfo.transmission !== '' &&
			   formData.carInfo.fuelType !== '';
	}, [formData, selectedAddress]);

	if (!serviceData) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-gray-600 dark:text-gray-400">{isArabic ? "الخدمة غير موجودة" : "Service not found"}</p>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-white dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<StepperNavigation service={service} serviceType={serviceType} />

			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				{/* Service Header */}
				<div className="mb-6 sm:mb-8 lg:mb-12 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200 dark:border-gray-700">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
						{serviceName}
					</h1>
					<p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
						{isArabic ? serviceData.descriptionAr : serviceData.descriptionEn}
					</p>
				</div>

				<div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
					{/* Car Information Section */}
					<section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
							{isArabic ? "معلومات السيارة" : "Car Information"}
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
							<FormSelect
								label={isArabic ? "الماركة" : "Car Make"}
								name="carInfo.make"
								options={carMakes}
								value={formData.carInfo.make}
								onChange={handleInputChange}
								required
								isArabic={isArabic}
								placeholder={isArabic ? "اختر الماركة" : "Select Make"}
							/>
							<FormInput
								label={isArabic ? "الموديل" : "Car Model"}
								name="carInfo.model"
								type="text"
								value={formData.carInfo.model}
								onChange={handleInputChange}
								placeholder={isArabic ? "مثال: كامري، توسان" : "e.g., Camry, Tucson"}
								required
								isArabic={isArabic}
							/>
							<FormSelect
								label={isArabic ? "السنة" : "Year"}
								name="carInfo.year"
								options={yearOptions}
								value={formData.carInfo.year}
								onChange={handleInputChange}
								required
								isArabic={isArabic}
								placeholder={isArabic ? "اختر السنة" : "Select Year"}
							/>
							<FormInput
								label={isArabic ? "رقم اللوحة" : "Plate Number"}
								name="carInfo.plateNumber"
								type="text"
								value={formData.carInfo.plateNumber}
								onChange={handleInputChange}
								placeholder={isArabic ? "اختياري" : "Optional"}
								isArabic={isArabic}
							/>
							<FormInput
								label={isArabic ? "عدد الكيلومترات" : "Mileage (km)"}
								name="carInfo.mileage"
								type="number"
								value={formData.carInfo.mileage}
								onChange={handleInputChange}
								placeholder={isArabic ? "مثال: 50000" : "e.g., 50000"}
								required
								isArabic={isArabic}
							/>
							<FormSelect
								label={isArabic ? "نوع ناقل الحركة" : "Transmission Type"}
								name="carInfo.transmission"
								options={transmissionOptions}
								value={formData.carInfo.transmission}
								onChange={handleInputChange}
								required
								isArabic={isArabic}
								placeholder={isArabic ? "اختر النوع" : "Select Type"}
							/>
							<FormSelect
								label={isArabic ? "نوع الوقود" : "Fuel Type"}
								name="carInfo.fuelType"
								options={fuelTypeOptions}
								value={formData.carInfo.fuelType}
								onChange={handleInputChange}
								required
								isArabic={isArabic}
								placeholder={isArabic ? "اختر النوع" : "Select Type"}
							/>
							<FormInput
								label={isArabic ? "رقم الشاصي (VIN)" : "VIN Number"}
								name="carInfo.vinNumber"
								type="text"
								value={formData.carInfo.vinNumber}
								onChange={handleInputChange}
								placeholder={isArabic ? "اختياري لكن مفيد" : "Optional but useful"}
								isArabic={isArabic}
							/>
						</div>
					</section>

					{/* Problem Description Section */}
					<section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "وصف المشكلة" : "Describe the Issue"}
							</h2>
							<div className="relative flex-shrink-0">
								<button
									type="button"
									onClick={() => setShowDescriptionTooltip(true)}
									className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 active:text-gray-600 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 rounded-full p-1"
									aria-label={isArabic ? "عرض التلميح" : "Show hint"}
								>
									<HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
								</button>
							</div>
						</div>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder={isArabic ? "يرجى وصف المشكلة أو ما تحتاج إلى إصلاحه..." : "Please describe your problem or what needs to be fixed..."}
							rows={5}
							required
							className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-0 focus:outline-none resize-none text-sm sm:text-base transition-all touch-manipulation placeholder-gray-400 dark:placeholder-gray-500 ${
								isArabic ? "text-right" : "text-left"
							}`}
							dir={isArabic ? "rtl" : "ltr"}
						/>
					</section>

					{/* Media Upload Section */}
					<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
						<div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "المرفقات" : "Attachments"}
							</h2>
							<button
								type="button"
								onClick={() => setShowGuidelinesModal(true)}
								className="text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 active:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 rounded-full p-1 touch-manipulation flex-shrink-0"
								aria-label={isArabic ? "عرض إرشادات المرفقات" : "Show attachment guidelines"}
							>
								<HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						</div>
						
						<div className="space-y-6 sm:space-y-8 lg:space-y-10">
							{/* Images Section */}
							<div className="border-b border-gray-100 dark:border-gray-700 pb-6 sm:pb-8">
								<div className="flex items-center gap-2 mb-3 sm:mb-4">
									<ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
									<label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
										{isArabic ? "الصور" : "Images"} ({images.length}/{MEDIA_LIMITS.MAX_IMAGES})
									</label>
								</div>
								<input
									ref={imageInputRef}
									type="file"
									accept="image/*"
									multiple
									onChange={handleImageUpload}
									className="hidden"
									aria-label={isArabic ? "رفع صور" : "Upload images"}
								/>
								{images.length === 0 ? (
									<button
										type="button"
										onClick={() => imageInputRef.current?.click()}
										className="w-full p-6 sm:p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 touch-manipulation"
										aria-label={isArabic ? "رفع صور" : "Upload images"}
									>
										<ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
										<span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
											{isArabic ? "رفع صور" : "Upload Images"}
										</span>
									</button>
								) : (
									<div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
										{images.map((img, index) => (
											<div key={index} className="relative group">
												<div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
													<Image
														src={img}
														alt={`Upload ${index + 1}`}
														fill
														className="object-cover"
														loading="lazy"
													/>
												</div>
												<button
													type="button"
													onClick={() => removeImage(index)}
													className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 active:bg-red-600 touch-manipulation"
													aria-label={isArabic ? `حذف الصورة ${index + 1}` : `Remove image ${index + 1}`}
												>
													<X className="w-3 h-3 sm:w-4 sm:h-4" />
												</button>
											</div>
										))}
										{images.length < MEDIA_LIMITS.MAX_IMAGES && (
											<button
												type="button"
												onClick={() => imageInputRef.current?.click()}
												className="aspect-square rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex items-center justify-center touch-manipulation"
												aria-label={isArabic ? "إضافة صور إضافية" : "Add more images"}
											>
												<Upload className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400" />
											</button>
										)}
									</div>
								)}
							</div>

							{/* Video Section */}
							<div className="border-b border-gray-100 dark:border-gray-700 pb-6 sm:pb-8">
								<div className="flex items-center gap-2 mb-3 sm:mb-4">
									<Video className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
									<label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
										{isArabic ? "فيديو" : "Video"} <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">{isArabic ? `(حد أقصى ${MEDIA_LIMITS.MAX_VIDEO_DURATION} ثانية)` : `(max ${MEDIA_LIMITS.MAX_VIDEO_DURATION} seconds)`}</span>
									</label>
								</div>
								<input
									ref={videoInputRef}
									type="file"
									accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
									onChange={handleVideoUpload}
									className="hidden"
									aria-label={isArabic ? "رفع فيديو" : "Upload video"}
								/>
								{video ? (
									<div className="relative rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
										<div className="relative aspect-video bg-gray-900">
											<video src={video} controls className="w-full h-full object-contain" />
										</div>
										<button
											type="button"
											onClick={removeVideo}
											className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 active:bg-red-600 transition-colors touch-manipulation"
											aria-label={isArabic ? "حذف الفيديو" : "Remove video"}
										>
											<X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={() => videoInputRef.current?.click()}
										className="w-full p-6 sm:p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 touch-manipulation"
										aria-label={isArabic ? "رفع فيديو" : "Upload video"}
									>
										<Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
										<span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
											{isArabic ? "رفع فيديو" : "Upload Video"}
										</span>
										<span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-2">
											{isArabic ? `MP4, MOV, أو WEBM - حد أقصى ${MEDIA_LIMITS.MAX_VIDEO_DURATION} ثانية و 50 ميجابايت` : `MP4, MOV, or WEBM - max ${MEDIA_LIMITS.MAX_VIDEO_DURATION} seconds and 50MB`}
										</span>
									</button>
								)}
							</div>

							{/* Voice Recording Section */}
							<div>
								<div className="flex items-center gap-2 mb-3 sm:mb-4">
									<Mic className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
									<label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
										{isArabic ? "تسجيل صوتي" : "Voice Recording"}
									</label>
								</div>
								{voice && audioURL ? (
									<div className="space-y-3 sm:space-y-4">
										<div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
											<audio ref={audioRef} src={audioURL} controls className="w-full" />
										</div>
										<button
											type="button"
											onClick={removeVoice}
											className="flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 active:text-red-700 transition-colors touch-manipulation"
											aria-label={isArabic ? "حذف التسجيل الصوتي" : "Delete voice recording"}
										>
											<X className="w-4 h-4" />
											<span className="text-xs sm:text-sm font-medium">
												{isArabic ? "حذف التسجيل" : "Delete Recording"}
											</span>
										</button>
									</div>
								) : (
									<div className="space-y-3 sm:space-y-4">
										<button
											type="button"
											onClick={isRecording ? stopRecording : startRecording}
											className={`w-full p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all flex items-center justify-center gap-2 sm:gap-3 touch-manipulation ${
												isRecording
													? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 active:bg-red-100 animate-pulse"
													: "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50"
											}`}
											aria-label={isRecording 
												? (isArabic ? "إيقاف التسجيل" : "Stop recording")
												: (isArabic ? "بدء التسجيل" : "Start recording")
											}
										>
											<div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
												isRecording ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
											}`}>
												<Mic className="w-4 h-4 sm:w-5 sm:h-5" />
											</div>
											<span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
												{isRecording 
													? (isArabic ? "إيقاف التسجيل" : "Stop Recording") 
													: (isArabic ? "بدء التسجيل" : "Start Recording")
												}
											</span>
											{isRecording && (
												<span className="text-xs sm:text-sm font-mono text-red-600 dark:text-red-400">
													{formattedRecordingTime}
												</span>
											)}
										</button>
									</div>
								)}
							</div>
						</div>
					</section>

					{/* Service Type */}
					<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
							{isArabic ? "نوع الخدمة" : "Service Type"}
						</h2>
						<div className="grid grid-cols-2 gap-3 sm:gap-4">
							<button
								type="button"
								onClick={() => handleServiceTypeChange("instant")}
								className={`p-4 rounded-lg border-2 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
									formData.serviceType === "instant"
										? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
										: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
								}`}
							>
								<span className="text-sm sm:text-base">{isArabic ? "فوري" : "Instant"}</span>
							</button>
							<button
								type="button"
								onClick={() => handleServiceTypeChange("scheduled")}
								className={`p-4 rounded-lg border-2 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
									formData.serviceType === "scheduled"
										? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
										: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
								}`}
							>
								<span className="text-sm sm:text-base">{isArabic ? "مجدول" : "Scheduled"}</span>
							</button>
						</div>
					</section>

					{/* Date & Time (only for scheduled) */}
					{formData.serviceType === "scheduled" && (
						<>
							<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
								<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
									{isArabic ? "التاريخ والوقت" : "Date & Time"}
								</h2>
								<div className="space-y-4 sm:space-y-6">
									<div>
										<label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
											{isArabic ? "التاريخ" : "Date"}
										</label>
										<input
											type="date"
											name="date"
											value={formData.date}
											onChange={handleInputChange}
											min={new Date().toISOString().split("T")[0]}
											className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-2 focus:outline-none transition-all text-base touch-manipulation"
										/>
									</div>
									<div>
										<label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
											{isArabic ? "الوقت" : "Time"}
										</label>
										<div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3">
											{TIME_SLOTS.map((time) => (
												<button
													key={time}
													type="button"
													onClick={() => handleTimeSelect(time)}
													className={`py-3 px-4 rounded-lg border-2 transition-all text-sm touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
														formData.time === time
															? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
															: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
													}`}
												>
													{time}
												</button>
											))}
										</div>
									</div>
								</div>
							</section>
						</>
					)}

					{/* Address Selection */}
					<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "العنوان" : "Address"}
							</h2>
							<button
								type="button"
								onClick={handleAddAddress}
								className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 transition-all text-sm font-medium touch-manipulation self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2"
							>
								{isArabic ? "+ إضافة عنوان" : "+ Add Address"}
							</button>
						</div>
						<div className="space-y-3">
							{addresses.length === 0 ? (
								<div className="text-center py-8 text-gray-500 dark:text-gray-400">
									<p className="mb-4">{isArabic ? "لا توجد عناوين متاحة" : "No addresses available"}</p>
									<button
										type="button"
										onClick={handleAddAddress}
										className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2"
									>
										{isArabic ? "إضافة عنوان جديد" : "Add New Address"}
									</button>
								</div>
							) : (
								addresses.map((address) => (
									<div
										key={address.id}
										onClick={() => handleAddressSelect(address)}
										className={`p-4 rounded-lg border-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
											selectedAddress?.id === address.id
												? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
												: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
										}`}
									>
										<div className="flex items-start gap-3">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{address.title}</h3>
													{address.isDefault && (
														<span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium">
															{isArabic ? "افتراضي" : "Default"}
														</span>
													)}
												</div>
												<p className="text-sm text-gray-600 dark:text-gray-400">{address.address}</p>
												{address.details && (
													<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{address.details}</p>
												)}
											</div>
											<div className={`flex-shrink-0 ${isArabic ? "mr-2" : "ml-2"}`}>
												<div
													className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
														selectedAddress?.id === address.id
															? "border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500"
															: "border-gray-300 dark:border-gray-600"
													}`}
												>
													{selectedAddress?.id === address.id && (
														<div className="w-2.5 h-2.5 rounded-full bg-white"></div>
													)}
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</section>

					{/* Notes */}
					<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
							{isArabic ? "ملاحظات إضافية" : "Additional Notes"}
						</h2>
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleInputChange}
							placeholder={isArabic ? "أضف أي ملاحظات أو تعليمات إضافية..." : "Add any additional notes or instructions..."}
							rows={4}
							className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-0 focus:outline-none resize-none text-sm sm:text-base transition-all touch-manipulation placeholder-gray-400 dark:placeholder-gray-500 ${
								isArabic ? "text-right" : "text-left"
							}`}
							dir={isArabic ? "rtl" : "ltr"}
						/>
					</section>

					{/* Confirm Button */}
					<div className="pt-6 sm:pt-8 flex justify-center">
						<button
							onClick={handleNext}
							disabled={!canProceed}
							className={`w-full sm:w-auto bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-8 sm:px-10 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
								isArabic ? "flex-row-reverse" : ""
							}`}
						>
							<span className="text-sm sm:text-base">{isArabic ? "تأكيد والمتابعة" : "Confirm & Continue"}</span>
							<ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isArabic ? "rotate-180" : ""}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Address Modal */}
			<AddEditAddressModal
				isOpen={isAddressModalOpen}
				onClose={handleCloseAddressModal}
				onSave={handleSaveAddress}
				editingAddress={editingAddress}
			/>

			{/* Modals */}
			<DescriptionTooltipModal
				isOpen={showDescriptionTooltip}
				onClose={() => setShowDescriptionTooltip(false)}
				isArabic={isArabic}
			/>

			<AttachmentGuidelinesModal
				isOpen={showGuidelinesModal}
				onClose={() => setShowGuidelinesModal(false)}
				isArabic={isArabic}
			/>
		</div>
	);
}
