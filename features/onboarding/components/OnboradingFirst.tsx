// app/onboarding/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    Pill,
    Salad,
    UtensilsCrossed,
    Sword,
    ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

/* ============================================================
   ANIMATION CONFIGURATION
   ============================================================ */
const EASE = {
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    spring: { type: "spring" as const, stiffness: 200, damping: 20 },
};

const floatAnimation = (delay: number) => ({
    y: [0, -14, 0],
    transition: {
        duration: 3.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
    },
});

const fadeUpVariants = {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const scaleInVariants = {
    initial: { scale: 0.85, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
};

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

/* ============================================================
   ONBOARDING DATA
   ============================================================ */
const SLIDES = [
    {
        id: 0,
        title: "كل احتياجاتك في تطبيق واحد",
        description: "تسوق واطلب خدماتك اليومية من مكان واحد",
        progress: 0.33,
    },
    {
        id: 1,
        title: "توصيل سريع لباب منزلك",
        description: "نوصل طلباتك بأسرع وقت مع أفضل الخدمات",
        progress: 0.66,
    },
    {
        id: 2,
        title: "ابدأ رحلتك الآن",
        description: "انضم إلى آلاف المستخدمين واستمتع بالتجربة",
        progress: 1.0,
    },
];

/* ============================================================
   COMPONENT: SkipButton
   ============================================================ */
function SkipButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: EASE.smooth }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.85)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="absolute left-6 top-14 z-50 rounded-full bg-white/60 px-5 py-2.5 text-sm font-medium text-[#2D9C8C] backdrop-blur-md shadow-sm transition-colors"
            aria-label="تخطي onboarding"
        >
            تخطي
        </motion.button>
    );
}

/* ============================================================
   COMPONENT: FloatingIcon
   ============================================================ */
function FloatingIcon({
    icon: Icon,
    positionClass,
    delay,
    color = "primary",
}: {
    icon: React.ComponentType<{ className?: string; size?: number }>;
    positionClass: string;
    delay: number;
    color?: "primary" | "secondary";
}) {
    const bgColor = color === "primary" ? "bg-[#30913F]" : "bg-[#2D9C8C]";
    const shadowColor =
        color === "primary" ? "shadow-[#30913F]/25" : "shadow-[#2D9C8C]/25";

    return (
        <motion.div
            animate={floatAnimation(delay)}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
                delay: 0.3 + delay,
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}
            className={`absolute ${positionClass} z-10`}
        >
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${bgColor} text-white shadow-lg ${shadowColor} ring-2 ring-white/20`}
            >
                <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
        </motion.div>
    );
}

/* ============================================================
   COMPONENT: ShoppingBagIllustration
   ============================================================ */
function ShoppingBagIllustration() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: EASE.smooth }}
            className="relative"
        >
            <svg
                width="240"
                height="220"
                viewBox="0 0 240 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="bagGradient"
                        x1="30"
                        y1="80"
                        x2="210"
                        y2="210"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#A7F3D0" />
                        <stop offset="0.5" stopColor="#86EFAC" />
                        <stop offset="1" stopColor="#6EE7B7" />
                    </linearGradient>
                    <linearGradient
                        id="bagSideGradient"
                        x1="30"
                        y1="80"
                        x2="70"
                        y2="210"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#237A34" stopOpacity="0.3" />
                        <stop offset="1" stopColor="#1F5F2C" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="bagShadow" x="-10" y="-10" width="260" height="240">
                        <feDropShadow
                            dx="0"
                            dy="12"
                            stdDeviation="16"
                            floodColor="#30913F"
                            floodOpacity="0.12"
                        />
                    </filter>
                </defs>

                {/* Bag Body */}
                <path
                    d="M30 90 L210 90 L190 210 L50 210 Z"
                    fill="url(#bagGradient)"
                    stroke="#30913F"
                    strokeWidth="2.5"
                    filter="url(#bagShadow)"
                />

                {/* Left Side Fold (Depth) */}
                <path
                    d="M30 90 L50 210 L75 210 L65 90 Z"
                    fill="url(#bagSideGradient)"
                />

                {/* Right Highlight Fold */}
                <path
                    d="M65 90 L75 210 L90 210 L80 90 Z"
                    fill="#FFFFFF"
                    opacity="0.12"
                />

                {/* Top Edge Highlight */}
                <path
                    d="M30 90 L210 90"
                    stroke="#6EE7B7"
                    strokeWidth="2"
                    opacity="0.6"
                />

                {/* Handles - Outer */}
                <path
                    d="M85 90 C85 45 95 25 120 25 C145 25 155 45 155 90"
                    stroke="#30913F"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Handles - Inner */}
                <path
                    d="M105 90 C105 60 110 42 120 42 C130 42 135 60 135 90"
                    stroke="#30913F"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Bottom Reflection */}
                <ellipse
                    cx="120"
                    cy="210"
                    rx="70"
                    ry="4"
                    fill="#30913F"
                    opacity="0.08"
                />
            </svg>

            <Image
                src="/favicon.ico"
                alt="شله معك"
                width={40}
                height={40}
                className="pointer-events-none absolute left-1/2 top-[68%] z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg object-contain drop-shadow-sm"
                priority
            />

            {/* Ground Line */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.9, ease: EASE.smooth }}
                className="absolute -bottom-3 left-1/2 h-0.5 w-56 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#30913F]/25 to-transparent"
            />
        </motion.div>
    );
}

/* ============================================================
   COMPONENT: ProgressButton
   ============================================================ */
function ProgressButton({
    progress,
    onClick,
}: {
    progress: number;
    onClick: () => void;
}) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 15, delay: 1.0 }}
            className="relative flex items-center justify-center"
        >
            {/* Outer Progress Ring */}
            <svg
                className="absolute h-16 w-16 -rotate-90"
                viewBox="0 0 64 64"
                aria-hidden="true"
            >
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3.5"
                />
                <motion.circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#30913F"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
                />
            </svg>

            {/* Action Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClick}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#30913F] text-white shadow-xl shadow-[#30913F]/30 transition-colors hover:bg-[#267a34] active:bg-[#1f5f2a]"
                aria-label="التالي"
            >
                <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
            </motion.button>
        </motion.div>
    );
}

/* ============================================================
   COMPONENT: SlideIndicators
   ============================================================ */
function SlideIndicators({
    total,
    current,
}: {
    total: number;
    current: number;
}) {
    return (
        <div className="mt-5 flex items-center gap-2" role="tablist" aria-label="شرائح onboarding">
            {Array.from({ length: total }).map((_, index) => (
                <motion.div
                    key={index}
                    role="tab"
                    aria-selected={index === current}
                    aria-label={`الشريحة ${index + 1}`}
                    className={`h-1.5 rounded-full transition-colors duration-300 ${index === current ? "bg-[#30913F]" : "bg-gray-300"
                        }`}
                    initial={false}
                    animate={{
                        width: index === current ? 24 : 6,
                        opacity: index === current ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3, ease: EASE.smooth }}
                />
            ))}
        </div>
    );
}

/* ============================================================
   COMPONENT: AmbientOrbs
   ============================================================ */
function AmbientOrbs() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: EASE.smooth }}
                className="absolute -left-24 -top-8 h-80 w-80 rounded-full bg-purple-200/35 blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.2, ease: EASE.smooth }}
                className="absolute -right-20 top-16 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.4, ease: EASE.smooth }}
                className="absolute left-1/2 top-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-100/45 blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.6 }}
                className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#2D9C8C]/10 blur-3xl"
            />
        </div>
    );
}

/* ============================================================
   COMPONENT: AppLogo
   ============================================================ */
function AppLogo() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE.smooth }}
            className="relative"
        >
            <Image
                src="/favicon.ico"
                alt="شله معك"
                width={36}
                height={36}
                className="rounded-lg object-contain"
                priority
            />
        </motion.div>
    );
}

/* ============================================================
   COMPONENT: TextContent
   ============================================================ */
function TextContent({
    title,
    description,
    direction,
}: {
    title: string;
    description: string;
    direction: number;
}) {
    return (
        <motion.div
            key={title}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE.smooth }}
            className="flex w-full flex-col items-center gap-3 px-4"
        >
            <motion.h1
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1, duration: 0.6, ease: EASE.smooth }}
                className="text-center text-[1.65rem] font-bold leading-snug tracking-tight text-gray-900"
            >
                {title}
            </motion.h1>

            <motion.p
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.25, duration: 0.6, ease: EASE.smooth }}
                className="max-w-[280px] text-center text-[0.95rem] leading-relaxed text-gray-500"
            >
                {description}
            </motion.p>
        </motion.div>
    );
}

/* ============================================================
   MAIN PAGE: OnboardingPage
   ============================================================ */
export default function OnboardingPage() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const totalSlides = SLIDES.length;
    const currentData = SLIDES[currentSlide];

    const handleNext = useCallback(() => {
        if (currentSlide < totalSlides - 1) {
            setDirection(1);
            setCurrentSlide((prev) => prev + 1);
        } else {
            router.push("/home");
        }
    }, [currentSlide, totalSlides, router]);

    const handleSkip = useCallback(() => {
        router.push("/home");
    }, [router]);

    const handlePrev = useCallback(() => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide((prev) => prev - 1);
        }
    }, [currentSlide]);

    return (
        <div
            className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-sky-100 via-emerald-50/80 to-white px-6 pb-12 pt-12 selection:bg-[#30913F]/20"
            dir="rtl"
            lang="ar"
        >
            <AmbientOrbs />

            {/* Top Navigation Bar */}
            <div className="relative z-50 flex w-full items-center justify-between">
                <SkipButton onClick={handleSkip} />
                <AppLogo />
            </div>

            {/* Main Illustration Area */}
            <div className="relative mt-4 flex w-full flex-1 flex-col items-center justify-center">
                {/* Floating Icons */}
                <FloatingIcon
                    icon={Pill}
                    positionClass="right-[12%] top-[5%]"
                    delay={0}
                />
                <FloatingIcon
                    icon={UtensilsCrossed}
                    positionClass="left-[10%] top-[20%]"
                    delay={1.2}
                />
                <FloatingIcon
                    icon={Salad}
                    positionClass="right-[18%] top-[28%]"
                    delay={0.6}
                    color="secondary"
                />
                <FloatingIcon
                    icon={ShoppingBag}
                    positionClass="left-[20%] top-[8%]"
                    delay={1.8}
                    color="secondary"
                />

                {/* Hero Illustration */}
                <div className="relative mt-12">
                    <ShoppingBagIllustration />
                </div>
            </div>

            {/* Text Content with AnimatePresence */}
            <div className="relative z-10 flex min-h-[120px] flex-col items-center justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                    <TextContent
                        key={currentSlide}
                        title={currentData.title}
                        description={currentData.description}
                        direction={direction}
                    />
                </AnimatePresence>
            </div>

            {/* Bottom Action Area */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                <ProgressButton progress={currentData.progress} onClick={handleNext} />

                <SlideIndicators total={totalSlides} current={currentSlide} />

                {/* Home Indicator */}
                <div className="mt-2 h-1 w-28 rounded-full bg-gray-900/15" />
            </div>

            {/* Touch Swipe Area (Invisible overlay) */}
            <div
                className="absolute inset-0 z-30"
                onTouchStart={(e) => {
                    const touch = e.touches[0];
                    (e.currentTarget as HTMLElement).dataset.startX = String(touch.clientX);
                }}
                onTouchEnd={(e) => {
                    const startX = Number((e.currentTarget as HTMLElement).dataset.startX);
                    const endX = e.changedTouches[0].clientX;
                    const diff = startX - endX;

                    if (Math.abs(diff) > 50) {
                        if (diff > 0) {
                            handleNext();
                        } else {
                            handlePrev();
                        }
                    }
                }}
                aria-hidden="true"
            />
        </div>
    );
}