"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { HyperMarketOffer } from "@/features/hyper-market/StoreDetails/types/offers.types";
import { OfferSlide } from "./OfferSlide";

export function OffersClient({ offers }: { offers: HyperMarketOffer[] }) {
    const canLoop = offers.length >= 2;
    return (
        <section
            className="w-full min-w-0 overflow-hidden px-3 pb-2 sm:px-5 sm:pb-3 md:px-6 lg:px-6 lg:pb-4 xl:px-8 2xl:px-10"
            aria-label="العروض"
        >
            <h2 className="mb-3 text-base font-bold text-gray-800 dark:text-gray-100 sm:mb-4 sm:text-lg md:mb-5 md:text-xl lg:text-[1.375rem] xl:mb-6 xl:text-2xl">
                عروض وخصومات
            </h2>
            {canLoop ? (
                <Swiper
                    dir="rtl"
                    modules={[Autoplay, Pagination, A11y]}
                    className="w-full !overflow-hidden rounded-2xl sm:rounded-[1.25rem] md:rounded-3xl lg:rounded-[1.75rem] xl:rounded-[2rem]"
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
                        prevSlideMessage: "الشريحة السابقة",
                        nextSlideMessage: "الشريحة التالية",
                        paginationBulletMessage: "انتقل إلى الشريحة {{index}}",
                    }}
                >
                    {offers.map((offer, index) => (
                        <SwiperSlide key={offer.id}>
                            <OfferSlide offer={offer} priority={index === 0} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <OfferSlide offer={offers[0]} priority />
            )}
        </section>
    );
}
