"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { HyperMarketOffer } from "@/features/hyper-market/StoreDetails/types/offers.types";
import { OfferSlide } from "./OfferSlide";

export function OffersClient({ offers, isArabic }: { offers: HyperMarketOffer[]; isArabic: boolean }) {
    const canLoop = offers.length >= 2;
    return (
        <section className="w-full min-w-0 overflow-hidden px-3 pb-2 sm:px-5 lg:px-6" aria-label={isArabic ? "العروض" : "Offers"} dir={isArabic ? "rtl" : "ltr"}>
            <h2 className="mb-3 text-base font-bold text-gray-800 dark:text-gray-100 sm:mb-4 sm:text-lg">
                {isArabic ? "عروض وخصومات" : "Offers and discounts"}
            </h2>
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
                        paginationBulletMessage: isArabic ? "انتقل إلى الشريحة {{index}}" : "Go to slide {{index}}",
                    }}
                >
                    {offers.map((offer, index) => (
                        <SwiperSlide key={offer.id} dir={isArabic ? "rtl" : "ltr"}>
                            <OfferSlide offer={offer} isArabic={isArabic} priority={index === 0} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <OfferSlide offer={offers[0]} isArabic={isArabic} priority />
            )}
        </section>
    );
}
