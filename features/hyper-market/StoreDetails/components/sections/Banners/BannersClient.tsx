"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { HyperMarketBanner } from "@/features/hyper-market/StoreDetails/types/banners.types";
import { BannerSlide } from "./BannerSlide";

export function BannersClient({ banners }: { banners: HyperMarketBanner[] }) {
    return (
        <section aria-label="العروض المميزة" className="w-full min-w-0 px-3 sm:px-5 lg:px-6">
            <Swiper
                className="banner-swiper"
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
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
