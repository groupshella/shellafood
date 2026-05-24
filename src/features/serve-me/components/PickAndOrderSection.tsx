"use client";

import React, { useRef } from "react";
import { Truck, Package, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Package,
    title: "شحن خفيف وسريع",
    desc: "دراجات نارية وفانات لتوصيل الطرود بسرعة وكفاءة لا تُضاهى.",
    color: "#10b981",
    light: "#d1fae5",
  },
  {
    icon: Truck,
    title: "نقل متوسط وتجاري",
    desc: "دينا وجامبو لنقل الأثاث والمخازن باحترافية تامة.",
    color: "#059669",
    light: "#a7f3d0",
  },
  {
    icon: ShieldCheck,
    title: "شحن ثقيل ومتخصص",
    desc: "شاحنات كبيرة ومبردة مع أعلى معايير الأمان والحماية.",
    color: "#0d9488",
    light: "#ccfbf1",
  },
];

export const PickAndOrderSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const router = useRouter();

  return (
    <section
      ref={ref}
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16 md:py-20 lg:py-28"
    >
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-green-200 rounded-full blur-3xl opacity-25 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-emerald-200 rounded-full blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-32 sm:w-48 h-32 sm:h-48 bg-teal-200 rounded-full blur-3xl opacity-15 -translate-y-1/2 pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(to left, transparent, #10b981 35%, #059669 65%, transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 xl:gap-24 items-center">

          {/* ── Column A: Text + CTA ── */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 sm:gap-7 order-2 lg:order-1"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-6 h-0.5 rounded-full bg-emerald-500" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-emerald-600">
                خدمة مميزة
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] text-gray-900"
              style={{ letterSpacing: "-0.02em" }}
            >
              خدمة الشحن
              <span
                className="block mt-1 bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(to left, #10b981, #059669)",
                }}
              >
                والنقل الذكية
              </span>
            </h2>

            {/* Divider rule */}
            <div className="w-14 h-1 rounded-full bg-gradient-to-l from-emerald-400 to-teal-400" />

            {/* Body */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-md">
              حلول شحن مرنة تبدأ من الطرود الخفيفة حتى الشحن الثقيل والمتخصص،
              مع إمكانية إضافة العمالة والأوناش ومواد التغليف لضمان تجربة نقل
              آمنة واحترافية بالكامل.
            </p>

            {/* CTA button */}
            <div>
              <motion.button
                onClick={() => router.push("/pickandorder")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl overflow-hidden text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                style={{
                  background: "linear-gradient(to left, #10b981, #059669)",
                  boxShadow: "0 6px 28px rgba(16,185,129,0.38)",
                }}
              >
                {/* Shine sweep */}
                <span
                  aria-hidden
                  className="absolute inset-0 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"
                  style={{
                    background:
                      "linear-gradient(to left, transparent, rgba(255,255,255,0.2), transparent)",
                  }}
                />
                <span className="relative">اطلب الآن</span>
                <ArrowLeft className="relative w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              </motion.button>
            </div>
          </motion.div>

          {/* ── Column B: Feature cards ── */}
          <div className="flex flex-col gap-3 sm:gap-4 order-2 lg:order-1">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -28 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.18 + i * 0.13,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative flex items-start gap-3 sm:gap-5 bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 transition-all duration-300 cursor-default"
                  style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = `0 8px 30px ${f.color}28`;
                    el.style.borderColor = `${f.color}40`;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 2px 14px rgba(0,0,0,0.05)";
                    el.style.borderColor = "#f3f4f6";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {/* Right accent bar */}
                  <div
                    className="absolute right-0 top-4 bottom-4 w-[3px] rounded-full transition-all duration-300 group-hover:top-2 group-hover:bottom-2"
                    style={{ background: f.color }}
                  />

                 

                  {/* Icon + text */}
                  <div className="flex-1 flex items-start gap-3 sm:gap-4 min-w-0">
                    <div
                      className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: f.light,
                        border: `1px solid ${f.color}30`,
                      }}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: f.color }} />
                    </div>
                    <div className="flex-1 pt-0.5 min-w-0">
                      <h4 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-1 leading-tight">
                        {f.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to left, transparent, #10b981 40%, transparent)",
        }}
      />
    </section>
  );
};