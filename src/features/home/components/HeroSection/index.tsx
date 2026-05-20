"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ChevronRight, Package, Star, Store, Clock } from "lucide-react";
import { useLanguage } from "@/providers";
import HeroBackground from "./HeroBackground";

// ── Stats data ─────────────────────────────────────────────────────────────

const STATS = (isArabic: boolean) => [
    {
        icon: Package,
        value: "2M+",
        label: isArabic ? "طلب موصّل" : "Delivered",
        color: "#059669",
        bg: "rgba(16,185,129,0.10)",
    },
    {
        icon: Star,
        value: "4.8",
        label: isArabic ? "تقييم" : "Rating",
        color: "#d97706",
        bg: "rgba(217,119,6,0.10)",
    },
    {
        icon: Store,
        value: "50K+",
        label: isArabic ? "متجر" : "Stores",
        color: "#2563eb",
        bg: "rgba(37,99,235,0.10)",
    },
    {
        icon: Clock,
        value: "~20",
        suffix: isArabic ? "د" : "m",
        label: isArabic ? "توصيل" : "Delivery",
        color: "#7c3aed",
        bg: "rgba(124,58,237,0.10)",
    },
];

// ── Hero Section ───────────────────────────────────────────────────────────

export default function HeroSection() {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    const stats = STATS(isArabic);

    return (
        <section
            className="relative overflow-hidden"
            dir={isArabic ? "rtl" : "ltr"}
            style={{ minHeight: "clamp(480px, 70vh, 680px)" }}
        >
            <HeroBackground />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">

                {/* ── Main grid — copy left, visual right ─────────── */}
                <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${isArabic ? "" : ""}`}>

                    {/* ── COPY COLUMN ─────────────────────────────── */}
                    <div className={isArabic ? "text-right order-2 lg:order-1" : "text-left"}>

                        {/* Live badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-5 inline-flex items-center gap-2"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            </span>
                            <span
                                className="text-xs font-bold uppercase tracking-[0.18em]"
                                style={{ color: "#059669" }}
                            >
                                {isArabic ? "توصيل سريع الآن" : "Live delivery now"}
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white"
                            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
                        >
                            {isArabic ? (
                                <>
                                    <span>اطلب </span>
                                    <span
                                        className="relative inline-block"
                                        style={{
                                            background: "linear-gradient(135deg, #059669, #10b981, #34d399)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                        }}
                                    >
                                        طعامك
                                    </span>
                                    <br />
                                    <span>أسرع من أي وقت</span>
                                </>
                            ) : (
                                <>
                                    <span>Order your </span>
                                    <span
                                        className="relative inline-block"
                                        style={{
                                            background: "linear-gradient(135deg, #059669, #10b981, #34d399)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                        }}
                                    >
                                        favorites
                                    </span>
                                    <br />
                                    <span>faster than ever</span>
                                </>
                            )}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.2 }}
                            className="mt-5 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg"
                        >
                            {isArabic
                                ? "آلاف المطاعم والمتاجر بالقرب منك. اختر عنوانك وابدأ الطلب في دقائق."
                                : "Thousands of restaurants and stores near you. Pick your address and start ordering in minutes."}
                        </motion.p>

                        {/* CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className={`mt-8 flex flex-wrap items-center gap-3 ${isArabic ? "justify-end sm:justify-start" : ""}`}
                        >
                            {/* Primary */}
                            <button
                                className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                                style={{
                                    background: "linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)",
                                    boxShadow: "0 8px 24px rgba(16,185,129,0.40), inset 0 1px 0 rgba(255,255,255,0.15)",
                                }}
                            >
                                <Zap className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                                {isArabic ? "اطلب الآن" : "Order now"}
                            </button>

                            {/* Ghost */}
                            <button
                                className="inline-flex items-center gap-1.5 rounded-2xl border px-5 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-emerald-400 hover:text-emerald-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                                style={{ borderColor: "rgba(16,185,129,0.25)" }}
                            >
                                {isArabic ? "استعرض المطاعم" : "Browse restaurants"}
                                <ChevronRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                            </button>
                        </motion.div>

                        {/* ── Trust strips ─────────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.42 }}
                            className={`mt-8 flex flex-wrap gap-2 sm:gap-3 ${isArabic ? "justify-end lg:justify-start" : ""}`}
                        >
                            {stats.map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <motion.div
                                        key={s.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.48 + i * 0.07, type: "spring", stiffness: 280, damping: 22 }}
                                        className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm"
                                        style={{
                                            background: "rgba(255,255,255,0.85)",
                                            border: "1px solid rgba(0,0,0,0.07)",
                                            backdropFilter: "blur(8px)",
                                            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                                        }}
                                    >
                                        <span
                                            className="flex h-7 w-7 items-center justify-center rounded-full"
                                            style={{ background: s.bg }}
                                        >
                                            <Icon className="h-3.5 w-3.5" style={{ color: s.color }} strokeWidth={2.25} />
                                        </span>
                                        <span className="font-extrabold tabular-nums" style={{ color: s.color }}>
                                            {s.value}
                                            {"suffix" in s && s.suffix && (
                                                <span className="text-xs font-bold opacity-80">{s.suffix}</span>
                                            )}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {s.label}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* ── VISUAL COLUMN — food showcase card ──────── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative hidden lg:flex items-center justify-center ${isArabic ? "order-1 lg:order-2" : ""}`}
                    >
                        {/* Large decorative food cards stack */}
                        <FoodShowcase isArabic={isArabic} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ── Food Showcase — decorative card stack ──────────────────────────────────

const FOOD_CARDS = [
    {
        emoji: "🍕",
        name: { en: "Margherita Pizza", ar: "بيتزا مارغريتا" },
        sub: { en: "Italian · 25 min", ar: "إيطالي · ٢٥ د" },
        price: "42",
        rating: "4.9",
        color: "#fff7ed",
        border: "#fed7aa",
        dot: "#ea580c",
    },
    {
        emoji: "🍔",
        name: { en: "Smash Burger", ar: "سماش برغر" },
        sub: { en: "American · 20 min", ar: "أمريكي · ٢٠ د" },
        price: "38",
        rating: "4.8",
        color: "#fefce8",
        border: "#fde047",
        dot: "#ca8a04",
    },
    {
        emoji: "🌮",
        name: { en: "Street Tacos", ar: "تاكوز ستريت" },
        sub: { en: "Mexican · 18 min", ar: "مكسيكي · ١٨ د" },
        price: "29",
        rating: "4.7",
        color: "#f0fdf4",
        border: "#86efac",
        dot: "#16a34a",
    },
];

function FoodShowcase({ isArabic }: { isArabic: boolean }) {
    return (
        <div className="relative w-full max-w-sm">
            {/* Card stack — back two are offset */}
            {FOOD_CARDS.slice(1).map((card, i) => (
                <div
                    key={card.name.en}
                    className="absolute rounded-2xl border"
                    style={{
                        background: card.color,
                        borderColor: card.border,
                        top: `${(i + 1) * 12}px`,
                        left: `${(i + 1) * 8}px`,
                        right: `-${(i + 1) * 8}px`,
                        height: 96,
                        zIndex: i,
                        opacity: 0.6 - i * 0.1,
                    }}
                />
            ))}

            {/* Front card */}
            {FOOD_CARDS.map((card, i) => (
                <motion.div
                    key={card.name.en}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.14, ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                    className="relative mb-3 last:mb-0 rounded-2xl border p-4"
                    style={{
                        background: card.color,
                        borderColor: card.border,
                        boxShadow: `0 4px 20px rgba(0,0,0,0.07)`,
                        zIndex: 10 + i,
                    }}
                    dir={isArabic ? "rtl" : "ltr"}
                >
                    <div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
                        {/* Emoji */}
                        <span className="text-4xl" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }}>
                            {card.emoji}
                        </span>

                        {/* Text */}
                        <div className={`flex-1 min-w-0 ${isArabic ? "text-right" : "text-left"}`}>
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {isArabic ? card.name.ar : card.name.en}
                            </p>
                            <p className="text-xs text-gray-500">{isArabic ? card.sub.ar : card.sub.en}</p>
                        </div>

                        {/* Price + rating */}
                        <div className={`flex flex-col items-end gap-1 flex-shrink-0 ${isArabic ? "items-start" : ""}`}>

                            <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                                style={{ background: card.border, color: card.dot }}
                            >
                                ★ {card.rating}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* "Free delivery" floating pill */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute -top-5 ${isArabic ? "-left-4" : "-right-4"} flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-white`}
                style={{
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    boxShadow: "0 6px 18px rgba(16,185,129,0.4)",
                }}
            >
                🚀 {isArabic ? "توصيل مجاني" : "Free delivery"}
            </motion.div>
        </div>
    );
}