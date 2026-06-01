"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
	ArrowRight,
	BriefcaseBusiness,
	ChevronDown,
	Clock,
	CreditCard,
	Headphones,
	MapPin,
	Package,
	Rocket,
	Shield,
	Smartphone,
	Sparkles,
	Star,
	Store,
	Truck,
	UsersRound,
	Zap,
	Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CountUp from "react-countup";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useLanguage } from "@/providers";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
interface SectionProps {
	isArabic: boolean;
	t: (key: string) => string;
}

interface TileProps {
	title: string;
	desc: string;
	variant?: "alt" | "default";
	Icon?: React.ComponentType<any>;
	isArabic: boolean;
	t: (key: string) => string;
}

/* ------------------------------------------------------------------ */
/*  ANIMATION UTILITIES                                                */
/* ------------------------------------------------------------------ */
const fadeInUp = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0 },
};

const slideIn = (from: "left" | "right", isArabic: boolean) => ({
	hidden: {
		opacity: 0,
		x: (from === "left" ? -1 : 1) * (isArabic ? -50 : 50),
	},
	visible: { opacity: 1, x: 0 },
});

/* ------------------------------------------------------------------ */
/*  SHARED COMPONENTS                                                  */
/* ------------------------------------------------------------------ */

/** Animated counter with intersection observer */
const AnimatedCounter = React.memo(function AnimatedCounter({
	end,
	suffix = "",
	prefix = "",
	duration = 2,
}: {
	end: number;
	suffix?: string;
	prefix?: string;
	duration?: number;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<span ref={ref}>
			{isInView && (
				<CountUp
					start={0}
					end={end}
					duration={duration}
					suffix={suffix}
					prefix={prefix}
				/>
			)}
		</span>
	);
});

/** App store download badge */
const AppStoreButton = React.memo(function AppStoreButton({
	store,
}: {
	store: "apple" | "google" | "huawei";
}) {
	const configs = {
		apple: {
			url: "https://apps.apple.com/us/app/%D8%B4%D9%84%D9%87/id6739772273",
			label: "App Store",
			image: "/appstore.png",
		},
		google: {
			url: "https://play.google.com/store/apps/details?id=com.food.shala",
			label: "Google Play",
			image: "/googleplay.png",
		},
		huawei: {
			url: "https://appgallery.huawei.com",
			label: "AppGallery",
			image: "/appgalary.png",
		},
	};
	const cfg = configs[store];

	return (
		<a
			href={cfg.url}
			target="_blank"
			rel="noopener noreferrer"
			className="block h-12 w-36 sm:h-14 sm:w-40 overflow-hidden rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
			aria-label={`Download from ${cfg.label}`}
		>
			<Image
				src={cfg.image}
				alt={cfg.label}
				width={160}
				height={56}
				quality={90}
				className="h-full w-full object-contain dark:opacity-90"
				sizes="160px"
			/>
		</a>
	);
});

/** Floating card with reduced-motion support */
const FloatingCard = React.memo(function FloatingCard({
	children,
	className = "",
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	const reduced = useReducedMotion();
	if (reduced) {
		return (
			<div
				className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 ${className}`}
			>
				{children}
			</div>
		);
	}
	return (
		<motion.div
			animate={{ y: [0, -10, 0] }}
			transition={{
				repeat: Infinity,
				duration: 3,
				delay,
				ease: "easeInOut",
			}}
			className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 ${className}`}
		>
			{children}
		</motion.div>
	);
});

/** Reusable tile for partner/driver/investor/worker */
const Tile = React.memo(function Tile({
	title,
	desc,
	variant = "default",
	Icon,
	isArabic,
	t,
}: TileProps) {
	const isAlt = variant === "alt";
	return (
		<article
			className={`rounded-2xl p-6 sm:p-8 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isAlt
				? "bg-white dark:bg-gray-800"
				: "bg-gray-100 dark:bg-gray-700/50"
				}`}
		>
			<div
				className={`grid h-full items-start gap-5 ${isArabic ? "grid-cols-[auto_1fr]" : "grid-cols-[1fr_auto]"
					}`}
			>
				<div
					className={`relative h-full w-12 rounded-xl bg-emerald-500 dark:bg-emerald-600 ${isArabic ? "" : "order-2"
						}`}
				>
					{Icon && (
						<div className="absolute top-4 left-1/2 -translate-x-1/2">
							<Icon className="h-6 w-6 text-white" />
						</div>
					)}
				</div>
				<div className={`${isArabic ? "text-right" : "text-left order-1"}`}>
					<h4 className="mb-2 text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
						{title}
					</h4>
					<p className="mb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
						{desc}
					</p>
					<div className="inline-flex items-center gap-2">
						<span className="h-3 w-3 rounded-full bg-amber-500 dark:bg-amber-400" />
						<span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
							{t("landing.tiles.registerNow")}
						</span>
					</div>
				</div>
			</div>
		</article>
	);
});

/** Lazy-load wrapper using IntersectionObserver (framer-motion) */
function LazySection({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "200px" });
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (isInView && !loaded) setLoaded(true);
	}, [isInView, loaded]);

	return (
		<div ref={ref} className={className}>
			{loaded ? (
				children
			) : (
				<div className="py-32 flex items-center justify-center">
					<div className="animate-pulse text-gray-400 text-sm">
						Loading...
					</div>
				</div>
			)}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  SECTIONS                                                           */
/* ------------------------------------------------------------------ */

/* ------------------------------ HERO ------------------------------ */
const HeroSection = React.memo(function HeroSection({
	isArabic,
	t,
}: SectionProps) {
	const reduced = useReducedMotion();

	return (
		<section
			className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden w-full"
			aria-labelledby="hero-heading"
		>
			{/* Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
				<div className="absolute top-20 -left-20 sm:-left-40 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-green-400/20 rounded-full blur-3xl animate-blob" />
			</div>

			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 w-full overflow-x-hidden">
				<div className="max-w-6xl lg:max-w-[95%] xl:max-w-[98%] 2xl:max-w-[1800px] mx-auto text-center w-full">
					{/* Badge */}
					<motion.div
						initial={reduced ? "visible" : "hidden"}
						whileInView="visible"
						viewport={{ once: true }}
						variants={fadeInUp}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 mb-6 sm:mb-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200 dark:border-green-800 shadow-lg"
					>
						<div className="relative">
							<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
							<div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
						</div>
						<Sparkles className="w-4 h-4 text-green-600" />
						<span className="text-xs sm:text-sm font-bold whitespace-nowrap">
							{isArabic ? " أكثر من 2 مليون طلب" : " 2M+ Orders Delivered"}
						</span>
					</motion.div>

					{/* Headline */}
					<motion.h1
						id="hero-heading"
						initial={reduced ? "visible" : "hidden"}
						whileInView="visible"
						viewport={{ once: true }}
						variants={fadeInUp}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 leading-[1.1] tracking-tight px-2"
					>
						<span className="text-gray-900 dark:text-white">
							{isArabic ? "مع " : "With "}
						</span>
						<span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent mx-2">
							{t("company.name")}
						</span>
						<span className="block text-gray-900 dark:text-white mt-1 sm:mt-2">
							{t("landing.hero.title")}
						</span>
					</motion.h1>

					{/* Subtitle */}
					<motion.p
						initial={reduced ? "visible" : "hidden"}
						whileInView="visible"
						viewport={{ once: true }}
						variants={fadeInUp}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-4"
					>
						{t("landing.hero.subtitle")}
					</motion.p>

					{/* CTAs */}
					<motion.div
						initial={reduced ? "visible" : "hidden"}
						whileInView="visible"
						viewport={{ once: true }}
						variants={fadeInUp}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4"
					>
						<Link
							href="/home"
							className="group relative px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden min-h-[44px] flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
							aria-label={isArabic ? "تصفح الآن" : "Browse now"}
						>
							<div
								className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ${isArabic
									? "translate-x-[200%] group-hover:translate-x-[-200%]"
									: "translate-x-[-200%] group-hover:translate-x-[200%]"
									}`}
							/>
							<span
								className={`relative z-10 flex items-center gap-2 sm:gap-3 justify-center ${isArabic ? "flex-row-reverse" : ""
									}`}
							>
								<Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
								<span className="whitespace-nowrap">
									{t("landing.hero.browseButton")}
								</span>
								<ArrowRight
									className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isArabic
										? "rotate-180 group-hover:-translate-x-2"
										: "group-hover:translate-x-2"
										}`}
								/>
							</span>
						</Link>
					</motion.div>

					{/* Trust Indicators */}
					<motion.div
						initial={reduced ? "visible" : "hidden"}
						whileInView="visible"
						viewport={{ once: true }}
						variants={fadeInUp}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 px-4"
					>
						<div
							className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""
								}`}
						>
							<div
								className={`flex -space-x-2 sm:-space-x-3 ${isArabic ? "direction-rtl" : ""
									}`}
							>
								{[1, 2, 3, 4, 5].map((i) => (
									<div
										key={i}
										className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold"
									>
										{String.fromCharCode(64 + i)}
									</div>
								))}
							</div>
							<div
								className={`text-xs sm:text-sm ${isArabic ? "text-right" : "text-left"
									}`}
							>
								<p className="font-bold text-gray-900 dark:text-white">
									50,000+
								</p>
								<p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
									{isArabic ? "مستخدم نشط" : "Active Users"}
								</p>
							</div>
						</div>

						<div
							className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""
								}`}
						>
							<div className="flex gap-0.5 sm:gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>
							<div
								className={`text-xs sm:text-sm ${isArabic ? "text-right" : "text-left"
									}`}
							>
								<p className="font-bold text-gray-900 dark:text-white">4.8/5</p>
								<p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
									10K+ {isArabic ? "تقييم" : "reviews"}
								</p>
							</div>
						</div>
					</motion.div>

					{/* Dashboard Mockup */}
					<motion.div
						initial={reduced ? "visible" : "hidden"}
						whileInView="visible"
						viewport={{ once: true }}
						variants={fadeInUp}
						transition={{ duration: 0.8, delay: 0.5 }}
						className="relative mt-12 sm:mt-16 md:mt-20 px-2 sm:px-4 lg:px-4 xl:px-6 2xl:px-8 w-full overflow-x-hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-3xl opacity-20" />
						<div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-white/20 dark:border-gray-700/20 shadow-2xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/8] xl:aspect-[16/5] 2xl:aspect-[16/4] w-full max-w-full lg:max-w-[98%] xl:max-w-[99%] 2xl:max-w-[1800px] mx-auto">
							<Image
								src="https://cdn2.hubspot.net/hubfs/318836/online-store-small-business-blog.png"
								alt="Shella Platform"
								width={1920}
								height={600}
								priority
								quality={90}
								className="w-full h-full object-cover"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 98vw, (max-width: 1536px) 99vw, 1800px"
								placeholder="blur"
								blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
							/>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Scroll Indicator */}
			{!reduced && (
				<motion.div
					animate={{ y: [0, 12, 0] }}
					transition={{ repeat: Infinity, duration: 2 }}
					className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
				>
					<ChevronDown className="w-6 h-6 text-gray-400" />
				</motion.div>
			)}
		</section>
	);
});

/* --------------------------- MOBILE APP --------------------------- */
const MobileAppSection = React.memo(function MobileAppSection({
	isArabic,
	t,
}: SectionProps) {
	const reduced = useReducedMotion();

	const features = [
		{
			icon: Zap,
			title: isArabic ? "طلب في ثوانٍ" : "Order in Seconds",
			color: "from-yellow-500 to-orange-500",
		},
		{
			icon: MapPin,
			title: isArabic ? "تتبع مباشر" : "Live Tracking",
			color: "from-green-500 to-emerald-500",
		},
		{
			icon: CreditCard,
			title: isArabic ? "دفع آمن" : "Secure Payments",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Bell,
			title: isArabic ? "إشعارات فورية" : "Instant Notifications",
			color: "from-purple-500 to-pink-500",
		},
	];

	return (
		<section
			className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden w-full"
			aria-labelledby="mobile-app-heading"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
				<div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
					{/* Content */}
					<motion.div
						initial={reduced ? "visible" : "hidden"}
						whileInView="visible"
						viewport={{ once: true }}
						variants={slideIn("right", isArabic)}
						transition={{ duration: 0.8 }}
						className={isArabic ? "lg:order-1" : "lg:order-2"}
					>
						<div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30">
							<Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							<span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
								{isArabic ? "📱 التطبيق المحمول" : "📱 Mobile App"}
							</span>
						</div>

						<h2
							id="mobile-app-heading"
							className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6"
						>
							<span className="text-gray-900 dark:text-white block mb-1 sm:mb-2">
								{t("landing.mobileApp.title")}
							</span>
							<span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent block">
								{isArabic ? "في جيبك دائماً" : "Always in Your Pocket"}
							</span>
						</h2>

						<p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10">
							{t("landing.mobileApp.subtitle")}
						</p>

						{/* Features */}
						<div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
							{features.map((feature, i) => (
								<motion.div
									key={i}
									initial={reduced ? "visible" : "hidden"}
									whileInView="visible"
									viewport={{ once: true }}
									variants={slideIn("left", isArabic)}
									transition={{ duration: 0.6, delay: i * 0.1 }}
									className="flex items-center gap-3 sm:gap-4"
								>
									<div
										className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg flex-shrink-0`}
									>
										<feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
									</div>
									<h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
										{feature.title}
									</h4>
								</motion.div>
							))}
						</div>

						{/* Store Buttons */}
						<div className="flex flex-wrap gap-3 sm:gap-4">
							<AppStoreButton store="apple" />
							<AppStoreButton store="google" />
							<AppStoreButton store="huawei" />
						</div>
					</motion.div>

					{/* Phone Mockup */}
					<motion.div
						initial={reduced ? "visible" : "hidden"}
						whileInView="visible"
						viewport={{ once: true }}
						variants={slideIn("left", isArabic)}
						transition={{ duration: 0.8 }}
						className={`relative ${isArabic ? "lg:order-2" : "lg:order-1"
							} mt-8 lg:mt-0 flex items-center justify-center`}
					>
						<div className="relative hidden lg:block w-full max-w-[400px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[480px] xl:max-w-[540px] 2xl:max-w-[600px] aspect-[5/8] mx-auto">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20" />

							<motion.div
								animate={reduced ? {} : { y: [0, -20, 0] }}
								transition={{ repeat: Infinity, duration: 6 }}
								className="relative w-full h-full"
							>
								<Image
									src="/imagemobile.png"
									alt={isArabic ? "تطبيق شلة" : "Shella App"}
									width={600}
									height={960}
									quality={90}
									className="w-full h-full object-contain drop-shadow-2xl"
									sizes="(max-width: 640px) 400px, (max-width: 768px) 420px, (max-width: 1024px) 460px, (max-width: 1280px) 480px, (max-width: 1536px) 540px, 600px"
								/>
							</motion.div>

							<FloatingCard
								className={`absolute top-20 hidden xl:block ${isArabic ? "right-0 xl:-right-16" : "left-0 xl:-left-16"
									}`}
								delay={0.5}
							>
								<Package className="w-6 h-6 text-green-500 mb-2" />
								<p className="text-xs font-bold text-gray-900 dark:text-white">
									{isArabic ? "تم التوصيل!" : "Delivered!"}
								</p>
							</FloatingCard>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
});

/* --------------------------- TILES --------------------------- */
const TilesSection = React.memo(function TilesSection({
	isArabic,
	t,
}: SectionProps) {
	const tiles = [
		{
			href: "/partner",
			variant: "default" as const,
			title: t("landing.tiles.partner.title"),
			desc: t("landing.tiles.partner.desc"),
			Icon: Store,
		},
		{
			href: "/driver",
			variant: "alt" as const,
			title: t("landing.tiles.driver.title"),
			desc: t("landing.tiles.driver.desc"),
			Icon: Truck,
		},
		{
			href: "/investor",
			variant: "alt" as const,
			title: t("landing.tiles.investor.title"),
			desc: t("landing.tiles.investor.desc"),
			Icon: UsersRound,
		},
		{
			href: "/worker",
			variant: "default" as const,
			title: t("landing.tiles.worker.title"),
			desc: t("landing.tiles.worker.desc"),
			Icon: BriefcaseBusiness,
		},
	];

	return (
		<section className="space-y-6 bg-[#EAF6EC] dark:bg-gray-800/50">
			{/* Qaydha Feature */}
			<div className="rounded-2xl p-6 sm:p-10 shadow-lg dark:shadow-gray-900/50 bg-white dark:bg-gray-800">
				<div
					className={`grid items-center gap-5 md:grid-cols-2 ${isArabic ? "" : "md:grid-flow-col-dense"
						}`}
				>
					<div
						className={`gap-7 text-center ${isArabic ? "md:text-right" : "md:text-left md:col-start-2"
							}`}
					>
						<h3 className="mb-2 text-3xl sm:text-4xl md:text-5xl font-semibold text-[#34A853] dark:text-green-400">
							{t("landing.qaydha.title")}
						</h3>
						<p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 md:text-3xl">
							{t("landing.qaydha.subtitle")}
						</p>
						<p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
							{t("landing.qaydha.description")}
						</p>

						<div className="flex flex-col sm:flex-row gap-3 mt-6">
							<Link
								href="/kaidha"
								className="inline-flex items-center justify-center rounded-full bg-[#2D943C] dark:bg-green-600 px-8 py-3 text-white shadow-xl transition-all duration-300 hover:bg-[#258a35] dark:hover:bg-green-700 hover:shadow-2xl"
							>
								{t("landing.qaydha.registerButton")}
							</Link>

							<a
								href="https://www.qaydha.com/"
								className="inline-flex items-center justify-center rounded-full bg-[#2D943C] dark:bg-green-600 px-8 py-3 text-white shadow-xl transition-all duration-300 hover:bg-[#258a35] dark:hover:bg-green-700 hover:shadow-2xl"
								target="_blank"
								rel="noopener noreferrer"
							>
								{t("landing.qaydha.learnMoreButton")}
							</a>
						</div>
					</div>
					<img
						src="date.png"
						alt={isArabic ? "تقويم" : "Calendar"}
						className={`h-auto w-full transition-all duration-300 dark:opacity-80 ${isArabic ? "" : "md:col-start-1"
							}`}
						loading="lazy"
					/>
				</div>
			</div>

			{/* Tiles Grid */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{tiles.slice(0, 2).map((tile) => (
					<Link key={tile.href} href={tile.href} className="block cursor-pointer">
						<Tile {...tile} isArabic={isArabic} t={t} />
					</Link>
				))}
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{tiles.slice(2, 4).map((tile) => (
					<Link key={tile.href} href={tile.href} className="block cursor-pointer">
						<Tile {...tile} isArabic={isArabic} t={t} />
					</Link>
				))}
			</div>
		</section>
	);
});

/* --------------------------- TESTIMONIALS --------------------------- */
const TestimonialsSection = React.memo(function TestimonialsSection({
	isArabic,
}: SectionProps) {
	const testimonials = [
		{
			name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
			role: isArabic ? "صاحب متجر" : "Store Owner",
			text: isArabic
				? "منصة رائعة ساعدتني في توسيع أعمالي بشكل كبير"
				: "An amazing platform that helped me expand my business significantly",
		},
		{
			name: isArabic ? "سارة علي" : "Sara Ali",
			role: isArabic ? "مستثمرة" : "Investor",
			text: isArabic
				? "أفضل تجربة استثمارية مررت بها، عوائد ممتازة ودعم مستمر"
				: "The best investment experience I've had, excellent returns and continuous support",
		},
		{
			name: isArabic ? "خالد عبدالله" : "Khaled Abdullah",
			role: isArabic ? "سائق توصيل" : "Delivery Driver",
			text: isArabic
				? "دخل ممتاز ومرن، أنصح الجميع بالانضمام"
				: "Excellent and flexible income, I recommend everyone to join",
		},
	];

	return (
		<section className="py-16 sm:py-24 md:py-32 bg-gray-50 dark:bg-gray-800 overflow-hidden w-full">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12 sm:mb-16"
				>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
						{isArabic ? "ماذا يقول عملاؤنا" : "What Our Customers Say"}
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						{isArabic
							? "آلاف العملاء السعداء حول العالم"
							: "Thousands of happy customers worldwide"}
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
					{testimonials.map((item, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: i * 0.15 }}
							className="bg-white dark:bg-gray-700 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow"
						>
							<div className="flex gap-1 mb-4">
								{[...Array(5)].map((_, j) => (
									<Star
										key={j}
										className="w-5 h-5 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>
							<p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
								&ldquo;{item.text}&rdquo;
							</p>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
									{item.name.charAt(0)}
								</div>
								<div>
									<p className="font-bold text-gray-900 dark:text-white">
										{item.name}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{item.role}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
});

/* --------------------------- CTA --------------------------- */
const CTASection = React.memo(function CTASection({
	isArabic,
}: SectionProps) {
	return (
		<section
			className="py-16 sm:py-24 md:py-32 bg-gradient-to-br from-green-600 to-emerald-600 relative overflow-hidden w-full"
			aria-labelledby="cta-heading"
		>
			<div className="absolute inset-0 opacity-10 overflow-hidden">
				<div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl" />
			</div>

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center w-full overflow-x-hidden">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<h2
						id="cta-heading"
						className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6"
					>
						{isArabic ? "جاهز للبدء؟" : "Ready to Get Started?"}
					</h2>
					<p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
						{isArabic
							? "انضم إلى آلاف العملاء السعداء واحصل على توصيل سريع وموثوق"
							: "Join thousands of happy customers and get fast, reliable delivery"}
					</p>

					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12">
						<Link
							href="/home"
							className="px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-white text-green-600 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all flex items-center justify-center gap-2 min-h-[44px]"
							aria-label={isArabic ? "ابدأ الآن" : "Get Started Now"}
						>
							<span className="whitespace-nowrap">
								{isArabic ? "ابدأ الآن" : "Get Started Now"}
							</span>
							<ArrowRight
								className={`w-4 h-4 sm:w-5 sm:h-5 ${isArabic ? "rotate-180" : ""
									}`}
							/>
						</Link>
						<Link
							href="/profile/support"
							className="px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-transparent border-2 border-white text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-white hover:text-green-600 transition-all min-h-[44px] flex items-center justify-center"
							aria-label={isArabic ? "تواصل معنا" : "Contact Us"}
						>
							<span className="whitespace-nowrap">
								{isArabic ? "تواصل معنا" : "Contact Us"}
							</span>
						</Link>
					</div>

					<div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-white/80 text-sm sm:text-base">
						<div className="flex items-center gap-2">
							<Shield className="w-4 h-4 sm:w-5 sm:h-5" />
							<span>{isArabic ? "آمن 100%" : "100% Secure"}</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 sm:w-5 sm:h-5" />
							<span>{isArabic ? "توصيل سريع" : "Fast Delivery"}</span>
						</div>
						<div className="flex items-center gap-2">
							<Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
							<span>{isArabic ? "دعم 24/7" : "24/7 Support"}</span>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
});

/* ------------------------------------------------------------------ */
/*  MAIN EXPORT                                                        */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";

	return (
		<div
			className="font-tajawal flex min-h-screen w-full flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200 overflow-x-hidden"
			dir={direction}
		>
			<SpeedInsights />
			<main className="flex-grow overflow-x-hidden w-full" id="main-content">
				<div className="mx-auto max-w-[1800px] w-full overflow-x-hidden">
					<HeroSection isArabic={isArabic} t={t} />
					<MobileAppSection isArabic={isArabic} t={t} />
					<TilesSection isArabic={isArabic} t={t} />

					{/* Lazy-loaded below-fold sections */}
					<LazySection>
						<TestimonialsSection isArabic={isArabic} t={t} />
					</LazySection>

					<LazySection>
						<CTASection isArabic={isArabic} t={t} />
					</LazySection>
				</div>
			</main>
		</div>
	);
}