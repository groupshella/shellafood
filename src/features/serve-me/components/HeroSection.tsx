"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Search, ArrowLeft, Star, Shield, Clock } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  onSearch?: (query: string) => void;
}

const TRUST_BADGES = [
  { icon: Star,   label: "4.9 تقييم" },
  { icon: Shield, label: "موثوق 100%" },
  { icon: Clock,  label: "دعم 24/7" },
] as const;

const WORD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SLIDE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, onSearch }) => {
  const [query, setQuery]     = useState("");
  const [focused, setFocused] = useState(false);
  const ref                   = useRef<HTMLDivElement>(null);
  const inView                = useInView(ref, { once: true });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), []);
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) onSearch(query.trim());
  }, [onSearch, query]);

  const words = title.split(" ");

  return (
    <section ref={ref} dir="rtl" className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" aria-label="قسم البطل">

      {/* Blobs */}
      <div aria-hidden className="absolute top-0 right-0 w-32 sm:w-56 md:w-80 lg:w-[440px] h-32 sm:h-56 md:h-80 lg:h-[440px] bg-green-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div aria-hidden className="absolute bottom-0 left-0 w-40 sm:w-72 md:w-96 lg:w-[520px] h-40 sm:h-72 md:h-96 lg:h-[520px] bg-emerald-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div aria-hidden className="absolute top-1/2 left-1/2 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-teal-200 rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Dot grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

      {/* Top accent line */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(to left, transparent, #10b981 35%, #059669 65%, transparent)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20 lg:py-24 xl:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 items-center">

          {/* TEXT COLUMN */}
          <div className="order-2 lg:order-1 flex flex-col gap-5 sm:gap-6 text-right">

            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, ease: "easeOut" }} className="inline-flex items-center gap-2 self-start lg:self-auto">
              <span className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                منصة الخدمات الرائدة
              </span>
            </motion.div>

            {/* Staggered headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] text-gray-900 flex flex-wrap gap-x-2 gap-y-1 justify-start" style={{ letterSpacing: "-0.02em" }}>
              {words.map((word, i) => (
                <motion.span key={`${word}-${i}`} custom={i} variants={WORD_VARIANTS} initial="hidden" animate={inView ? "visible" : "hidden"}
                  className={i <= 1 ? "bg-clip-text text-transparent" : "text-gray-900"}
                  style={i <= 1 ? { backgroundImage: "linear-gradient(to left, #10b981, #059669)" } : undefined}>
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Rule */}
            <motion.div custom={1} variants={SLIDE_UP}  initial="hidden" animate={inView ? "visible" : "hidden"} className="w-12 h-1 rounded-full bg-gradient-to-l from-emerald-400 to-teal-400 self-start lg:self-auto" />

            {/* Subtitle */}
            <motion.p custom={2} variants={SLIDE_UP} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-md mr-0 ml-auto lg:ml-0">
              {subtitle}
            </motion.p>

            {/* Search bar */}
            <motion.form custom={3} variants={SLIDE_UP} initial="hidden" animate={inView ? "visible" : "hidden"} onSubmit={handleSubmit} role="search" className="relative">
              <div className="relative flex items-center bg-white rounded-2xl transition-all duration-300"
                style={{ boxShadow: focused ? "0 0 0 3px rgba(16,185,129,0.25), 0 8px 30px rgba(16,185,129,0.15)" : "0 4px 18px rgba(0,0,0,0.08)", border: focused ? "2px solid #10b981" : "2px solid #e5e7eb" }}>
                <div className="flex-shrink-0 pr-3 sm:pr-4 pl-1">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200" style={{ color: focused ? "#10b981" : "#9ca3af" }} strokeWidth={2.5} aria-hidden />
                </div>
                <input type="search" value={query} onChange={handleChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  placeholder="ابحث عن خدمة..." aria-label="ابحث عن خدمة"
                  className="flex-1 py-3 sm:py-3.5 md:py-4 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none min-w-0" />
                <div className="flex-shrink-0 pl-1.5 sm:pl-2 pr-1.5 sm:pr-2">
                  <button type="submit" aria-label="بحث"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    style={{ background: "linear-gradient(to left, #10b981, #059669)", boxShadow: "0 3px 12px rgba(16,185,129,0.35)" }}>
                    <span className="hidden sm:inline">بحث</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Trust badges */}
            <motion.div custom={4} variants={SLIDE_UP} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex items-center gap-2 sm:gap-3 flex-wrap justify-start lg:justify-start">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 bg-white border border-emerald-100 rounded-full px-3 py-1.5 shadow-sm">
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-emerald-500" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* IMAGE COLUMN */}
          <motion.div initial={{ opacity: 0, x: -28 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-[260px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[500px]">

              {/* Rotating ring */}
              <div aria-hidden className="absolute inset-0 -m-3 sm:-m-4 rounded-3xl border-2 border-dashed border-emerald-300 opacity-50 pointer-events-none" style={{ animation: "heroSpin 18s linear infinite" }} />

              {/* Glow */}
              <div aria-hidden className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-2xl opacity-30 -z-10 scale-110 pointer-events-none" style={{ background: "linear-gradient(135deg, #34d399, #10b981)" }} />

              {/* Image */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/serveme-hero.png" alt="خدمة التوصيل السريع" width={500} height={400} priority className="w-full h-auto object-cover"
                  sizes="(max-width: 640px) 260px, (max-width: 768px) 340px, (max-width: 1024px) 420px, 500px" />
                <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
              </div>

              {/* Stat badge — top left */}
              <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-xl border border-gray-100 text-right">
                <p className="text-lg sm:text-2xl font-black text-gray-900 leading-none">+500</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">خدمة متاحة</p>
              </motion.div>

              {/* Stat badge — bottom right */}
              <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.75, ease: "easeOut" }}
                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-xl border border-gray-100 text-right">
                <p className="text-lg sm:text-2xl font-black leading-none" style={{ color: "#10b981" }}>98%</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">رضا العملاء</p>
              </motion.div>

              {/* Live pulse dot */}
              <div aria-hidden className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 shadow-lg">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom accent line */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to left, transparent, #10b981 40%, transparent)" }} />

      <style>{`@keyframes heroSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
};