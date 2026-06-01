// src/components/Worker/WorkerHero.tsx
"use client";

import { useLanguage } from "@/providers";
import { ImageSlider } from "@/shared/components";
import { WORKER_IMAGES } from "../../constants/worker.constants";

export default function WorkerHero() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="relative mb-8 overflow-hidden" dir={direction}>
			<ImageSlider 
				images={WORKER_IMAGES} 
				isArabic={isArabic}
				autoPlayInterval={5000}
			/>
		</section>
	);
}

