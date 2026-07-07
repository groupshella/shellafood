"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Banner } from "@/features/home/types/banners.types";
import { BannerSlide } from "./BannerSlide";

export function BannersClient({ banners }: { banners: Banner[] }) {
	return (
		<section aria-label="العروض المميزة" className="mx-auto w-full min-w-0">
			<Swiper
				className="banner-swiper [&_.swiper-pagination-bullet]:!h-1.5 [&_.swiper-pagination-bullet]:!w-1.5 sm:[&_.swiper-pagination-bullet]:!h-2 sm:[&_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination-bullet]:!bg-gray-200 [&_.swiper-pagination-bullet]:dark:!bg-gray-600 [&_.swiper-pagination-bullet-active]:!w-6 sm:[&_.swiper-pagination-bullet-active]:!w-[30px] [&_.swiper-pagination-bullet-active]:!bg-[#30913F] [&_.swiper-pagination-bullet-active]:dark:!bg-[#3da84f]"
				modules={[Autoplay, Pagination]}
				autoplay={{ delay: 4000, disableOnInteraction: false }}
				pagination={{ clickable: true }}
				loop
				aria-roledescription="carousel"
			>
				{banners.map((banner, i) => (
					<SwiperSlide key={banner.id}>
						<BannerSlide banner={banner} priority={i === 0} />
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
}
