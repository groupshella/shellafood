"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Banner } from "@/features/home/types/banners.types";
import { BannerSlide } from "./BannerSlide";

export function BannersClient({
	banners,
	isArabic,
}: {
	banners: Banner[];
	isArabic: boolean;
}) {
	return (
		<section
			aria-label={isArabic ? "العروض المميزة" : "Featured offers"}
			className="mx-auto w-full min-w-0"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<Swiper
				className="banner-swiper [&_.swiper-pagination-bullet]:!h-1.5 [&_.swiper-pagination-bullet]:!w-1.5 sm:[&_.swiper-pagination-bullet]:!h-2 sm:[&_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination-bullet]:!bg-border [&_.swiper-pagination-bullet-active]:!w-6 sm:[&_.swiper-pagination-bullet-active]:!w-[30px] md:[&_.swiper-pagination-bullet-active]:!w-8 [&_.swiper-pagination-bullet-active]:!bg-brand"
				modules={[Autoplay, Pagination]}
				autoplay={{ delay: 4000, disableOnInteraction: false }}
				pagination={{ clickable: true }}
				loop
				aria-roledescription="carousel"
			>
				{banners.map((banner, i) => (
					<SwiperSlide key={banner.id}>
						<BannerSlide banner={banner} priority={i === 0} isArabic={isArabic} />
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
}
