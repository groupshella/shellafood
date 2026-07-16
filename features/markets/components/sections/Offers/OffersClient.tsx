"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Offer } from "@/features/markets/types/offers.types";
import { OfferSlide } from "./OfferSlide";

export function OffersClient({
	offers,
	isArabic,
}: {
	offers: Offer[];
	isArabic: boolean;
}) {
	const canLoop = offers.length >= 2;

	return (
		<section
			className="mx-auto w-full max-w-lg overflow-hidden px-3 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl"
			aria-label={isArabic ? "العروض" : "Offers"}
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			{canLoop ? (
				<Swiper
					dir={isArabic ? "rtl" : "ltr"}
					modules={[Autoplay, Pagination, A11y]}
					className="w-full !overflow-hidden rounded-2xl"
					loop
					speed={650}
					autoplay={{
						delay: 3500,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					pagination={{
						clickable: true,
						dynamicBullets: true,
					}}
					touchStartPreventDefault={false}
					touchMoveStopPropagation
					spaceBetween={0}
					slidesPerView={1}
					a11y={{
						prevSlideMessage: isArabic ? "الشريحة السابقة" : "Previous slide",
						nextSlideMessage: isArabic ? "الشريحة التالية" : "Next slide",
						paginationBulletMessage: isArabic
							? "انتقل إلى الشريحة {{index}}"
							: "Go to slide {{index}}",
					}}
				>
					{offers.map((offer, index) => (
						<SwiperSlide key={offer.id}>
							<OfferSlide offer={offer} priority={index === 0} isArabic={isArabic} />
						</SwiperSlide>
					))}
				</Swiper>
			) : (
				<OfferSlide offer={offers[0]} priority isArabic={isArabic} />
			)}
		</section>
	);
}
