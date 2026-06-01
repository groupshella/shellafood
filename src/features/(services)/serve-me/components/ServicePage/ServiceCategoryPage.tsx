"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/providers";
import { Search } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { useServiceCategory } from "../../hooks/useServiceCategory";
import HeroSection from "./HeroSection";
import MainServiceSection from "./MainServicesSection";
import KeyServicesSection from "./KeyServicesSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import WorkshopsSection from "./WorkshopsSection";
import VideoSection from "./VideoSectioin";

const ServiceCategoryPage: React.FC<{ serviceSlug: string }> = ({ serviceSlug }) => {
	const { language, t } = useLanguage();
	const isArabic = language === "ar";

	const {
		serviceData,
		isLoading,
		title,
		description,
		mainServices,
		whyChooseUs,
		availableWorkshops,
		handleBookAppointment,
		
	} = useServiceCategory(serviceSlug, isArabic);

	// Show loading state - must be after all hooks
	if (isLoading || !serviceData) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center" dir={isArabic ? "rtl" : "ltr"}>
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Hero Section - Full Width Edge to Edge */}
			<HeroSection title={title||""} description={description||""} heroImage={serviceData?.heroImage}  />

			{/* Main Services Section */}
		<MainServiceSection mainServices={mainServices||[]}/>

			{/* Key Services Section */}
			<KeyServicesSection mainServices={mainServices ||[]}/>

			{/* Why Choose Us Section */}
			<WhyChooseUsSection whyChooseUs={whyChooseUs||[]}/>

			{/* Available Workshops Section */}
			<WorkshopsSection availableWorkshops={availableWorkshops||[]} handleBookAppointment={handleBookAppointment}/>

			{/* Video Section */}
			<VideoSection videoThumbnail={serviceData?.videoThumbnail}/>

		</div>
	);
};

export default ServiceCategoryPage;
