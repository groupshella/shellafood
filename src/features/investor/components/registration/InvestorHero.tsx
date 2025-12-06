// src/components/Investor/InvestorHero.tsx
"use client";

import { useLanguage } from "@/providers";
import { VideoSlider } from "@/shared/components";
import { INVESTOR_HERO_VIDEOS } from "../../constants/investor.constants";

export default function InvestorHero() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="mb-6 overflow-hidden sm:mb-8" dir={direction}>
			<VideoSlider videos={INVESTOR_HERO_VIDEOS} isArabic={isArabic} autoPlayInterval={5000} />
		</section>
	);
}
