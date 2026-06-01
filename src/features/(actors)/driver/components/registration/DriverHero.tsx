"use client";

import { useLanguage } from "@/providers";
import { ImageSlider, ImageItem } from "@/shared/components";
import { DRIVER_IMAGES } from "../../constants/driver.constants";

export default function DriverHero() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="relative mb-8 overflow-hidden" dir={direction}>
			<ImageSlider 
				images={DRIVER_IMAGES as ImageItem[]} 
				isArabic={isArabic}
				autoPlayInterval={5000}
			/>
		</section>
	);
}

