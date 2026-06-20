"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Banner } from "@/features/home/types/banners.types";
import { BannerSlide } from "./BannerSlide";

export function BannersClient({ banners }: { banners: Banner[] }) {
    return (
        <section aria-label="العروض المميزة" className="mx-auto w-full max-w-5xl px-4 sm:px-6">
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
