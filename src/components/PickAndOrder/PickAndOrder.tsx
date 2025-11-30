"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroSection, TransportTypeSection, FeaturesSection, StepsSection } from "./sections";
import ShellaFooter from "../ShellaFooter/ShellaFooter";

/**
 * Main Pick & Order Landing Page Component
 * Modern, production-ready landing page for delivery service
 */
export const PickAndOrder: React.FC = () => {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-white dark:bg-gray-900">
			<HeroSection />
			<TransportTypeSection />
			<FeaturesSection />
			<StepsSection />
		</div>
	);
};

