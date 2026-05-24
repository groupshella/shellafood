"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowRight, HelpCircle, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoadScript } from "@react-google-maps/api";
import { useFormValidation } from "@/shared/hooks/useFormValidation";
import { validators } from "@/shared/lib/utils";
import { ValidationRule } from "@/shared/types/validation.types";

// Import your components...
import StepperNavigation from "@/shared/components/steppernavigation/StepperNavigation";
import { FormSelect } from "@/shared/components/forms/Select/Select";
import { FormInput } from "@/shared/components/forms/FormInput/FormInput";
import { MapSection } from "@/shared/components/forms/MapSection/MapSection";
import { ServiceAreaSection } from "@/shared/components/forms/ServiceAreaSection/ServiceAreaSection";
import ImageUploadSection from "@/shared/components/forms/ImageUploadSection/ImageUploadSection";
import VoiceRecordingSection from "@/shared/components/forms/VoiceRecordingSection/VoiceRecordingSection";
import VideoUploadSection from "@/shared/components/forms/VideoUploadSection/VideoUploadSection";
import useMediaUpload from "@/shared/hooks/useMediaUpload";

import {
  TRANSMISSION_OPTIONS,
  FUEL_TYPES_OPTIONS,
  GenerateYearOptions
} from "../constants/booking.constants";
import { useCarMakes, useCarModels } from "../hooks/useCarData";
import { useCategorySpecailizations, useMainServiceCategories, useServiceOrderSubmit } from "../hooks/useServiceData";
import { ServiceStorage } from "@/shared/lib/serviceStorage";

const GOOGLE_MAPS_LIBRARIES: ("places")[] = ['places'];

export default function HomeBookingDetailsPage({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  console.log('serviceId:', serviceId);
  const service = decodeURIComponent(useSearchParams().get('title') || '');
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const {
    images,
    removeImage,
    handleImageUpload,
    video,
    handleVideoUpload,
    removeVideo,
    voice,
    recordingTime,
    audioURL,
    isRecording,
    removeVoice,
    startRecording,
    stopRecording
  } = useMediaUpload();

  // Use the service order submit hook
  const { submitOrder, isSubmitting, error: submitError } = useServiceOrderSubmit();

  // Initialize validation hook
  const { registerField, validateAndScroll } = useFormValidation({
    scrollOffset: 100,
    onValidationError: (field: string, message: string) => {
      // Optional: show toast notification
      console.log(`Validation error in ${field}: ${message}`);
    }
  });

  function getDefaultFormData() {
    return {
      categoryId: "",
      specailizationId: "",
      date: "",
      time: "",
      scheduleType: "scheduled",
      make: "",
      model: "",
      year: "",
      plateNumber: "",
      mileage: "",
      transmission: "",
      fuelType: "",
      vinNumber: "",
      description: "",
      location: "",
      serviceAreaCenter: "24.7136, 46.6753",
      serviceAreaRadius: 5,
      minBudget: "",
      maxBudget: "",
      orderExpirationHours: 24, // Default 24 hours
      notes: ""
    };
  }

  // Initialize - check if this is a new booking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isNewBooking = urlParams.get('new') === 'true';

      if (isNewBooking) {
        ServiceStorage.startNewBooking(serviceId);
      }
    }
  }, [serviceId]);

  // Form state - optimized with single state object
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = ServiceStorage.loadBookingData(serviceId);
      if (savedData) {
        console.log('Loaded existing data for service:', serviceId);
        return savedData;
      }
    }
    return getDefaultFormData();
  });

  // Auto-save when formData changes
  useEffect(() => {
    if (typeof window !== 'undefined' && formData) {
      ServiceStorage.saveBookingData(serviceId, formData);
    }
  }, [formData, serviceId]);



  const { mainServiceCategories, loading: mainServiceCategoriesLoading } = useMainServiceCategories({ serviceId: serviceId });

  const { categorySpecailizations, loading: categorySpecailizationsLoading } = useCategorySpecailizations({ categoryId: formData.categoryId });

  // Memoized form change handler - prevents recreation on each render
  const handleFormChange = useCallback((e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      // Special handling for service type change
      if (name === 'categoryId') {
        return { ...prev, [name]: value, specailizationId: "" };
      }

      return { ...prev, [name]: value };
    });
  }, []);

  // Location handlers - memoized to prevent recreation
  const handleLocationSelect = useCallback((location: string) => {
    setFormData((prev: any) => ({ ...prev, location }));
  }, []);

  const handleServiceAreaCenterChange = useCallback((center: string) => {
    setFormData((prev: any) => ({ ...prev, serviceAreaCenter: center }));
  }, []);

  const handleServiceAreaRadiusChange = useCallback((radius: number) => {
    setFormData((prev: any) => ({ ...prev, serviceAreaRadius: radius }));
  }, []);

  // Validation rules - memoized based on form state
  const validationRules = useMemo((): ValidationRule[] => [
    {
      field: 'categoryId',
      label: 'نوع الخدمة',
      validator: validators.required,
    },
    {
      field: 'specailizationId',
      label: 'التخصص',
      validator: validators.required,
    },

    {
      field: 'description',
      label: 'وصف المشكلة',
      validator: validators.required,
      message: 'يرجى كتابة وصف تفصيلي للمشكلة',
    },
    {
      field: 'date',
      label: 'التاريخ',
      validator: validators.requiredIf(formData.scheduleType === 'scheduled'),
      message: 'يرجى اختيار تاريخ الخدمة',
    },
    {
      field: 'time',
      label: 'الوقت',
      validator: validators.requiredIf(formData.scheduleType === 'scheduled'),
      message: 'يرجى اختيار وقت الخدمة',
    },
    {
      field: 'location',
      label: 'الموقع',
      validator: validators.required,
      message: 'يرجى تحديد الموقع على الخريطة',
    },
    {
      field: 'minBudget',
      label: 'الحد الأدنى (ريال)',
      validator: validators.required,
      message: 'يرجى تحديد الحد الأدنى (ريال)',
    },
    {
      field: 'maxBudget',
      label: "الحد الأقصى (ريال)",
      validator: validators.required,
      message: 'يرجى تحديد الحد الأقصى (ريال)',
    },
  ], [formData.scheduleType]);

  // Optimized submit handler with hook
  const handleNext = useCallback(async () => {
    console.log('🔵 handleNext called - Start');
    console.log('🔵 isSubmitting:', isSubmitting);
    // Validate all fields
    const result = validateAndScroll(formData, validationRules);

    if (!result.isValid) {
      return;
    }

    try {
      // Save before navigating
      ServiceStorage.saveBookingData(serviceId, formData);
      router.push(`/${serviceId}/book/summary`);
    } catch (error) {
      // Error is already handled by the hook
      console.log(error);
      console.error('Error proceeding to summary:', error);
    }
  }, [formData, validationRules, validateAndScroll, router, serviceId]);

  return (
    <div className="min-h-screen bg-white  mb-8">
      <StepperNavigation service={service} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Service Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200 -700">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900  mb-2 sm:mb-3">
            {decodeURIComponent(service)}
          </h1>
        </div>



        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">

          {/* Service Type Selection */}
          <section
            className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200  transition-all rounded-lg"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900  mb-4 sm:mb-6">
              نوع الخدمة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div ref={(el) => registerField('categoryId', el)}>
                <FormSelect
                  label="اختر الخدمة"
                  name="categoryId"
                  options={mainServiceCategories}
                  value={formData.categoryId}
                  onChange={handleFormChange}
                  required
                  disabled={mainServiceCategoriesLoading}
                  placeholder="اختر نوع الخدمة"
                />
              </div>
              {formData.categoryId && (
                <div ref={(el) => registerField('specailizationId', el)}>
                  <FormSelect
                    label="التخصص"
                    name="specailizationId"
                    options={categorySpecailizations}
                    value={formData.specailizationId}
                    onChange={handleFormChange}
                    disabled={categorySpecailizationsLoading}
                    required
                    placeholder="اختر التخصص"
                  />
                </div>
              )}
            </div>
          </section>




          {/* Description */}
          <section
            className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200 transition-all rounded-lg"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 ">
                وصف المشكلة <span className="text-red-500">*</span>
              </h2>
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div ref={(el) => registerField('description', el)}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="يرجى وصف المشكلة بالتفصيل (10 أحرف على الأقل)..."
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300  bg-white  text-gray-900 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none text-right"
                dir="rtl"
              />
            </div>
          </section>

          {/* Media Upload */}
          <section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200 ">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 ">
                المرفقات
              </h2>
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-6 sm:space-y-8">
              <ImageUploadSection
                images={images}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
              />
              <VideoUploadSection
                video={video}
                handleVideoUpload={handleVideoUpload}
                removeVideo={removeVideo}
              />
              <VoiceRecordingSection
                voice={voice}
                recordingTime={recordingTime}
                audioURL={audioURL}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                removeVoice={removeVoice}
              />
            </div>
          </section>

          {/* Schedule */}
          <section
            className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200  transition-all rounded-lg"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900  mb-4 sm:mb-6">
              موعد الخدمة
            </h2>
            <div ref={(el) => registerField('date', el)} className="space-y-4">

              {formData.scheduleType === "scheduled" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="التاريخ"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                  <div ref={(el) => registerField('time', el)}>
                    <FormInput
                      label="الوقت"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Map */}
          <section
            ref={(el) => registerField('location', el)}
            className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200  transition-all rounded-lg"
          >
            <MapSection
              title="العنوان"
              location={formData.location || ""}
              onLocationChange={handleLocationSelect}
              isLoaded={isLoaded}
              loadError={loadError}
              defaultCenter={{ lat: 24.7136, lng: 46.6753 }}
            />
          </section>

          {/* Service Area */}
          <section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200 ">
            <ServiceAreaSection
              title="منطقة الخدمة"
              center={formData.serviceAreaCenter || "24.7136, 46.6753"}
              radius={formData.serviceAreaRadius || 5}
              onCenterChange={handleServiceAreaCenterChange}
              onRadiusChange={handleServiceAreaRadiusChange}
              isLoaded={isLoaded}
              loadError={loadError}
              defaultCenter={{ lat: 24.7136, lng: 46.6753 }}
            />
          </section>

          {/* Budget Range */}
          <section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200  transition-all rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 ">
                نطاق الميزانية
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="عرض التلميح"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-blue-50  border border-blue-200  rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800  text-right" dir="rtl">
                💡 حدد نطاق الميزانية المتوقع للخدمة. سيساعد هذا المقدمين على تقديم عروض مناسبة.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormInput
                label="الحد الأدنى (ريال)"
                name="minBudget"
                type="number"
                value={formData.minBudget}
                onChange={(handleFormChange)}
                placeholder="مثال: 100"
                required={true}
              />
              <FormInput
                label="الحد الأقصى (ريال)"
                name="maxBudget"
                type="number"
                value={formData.maxBudget}
                onChange={handleFormChange}
                placeholder="مثال: 1000"
                required={true} />

            </div>
            {formData.minBudget && formData.maxBudget && (
              <div className="mt-4 p-4 bg-green-50  border border-green-200  rounded-lg">
                <p className="text-sm text-green-800  text-right" dir="rtl">
                  ✓ نطاق الميزانية: {formData.minBudget} - {formData.maxBudget} ريال
                </p>
              </div>
            )}
          </section>

          {/* Order Expiration Time */}
          <section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200  transition-all rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 ">
                وقت انتهاء الطلب
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="عرض التلميح"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-orange-50  border border-orange-200  rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-800  text-right" dir="rtl">
                ⏰ حدد المدة الزمنية المتاحة للمقدمين لتقديم العروض. بعد انتهاء الوقت سيتم قفل الطلب تلقائياً.
              </p>
            </div>
            <div className="space-y-4">
              {/* Quick Selection Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-3 text-right" dir="rtl">
                  خيارات سريعة
                </label>
                <div className="flex flex-wrap gap-2">
                  {[6, 12, 24, 48, 72].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => {
                        setFormData((prev: any) => ({ ...prev, orderExpirationHours: hours }));
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.orderExpirationHours === hours
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100  text-gray-700  hover:bg-gray-200 '
                        }`}
                    >
                      {hours} ساعة
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hours Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2 text-right" dir="rtl">
                  أو حدد عدد الساعات مخصص
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="168"
                    value={formData.orderExpirationHours || 24}
                    onChange={(e) => {
                      setFormData((prev: any) => ({ ...prev, orderExpirationHours: parseInt(e.target.value) }));
                    }}
                    className="flex-1 h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <FormInput
                      label=""
                      name="orderExpirationHours"
                      type="number"
                      value={formData.orderExpirationHours || 24}
                      onChange={handleFormChange}
                      placeholder="24"
                      className="w-20"
                      isArabic={false}
                    />
                    <span className="text-sm font-medium text-gray-700  whitespace-nowrap">
                      ساعة
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right" dir="rtl">
                  الحد الأدنى: 1 ساعة | الحد الأقصى: 168 ساعة (7 أيام)
                </p>
              </div>

              {/* Display Calculated Expiration Time */}
              {formData.orderExpirationHours && (
                <div className="mt-4 p-4 bg-green-50  border border-green-200  rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-green-600 " />
                    <p className="text-sm font-semibold text-green-800 0">
                      سيتم قفل الطلب في:
                    </p>
                  </div>
                  <p className="text-sm text-green-700 text-right" dir="rtl">
                    {(() => {
                      const expirationDate = new Date();
                      expirationDate.setHours(expirationDate.getHours() + (formData.orderExpirationHours || 24));
                      return expirationDate.toLocaleString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    })()}
                  </p>
                  <p className="text-xs text-green-600  mt-1 text-right" dir="rtl">
                    ({formData.orderExpirationHours} ساعة من الآن)
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              ملاحظات إضافية
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="أضف أي ملاحظات أو تعليمات إضافية..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300  bg-white  text-gray-900  rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none text-right"
              dir="rtl"
            />
          </section>

          {/* Submit Button */}
          <div className="p-6 sm:pt-8 flex justify-center">
            <button
              onClick={handleNext}
              type="button"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 active:bg-green-700 text-white py-4 px-8 sm:px-10 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex-row-reverse disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm sm:text-base">جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">تأكيد والمتابعة</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}