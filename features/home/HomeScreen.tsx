"use client";

import React, { memo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
    Bell,
    Search,
    ChevronLeft,
    ShoppingCart,
    UtensilsCrossed,
    Wrench,
    Pill,
    GraduationCap,
    Scale,
    Sparkles,
    Home,
    User,
    Receipt,
    ShoppingBag,
    Clock,
    Droplets,
    Building2,
    Store,
    Tag,
    Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const Header = memo(function Header() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between px-5 pt-14 pb-3"
        >
            <div className="flex items-center gap-3">
                <button
                    className="relative p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    aria-label="الإشعارات"
                >
                    <Bell className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                    <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <button
                    className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    aria-label="بحث"
                >
                    <Search className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">مرحباً بك</h1>
        </motion.header>
    );
});

const LocationBanner = memo(function LocationBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="px-5 mb-5"
        >
            <button className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
                <ChevronLeft className="w-4 h-4" />
                <span>انضم الينا، واستمتع بخدمات شلة</span>
            </button>
        </motion.div>
    );
});

const HeroBanner = memo(function HeroBanner() {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-5 mb-6"
        >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-5 pb-4 shadow-sm border border-orange-100/60">
                {/* Decorative food SVG composition */}
                <div className="absolute top-2 left-2 w-32 h-28 opacity-90">
                    <svg viewBox="0 0 140 120" fill="none" className="w-full h-full drop-shadow-sm">
                        {/* Burger */}
                        <motion.g
                            animate={reduce ? {} : { y: [0, -3, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ellipse cx="95" cy="55" rx="22" ry="14" fill="#F59E0B" />
                            <rect x="73" y="55" width="44" height="6" rx="2" fill="#EF4444" />
                            <ellipse cx="95" cy="63" rx="24" ry="8" fill="#FCD34D" />
                            <ellipse cx="95" cy="70" rx="24" ry="6" fill="#D97706" />
                        </motion.g>
                        {/* Pizza slice */}
                        <motion.g
                            animate={reduce ? {} : { y: [0, -4, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            <path d="M55 30 L75 75 L35 75 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
                            <circle cx="55" cy="55" r="3" fill="#EF4444" />
                            <circle cx="62" cy="62" r="2.5" fill="#EF4444" />
                            <circle cx="48" cy="60" r="2.5" fill="#EF4444" />
                            <circle cx="58" cy="68" r="2" fill="#16A34A" />
                        </motion.g>
                        {/* Drink */}
                        <motion.g
                            animate={reduce ? {} : { y: [0, -2, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <rect x="105" y="35" width="14" height="28" rx="3" fill="#BE185D" opacity="0.8" />
                            <line x1="112" y1="28" x2="112" y2="35" stroke="#BE185D" strokeWidth="2" />
                            <line x1="112" y1="28" x2="118" y2="24" stroke="#BE185D" strokeWidth="2" />
                        </motion.g>
                    </svg>
                </div>

                <div className="relative z-10 max-w-[55%]">
                    <p className="text-sm font-bold text-orange-700 leading-relaxed">
                        جميع مطاعمك المفضلة
                    </p>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed mt-0.5">
                        مكان <span className="text-green-600">في</span> واحد
                    </p>
                    <div className="mt-3 inline-flex items-center justify-center w-12 h-8 bg-red-500 rounded-lg shadow-sm">
                        <span className="text-white font-extrabold text-sm">20%</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

const ServicesGrid = memo(function ServicesGrid() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const reduce = useReducedMotion();

    const services = [
        {
            id: "market",
            label: "الماركت",
            icon: ShoppingCart,
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100",
            span: "col-span-2 row-span-2",
            iconSize: "w-14 h-14",
        },
        {
            id: "restaurants",
            label: "المطاعم",
            icon: UtensilsCrossed,
            color: "text-orange-500",
            bg: "bg-orange-50",
            border: "border-orange-100",
            span: "col-span-2 row-span-1",
            iconSize: "w-10 h-10",
        },
        {
            id: "maintenance",
            label: "الصيانات",
            icon: Wrench,
            color: "text-gray-500",
            bg: "bg-gray-100",
            border: "border-gray-200",
            span: "col-span-2 row-span-1",
            iconSize: "w-10 h-10",
        },
        {
            id: "pharmacy",
            label: "الصيدلية",
            icon: Pill,
            color: "text-cyan-600",
            bg: "bg-cyan-50",
            border: "border-cyan-100",
            span: "col-span-1 row-span-1",
            iconSize: "w-6 h-6",
        },
        {
            id: "education",
            label: "التعليم",
            icon: GraduationCap,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            span: "col-span-1 row-span-1",
            iconSize: "w-6 h-6",
        },
        {
            id: "legal",
            label: "القانون",
            icon: Scale,
            color: "text-purple-500",
            bg: "bg-purple-50",
            border: "border-purple-100",
            span: "col-span-1 row-span-1",
            iconSize: "w-6 h-6",
        },
        {
            id: "beauty",
            label: "الجمال",
            icon: Sparkles,
            color: "text-pink-500",
            bg: "bg-pink-50",
            border: "border-pink-100",
            span: "col-span-1 row-span-1",
            iconSize: "w-6 h-6",
        },
    ];

    return (
        <section ref={ref} className="px-5 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">خدماتنا</h2>
            <div className="grid grid-cols-4 grid-rows-3 gap-3">
                {services.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.button
                            key={s.id}
                            initial={{ opacity: 0, y: 16, scale: 0.95 }}
                            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ delay: reduce ? 0 : i * 0.05, duration: 0.4 }}
                            whileTap={{ scale: 0.96 }}
                            className={`${s.span} ${s.bg} ${s.border} border rounded-2xl p-4 flex flex-col items-start justify-between text-right hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 relative overflow-hidden`}
                        >
                            <Icon className={`${s.iconSize} ${s.color} opacity-90`} strokeWidth={1.8} />
                            <span className={`text-sm font-bold ${s.color} mt-2`}>{s.label}</span>
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
});

const MostRequested = memo(function MostRequested() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const reduce = useReducedMotion();

    const items = [
        {
            title: "اسم مقدم الخدمة",
            desc: "وصف الخدمة مثال خدمة تنظيف شاملة للمنزل",
            price: "299",
            tag: "تنظيف المنزل",
            tagColor: "bg-blue-50 text-blue-600",
            gradient: "from-amber-100 to-orange-100",
        },
        {
            title: "اسم مقدم الخدمة",
            desc: "وصف الخدمة مثال خدمة تنظيف شاملة للمنزل",
            price: "299",
            tag: "صيانة السيارة",
            tagColor: "bg-gray-100 text-gray-600",
            gradient: "from-stone-200 to-stone-300",
        },
        {
            title: "اسم مقدم الخدمة",
            desc: "وصف الخدمة مثال خدمة تنظيف شاملة للمنزل",
            price: "299",
            tag: "تنظيف المنزل",
            tagColor: "bg-blue-50 text-blue-600",
            gradient: "from-sky-100 to-cyan-100",
        },
    ];

    return (
        <section ref={ref} className="mb-8">
            <div className="px-5 flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">الأكثر طلباً</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory">
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 30 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: reduce ? 0 : i * 0.1, duration: 0.45 }}
                        className="min-w-[260px] snap-start bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0"
                    >
                        <div className={`h-32 bg-gradient-to-br ${item.gradient} relative`}>
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <Star className="w-12 h-12 text-white fill-white" />
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                                {item.desc}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${item.tagColor}`}>
                                    {item.tag}
                                </span>
                                <span className="text-green-700 font-bold text-sm">{item.price} ﷼</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
});

const RepeatOrders = memo(function RepeatOrders() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const reduce = useReducedMotion();

    const orders = [
        {
            id: 1,
            title: "خدمة تنظيف المنزل",
            provider: "اسم مقدم الخدمة",
            time: "منذ 3 ايام",
            tag: "تنظيف المنزل",
            tagIcon: Droplets,
            tagColor: "text-blue-500",
            circleBg: "bg-blue-50",
            circleIcon: Droplets,
            circleColor: "text-blue-500",
        },
        {
            id: 2,
            title: "خدمة صيانة السيارة",
            provider: "اسم مركز الصيانة",
            time: "منذ 3 ايام",
            tag: "صيانة السيارة",
            tagIcon: Building2,
            tagColor: "text-gray-500",
            circleBg: "bg-gray-100",
            circleIcon: Building2,
            circleColor: "text-gray-500",
        },
        {
            id: 3,
            title: "شراء من ماركت",
            provider: "اسم ماركت",
            time: "منذ 3 ايام",
            tag: "ماركت",
            tagIcon: Store,
            tagColor: "text-green-600",
            circleBg: "bg-green-50",
            circleIcon: ShoppingBag,
            circleColor: "text-green-600",
        },
    ];

    return (
        <section ref={ref} className="px-5 mb-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">أعد طلبك</h2>
            <div className="space-y-3">
                {orders.map((order, i) => {
                    const CircleIcon = order.circleIcon;
                    const TagIcon = order.tagIcon;
                    return (
                        <motion.button
                            key={order.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: reduce ? 0 : i * 0.08, duration: 0.4 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 text-right shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${order.circleBg} flex items-center justify-center`}>
                                <CircleIcon className={`w-5 h-5 ${order.circleColor}`} strokeWidth={1.8} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm truncate">{order.title}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <TagIcon className={`w-3.5 h-3.5 ${order.tagColor}`} strokeWidth={2} />
                                    <span className="text-xs text-gray-500">{order.provider}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[10px] text-gray-400">{order.time}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${order.tagColor}`}>
                                        {order.tag}
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
});

const BottomNav = memo(function BottomNav() {
    const navItems = [
        { id: "home", label: "الرئيسية", icon: Home, active: true },
        { id: "orders", label: "", icon: ShoppingBag, active: false },
        { id: "receipts", label: "", icon: Receipt, active: false },
        { id: "profile", label: "", icon: User, active: false },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${item.active ? "text-green-600" : "text-gray-400 hover:text-gray-600"
                                }`}
                            aria-label={item.label || item.id}
                        >
                            <Icon className="w-6 h-6" strokeWidth={item.active ? 2.2 : 1.8} />
                            {item.label && (
                                <span className="text-[10px] font-bold leading-none">{item.label}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
});

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export default function HomeScreen() {
    return (
        <div
            dir="rtl"
            lang="ar"
            className="relative min-h-screen w-full bg-white text-gray-900 overflow-x-hidden"
        >
            <Header />
            <LocationBanner />
            <HeroBanner />
            <ServicesGrid />
            <MostRequested />
            <RepeatOrders />
            <BottomNav />
        </div>
    );
}