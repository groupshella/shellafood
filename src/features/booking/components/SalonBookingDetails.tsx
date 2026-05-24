"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  ArrowRight,
  HelpCircle,
  Clock,
  Sparkles,
  Home,
  Store,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Video,
  Mic,
  DollarSign,

  MessageSquare,
  Heart,
  Star
} from "lucide-react";
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
import { useCategorySpecailizations, useMainServiceCategories, useServiceOrderSubmit } from "../hooks/useServiceData";
import { ServiceStorage } from "@/shared/lib/serviceStorage";

const GOOGLE_MAPS_LIBRARIES: ("places")[] = ['places'];

// Service Location Options
const SERVICE_LOCATION_OPTIONS = [
  {
    value: "home",
    label: "في المنزل",
    icon: Home,
    description: "الخدمة تأتي إليك",
    color: "pink"
  },
  {
    value: "salon",
    label: "في الصالون",
    icon: Store,
    description: "زيارة المركز",
    color: "purple"
  }
];

export default function HomeBookingDetailsPage({ serviceId }: { serviceId: string }) {
  const router = useRouter();
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


  const { registerField, validateAndScroll } = useFormValidation({
    scrollOffset: 100,
    onValidationError: (field: string, message: string) => {
      console.log(`Validation error in ${field}: ${message}`);
    }
  });

  function getDefaultFormData() {
    return {
      categoryId: "",
      specailizationId: "",
      category: "",
      specailization: "",
      serviceLocation: "", // New field
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
      orderExpirationHours: 24,
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

  const handleFormChange = useCallback((e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      if (name === 'categoryId') {
        return { ...prev, [name]: value, specailizationId: "", ["category"]: e.target.options[e.target.options.selectedIndex].label };
      }
      else if (name === 'specailizationId') {
        return { ...prev, [name]: value, ["specailization"]: e.target.options[e.target.options.selectedIndex].label };
      }
      else
        return { ...prev, [name]: value };
    });
  }, []);

  const handleLocationSelect = useCallback((location: string) => {
    setFormData((prev: any) => ({ ...prev, location }));
  }, []);

  const handleServiceAreaCenterChange = useCallback((center: string) => {
    setFormData((prev: any) => ({ ...prev, serviceAreaCenter: center }));
  }, []);

  const handleServiceAreaRadiusChange = useCallback((radius: number) => {
    setFormData((prev: any) => ({ ...prev, serviceAreaRadius: radius }));
  }, []);

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
      field: 'serviceLocation',
      label: 'مكان تقديم الخدمة',
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

  const handleNext = useCallback(async () => {
    const result = validateAndScroll(formData, validationRules);

    if (!result.isValid) {
      return;
    }

    try {
      // Save before navigating
      ServiceStorage.saveBookingData(serviceId, formData);
      router.push(`/${serviceId}/book/summary`);
    } catch (error) {
      console.error('Error proceeding to summary:', error);
    }
  }, [formData, validationRules, validateAndScroll, router, serviceId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 mb-8">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative">
        <StepperNavigation service={service} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Service Header with Sparkles */}
          <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                {decodeURIComponent(service)}
              </h1>
              <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              احجزي موعدك وكوني الأجمل
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">

            {/* Service Type Selection */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  نوع الخدمة
                </h2>
              </div>
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

            {/* Service Location Selection - NEW */}
            <section
              ref={(el) => registerField('serviceLocation', el)}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  أين تفضلين تقديم الخدمة؟
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICE_LOCATION_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.serviceLocation === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData((prev: any) => ({ ...prev, serviceLocation: option.value }))}
                      className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${isSelected
                        ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl scale-105'
                        : 'border-pink-200 bg-white hover:border-pink-300 hover:shadow-lg hover:scale-102'
                        }`}
                    >
                      {/* Decorative Corner */}
                      {isSelected && (
                        <div className="absolute top-0 right-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
                          <Heart className="absolute top-2 right-2 w-5 h-5 text-white fill-white animate-pulse" />
                        </div>
                      )}

                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isSelected
                          ? 'bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg'
                          : 'bg-pink-100 group-hover:bg-pink-200'
                          }`}>
                          <Icon className={`w-8 h-8 transition-colors ${isSelected ? 'text-white' : 'text-pink-600'
                            }`} />
                        </div>

                        <div>
                          <h3 className={`text-xl font-bold mb-1 transition-colors ${isSelected ? 'text-pink-600' : 'text-gray-800'
                            }`}>
                            {option.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-1 text-pink-600 font-medium text-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>تم الاختيار</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Description */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  وصف التفاصيل <span className="text-pink-500">*</span>
                </h2>
                <HelpCircle className="w-5 h-5 text-pink-400" />
              </div>
              <div ref={(el) => registerField('description', el)}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="صفي لنا ما تحتاجينه بالتفصيل... 💕"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border-2 border-pink-200 bg-white rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none resize-none text-right transition-all"
                  dir="rtl"
                />
              </div>
            </section>

            {/* Media Upload */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  المرفقات
                </h2>
                <HelpCircle className="w-5 h-5 text-pink-400" />
              </div>
              <div className="space-y-6">
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
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  موعد الخدمة
                </h2>
              </div>
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
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl"
            >
              <MapSection
                title="العنوان"
                location={formData.location || ""}
                onLocationChange={handleLocationSelect}
                isLoaded={isLoaded}
                loadError={loadError}
                defaultCenter={{ lat: 24.7136, lng: 46.6753 }}
                colorTheme="pink"
              />
            </section>

            {/* Service Area */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl">
              <ServiceAreaSection
                title="منطقة الخدمة"
                center={formData.serviceAreaCenter || "24.7136, 46.6753"}
                radius={formData.serviceAreaRadius || 5}
                onCenterChange={handleServiceAreaCenterChange}
                onRadiusChange={handleServiceAreaRadiusChange}
                isLoaded={isLoaded}
                loadError={loadError}
                defaultCenter={{ lat: 24.7136, lng: 46.6753 }}
                colorTheme="pink"
              />
            </section>

            {/* Budget Range */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  نطاق الميزانية
                </h2>
                <HelpCircle className="w-5 h-5 text-pink-400" />
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-4 mb-6">
                <p className="text-sm text-pink-800 text-right flex items-center gap-2" dir="rtl">
                  <Sparkles className="w-4 h-4" />
                  حددي نطاق الميزانية المناسب لك
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div ref={(el) => registerField('minBudget', el)}>
                  <FormInput
                    label="الحد الأدنى (ريال)"
                    name="minBudget"
                    type="number"
                    value={formData.minBudget}
                    onChange={handleFormChange}
                    placeholder="مثال: 100"
                    required={true}
                  />
                </div>
                <div ref={(el) => registerField('maxBudget', el)}>
                  <FormInput
                    label="الحد الأقصى (ريال)"
                    name="maxBudget"
                    type="number"
                    value={formData.maxBudget}
                    onChange={handleFormChange}
                    placeholder="مثال: 1000"
                    required={true}
                  />
                </div>
              </div>
              {formData.minBudget && formData.maxBudget && (
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl">
                  <p className="text-sm text-pink-800 text-right flex items-center gap-2" dir="rtl">
                    <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                    نطاق الميزانية: {formData.minBudget} - {formData.maxBudget} ريال
                  </p>
                </div>
              )}
            </section>

            {/* Order Expiration Time */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  وقت انتهاء الطلب
                </h2>
                <HelpCircle className="w-5 h-5 text-pink-400" />
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-pink-200 rounded-2xl p-4 mb-6">
                <p className="text-sm text-pink-800 text-right" dir="rtl">
                  ⏰ حددي المدة المتاحة لاستقبال العروض
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right" dir="rtl">
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
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.orderExpirationHours === hours
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                          : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                          }`}
                      >
                        {hours} ساعة
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right" dir="rtl">
                    أو حددي عدد الساعات
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
                      className="flex-1 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
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
                      <span className="text-sm font-medium text-gray-700">ساعة</span>
                    </div>
                  </div>
                </div>

                {formData.orderExpirationHours && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-pink-600" />
                      <p className="text-sm font-semibold text-pink-800">
                        سيتم قفل الطلب في:
                      </p>
                    </div>
                    <p className="text-sm text-pink-700 text-right" dir="rtl">
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
                  </div>
                )}
              </div>
            </section>

            {/* Notes */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-6 sm:p-8 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ملاحظات إضافية
                </h2>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                placeholder="أي ملاحظات أو طلبات خاصة... ✨"
                rows={4}
                className="w-full px-4 py-3 border-2 border-pink-200 bg-white rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none resize-none text-right transition-all"
                dir="rtl"
              />
            </section>

            {/* Submit Button */}
            <div className="p-6 flex justify-center">
              <button
                onClick={handleNext}
                type="button"
                className="group relative overflow-hidden w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 hover:from-pink-600 hover:via-purple-600 hover:to-rose-600 text-white py-4 px-10 sm:px-12 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                <span className="relative z-10 text-lg">تأكيد</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}