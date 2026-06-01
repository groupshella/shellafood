"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/providers";
import { useBooking, BookingData } from "@/providers";
import StepperNavigation from "../BookingSteps/StepperNavigation/StepperNavigation";
import { AddEditAddressModal } from "@/features/profile";
import DescriptionTooltipModal from "../Modals/DescriptionTooltipModal";
import AttachmentGuidelinesModal from "../Modals/AttachmentGuidelinesModal";
import { ArrowRight, Upload, X, HelpCircle, Image as ImageIcon, Video, Mic } from "lucide-react";
import { getIndividualService } from "@/lib/data/serve-me/services";
import { BookingAddress, BookingServiceType } from "../../types/serve-me.types";
import { TIME_SLOTS, MEDIA_LIMITS, DEFAULT_LOCATION, FUEL_TYPES_OPTIONS, CAR_MAKES_OPTIONS, TRANSMISSION_OPTIONS } from "../../constants/serve-me.constants";
import { validateVideoType, validateVideoSize, validateVideoDuration, formatTime } from "../../lib/utils/validation";
import { FormInput, FormSelect } from "@/shared/components/forms";
import useBookingDetails from "@/features/(services)/serve-me/hooks/useBookingDetails";
import useAddress from "@/features/(services)/serve-me/hooks/useAddress";
import ServiceHeaderForm from "./Shared/ServiceHeaderForm";
import ProblemDescriptionSection from "./Shared/ProblemDescriptionSection";
import MediaUploadSection from "./Shared/MediaUploadSection";
import ScheduleSection from "@/shared/components/forms/ScheduleSection/ScheduleSection";
import NotesSection from "./Shared/NotesSection";
import { GenerateYearOptions } from "../../lib/utils/service";

import { Address } from "@/shared/hooks";

export default function CarMaintenanceDetailsForm({ service, serviceType }: { service: string; serviceType: string }) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { bookingData, updateBooking } = useBooking();
	const { handleSaveAddress, handleAddAddress, handleAddressSelect, handleCloseAddressModal, selectedAddress, addresses, isAddressModalOpen, setAddresses, editingAddress } = useAddress();
	const { recordingTime, removeImage, removeVideo, removeVoice, isRecording, voice, video, images, startRecording, stopRecording, handleImageUpload, handleVideoUpload, audioURL } = useBookingDetails();
	// 	// Unified form state
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

	// Refs


	// Memoized service data
	const serviceData = useMemo(() => getIndividualService(service, serviceType), [service, serviceType]);
	const serviceName = useMemo(() =>
		isArabic ? serviceData?.titleAr || "" : serviceData?.titleEn || "",
		[isArabic, serviceData]
	);
	const description = useMemo(() => isArabic ? serviceData?.descriptionAr || "" : serviceData?.descriptionEn || "",
		[isArabic, serviceData]);
	// // Initialize booking data
	useEffect(() => {
		if (serviceData) {
			updateBooking({
				serviceId: serviceType,
				serviceName: serviceData.titleEn,
				serviceNameAr: serviceData.titleAr,
				unitPrice: serviceData.priceStartsFrom,
			});
		}
	}, [service, serviceType, serviceData, updateBooking]);

	// // Mock addresses - in real app, fetch from API
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


	// // Unified change handler for all form fields
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
	const carMakes = useMemo(() =>
		isArabic ? CAR_MAKES_OPTIONS.ar : CAR_MAKES_OPTIONS.en, [isArabic]);



	const fuelTypeOptions = useMemo(() =>
		isArabic ? FUEL_TYPES_OPTIONS.ar : FUEL_TYPES_OPTIONS.en
		, [isArabic]);
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
				<ServiceHeaderForm serviceName={serviceName} description={description} />

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
								options={GenerateYearOptions()}
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
								options={TRANSMISSION_OPTIONS[isArabic ? "ar" : "en"]}
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
					<ProblemDescriptionSection
						placeholder={isArabic ? "يرجى وصف المشكلة أو ما تحتاج إلى إصلاحه..." : "Please describe your problem or what needs to be fixed..."}
						title={isArabic ? "وصف المشكلة" : "Describe the Issue"}
						description={description}
						handleInputChange={handleInputChange} />

					{/* Media Upload Section */}
					<MediaUploadSection isArabic={isArabic} handleImageUpload={handleImageUpload} handleVideoUpload={handleVideoUpload} audioURL={audioURL} images={images} video={video} voice={voice} recordingTime={recordingTime}
						removeImage={removeImage} removeVideo={removeVideo} removeVoice={removeVoice} isRecording={isRecording} startRecording={startRecording} stopRecording={stopRecording} />

					{/*  Service Type */}
					<ScheduleSection isArabic={isArabic} date={formData.date} time={formData.time} serviceType={formData.serviceType} handleDateSelect={handleInputChange} handleServiceTypeChange={handleServiceTypeChange} handleTimeSelect={handleTimeSelect} />


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
										className={`p-4 rounded-lg border-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${selectedAddress?.id === address.id
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
													className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedAddress?.id === address.id
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
					<NotesSection
						placeholder={isArabic ? "أضف أي ملاحظات أو تعليمات إضافية..." : "Add any additional notes or instructions..."} notes={formData.notes} handleNotesInputChange={handleInputChange} isArabic={isArabic} />

					{/* Confirm Button */}
					<div className="pt-6 sm:pt-8 flex justify-center">
						<button
							onClick={handleNext}
							disabled={!canProceed}
							className={`w-full sm:w-auto bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-8 sm:px-10 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${isArabic ? "flex-row-reverse" : ""
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
				editingAddress={editingAddress as Address | null}
				isLoading={false}
			/>

		</div>
	);
}
