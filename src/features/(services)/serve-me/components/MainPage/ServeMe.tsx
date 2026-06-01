"use client";

import React, { useMemo, useCallback } from "react";
import { useLanguage } from "@/providers";
import { HeroSection } from "./HeroSection";
import { ServicesGrid } from "./ServicesGrid";
import { FeaturesSection } from "./FeaturesSection";
import { Car, Truck, Wrench, Plane, Baby, Scale, Scissors, Hammer, MapPin, Headphones, CheckCircle } from "lucide-react";
import {

	Refrigerator,
	Laptop,
	Shield,
	TreePine,
	Sparkles,
	Dumbbell,
	BookOpen,
	Heart,
	Shirt,
	PawPrint,
  } from "lucide-react";
import { SERVE_ME_SERVICES, SERVE_ME_FEATURES } from "../../constants/serve-me.constants";
import type { ServiceItem, FeatureItem } from "../../types/serve-me.types";
import type { ServiceGridItem } from "../../types/serve-me.types";

/**
 * Icon mapping for service icons
 */

  export const SERVICE_ICONS = {
	Car,
	Truck,
	Wrench,
	Plane,
	Baby,
	Scale,
	Scissors,
	Hammer,
	Refrigerator,
	Laptop,
	Shield,
	TreePine,
	Sparkles,
	Dumbbell,
	BookOpen,
	Heart,
	Shirt,
	PawPrint,
  };
  

/**
 * Icon mapping for feature icons
 */
const FEATURE_ICONS = {
	MapPin,
	Headphones,
	CheckCircle,
} as const;

/**
 * ServeMe Component (اخدمني)
 * Main component for the serve-me service page
 * Complete design with hero, services grid, and features
 */
export default function ServeMe() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	// Memoize services data
	const services = useMemo((): ServiceGridItem[] => 
		SERVE_ME_SERVICES.map((service: ServiceItem) => {
			const IconComponent = SERVICE_ICONS[service.iconName as keyof typeof SERVICE_ICONS];
			return {
				
				slug: service.slug,
				path: service.path,
				description: isArabic ? service.descriptionAr : service.description,
				title: t(service.translationKey),
				icon: <IconComponent className="w-8 h-8" />,
				image: service.image,
			};
		}), [t]
	);

	// Memoize features data
	const features = useMemo(() => 
		SERVE_ME_FEATURES.map((feature: FeatureItem) => {
			const IconComponent = FEATURE_ICONS[feature.iconName as keyof typeof FEATURE_ICONS];
			return {
				icon: <IconComponent className="w-10 h-10" />,
				title: t(feature.titleKey),
				description: t(feature.descriptionKey),
			};
		}), [t]
	);

	const handleSearch = useCallback((query: string) => {
		console.log("Search query:", query);
		// TODO: Implement search functionality
	}, []);

	return (
		<div className={`${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Hero Section */}
			<HeroSection
				title={t("serveMe.title")}
				subtitle={t("serveMe.subtitle")}
				searchPlaceholder={t("serveMe.searchPlaceholder")}
				isArabic={isArabic}
				onSearch={handleSearch}
			/>

			{/* Services Grid */}
			<ServicesGrid
				title={t("serveMe.servicesTitle")}
				buttonText={t("serveMe.requestService")}
				isArabic={isArabic}
				services={services}
			/>

			{/* Features Section */}
			<FeaturesSection
				features={features}
				isArabic={isArabic}
			/>
		</div>
	);
}

