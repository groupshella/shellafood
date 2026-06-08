// features/home/components/Banners.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import { useBanners } from "@/features/home/hooks/useBanners";
import { Banner } from "@/features/home/types/banners.types";

// Swiper base styles – import once here, not in a layout
import "swiper/css";
import "swiper/css/pagination";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getBannerHref(banner: Banner): string | null {
    if (banner.link) return banner.link;
    if (banner.store?.slug) return `/store/${banner.store.slug}`;
    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// BannerSlide
// ─────────────────────────────────────────────────────────────────────────────

function BannerSlide({ banner, priority = false }: { banner: Banner; priority?: boolean }) {
    const href = getBannerHref(banner);
    const [hasError, setHasError] = useState(false);

    const image = hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-sm text-gray-400">تعذر تحميل الصورة</span>
        </div>
    ) : (
        <Image
            src={banner.image_full_url}
            alt={banner.title || "عرض ترويجي"}
            fill
            priority={priority}
            quality={85}
            // KEY FIX: object-cover fills the container without distortion on any screen
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            // Accurate sizes so the browser downloads the right resolution
            sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 960px"
            onError={() => setHasError(true)}
        />
    );

    // Shared wrapper — fixed aspect ratio so height is consistent on every device
    // aspect-[21/7] ≈ 3:1 wide banner; tweak to match your banner artwork
    const wrapper = (
        <div
            className={[
                "group relative w-full overflow-hidden ",
                "bg-gradient-to-br from-gray-100 to-gray-200",
                "shadow-sm ring-1 ring-black/[0.04]",
                // ── KEY FIX: aspect-ratio instead of fixed heights ──────────────────
                // This scales smoothly across every viewport without magic numbers.
                "aspect-[21/7] sm:aspect-[21/6]",
                href ? "cursor-pointer active:scale-[0.985] transition-transform duration-200" : "",
            ].join(" ")}
        >
            {image}
            {/* Subtle bottom gradient for legibility if text overlays are added later */}
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
                aria-hidden
            />
        </div>
    );

    if (href) {
        return (
            <Link
                href={href}
                target={banner.link ? "_blank" : undefined}
                rel={banner.link ? "noopener noreferrer" : undefined}
                className="block outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 rounded-2xl"
                draggable={false}          // prevents image drag interfering with swipe
            >
                {wrapper}
            </Link>
        );
    }

    return wrapper;
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton — matches the real banner's aspect ratio exactly
// ─────────────────────────────────────────────────────────────────────────────

function BannersSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <div className="aspect-[21/7] sm:aspect-[21/6] w-full animate-pulse rounded-2xl bg-gray-100" />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Banners
// ─────────────────────────────────────────────────────────────────────────────

export default function Banners() {
    const { banners, isLoading, error } = useBanners();

    if (isLoading) return <BannersSkeleton />;
    if (error || banners.length === 0) return null;

    const canLoop = banners.length >= 2;

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            // KEY FIX: overflow-hidden on the section clips the swiper correctly so
            // swiping never scrolls the whole page or bleeds outside this container.
            className="mx-auto w-full max-w-5xl overflow-hidden "
            aria-label="العروض الترويجية"
        >
            {canLoop ? (
                <Swiper
                    dir="rtl"
                    modules={[Autoplay, Pagination, A11y]}
                    // KEY FIX: remove !overflow-visible — that was what caused page-level
                    // scroll when swiping. Keep overflow clipped inside the section above.
                    className="w-full"
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
                    // KEY FIX: touchStartPreventDefault stops touch events from bubbling
                    // to the page scroll handler while the user is swiping a banner.
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
                    {banners.map((banner, index) => (
                        <SwiperSlide key={banner.id}>
                            <BannerSlide banner={banner} priority={index === 0} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <BannerSlide banner={banners[0]} priority />
            )}
        </motion.section>
    );
}