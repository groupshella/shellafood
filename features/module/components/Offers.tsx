"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import { useOffers } from "@/features/module/hooks/useOffers";
import { Offer } from "@/features/module/types/offers.types";

import "swiper/css";
import "swiper/css/pagination";


const SLIDE_CLASS = [
    "group relative w-full overflow-hidden rounded-2xl",
    "bg-gradient-to-br from-gray-100 to-gray-200",
    "shadow-sm ring-1 ring-black/[0.04]",
    "aspect-[16/9] sm:aspect-[21/8] md:aspect-[21/7] lg:aspect-[21/6]",
].join(" ");

function OfferSlide({ offer, priority = false }: { offer: Offer; priority?: boolean }) {
    const [hasError, setHasError] = useState(false);

    const image = hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-sm text-gray-400">تعذر تحميل الصورة</span>
        </div>
    ) : (
        <Image
            src={offer.banner}
            alt={offer.name || "عرض"}
            fill
            priority={priority}
            quality={85}
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 960px"
            onError={() => setHasError(true)}
        />
    );

    return (
        <div className={SLIDE_CLASS}>
            {image}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-transparent"
                aria-hidden
            />
        </div>
    );
}

function OffersSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <div className={`${SLIDE_CLASS} animate-pulse bg-gray-100`} />
        </div>
    );
}

interface OffersProps {
    moduleId: string;
    moduleName: string;
}

export default function Offers({ moduleId, moduleName }: OffersProps) {
    const { offers, isLoading, error } = useOffers(moduleId);

    if (isLoading) return <OffersSkeleton />;
    if (error || offers.length === 0) return null;

    const canLoop = offers.length >= 2;

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto w-full max-w-5xl overflow-hidden px-4 sm:px-6"
            aria-label="العروض"
        >
            {canLoop ? (
                <Swiper
                    dir="rtl"
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
        </motion.section>
    );
}

