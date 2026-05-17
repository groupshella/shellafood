"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Truck } from "lucide-react";
import { useLanguage } from "@/providers";
import AddressSelector from "./AddressSelector";
import HeroBackground from "./HeroBackground";
import TrustBadges from "./TrustBadges";

interface DeliveryAddressHeroProps {
	onAddressChange?: (address: any) => void;
	token: string;
}

export default function DeliveryAddressHero({ onAddressChange, token }: DeliveryAddressHeroProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section className="relative overflow-hidden">
			<HeroBackground />

			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-12 lg:py-16 xl:grid-cols-[1.05fr_minmax(0,480px)] xl:gap-16">
					{/* Copy column */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
						className="text-center lg:text-start"
					>
						<motion.span
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.1 }}
							className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm backdrop-blur-sm dark:border-emerald-800/50 dark:bg-gray-900/60 dark:text-emerald-300 sm:text-sm"
						>
							<Sparkles className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
							{isArabic ? "توصيل سريع في منطقتك" : "Fast delivery in your area"}
						</motion.span>

						<h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[3.25rem]">
							<span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-green-400 dark:to-teal-400">
								{isArabic ? "طعامك المفضل" : "Your favorite food"}
							</span>
							<br />
							<span className="text-gray-900 dark:text-gray-50">
								{isArabic ? "إلى باب منزلك" : "delivered to your door"}
							</span>
						</h1>

						<p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base lg:mx-0 lg:max-w-lg">
							{isArabic
								? "اكتشف أفضل المطاعم والمتاجر بالقرب منك، وحدّد عنوان التوصيل لبدء الطلب في دقائق."
								: "Discover top restaurants and stores near you. Set your delivery address and start ordering in minutes."}
						</p>

						<div className="mt-6 hidden lg:block">
							<TrustBadges />
						</div>

						<p className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500 lg:hidden">
							<Truck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
							{isArabic ? "أدخل عنوانك أدناه للبدء" : "Enter your address below to get started"}
						</p>
					</motion.div>

					{/* Address card column */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
						className="w-full"
					>
						<div className="rounded-2xl border border-gray-200/80 bg-white/90 p-4 shadow-[0_8px_40px_-12px_rgba(16,185,129,0.25)] backdrop-blur-xl dark:border-gray-700/60 dark:bg-gray-900/85 sm:rounded-3xl sm:p-5 md:p-6">
							<AddressSelector onAddressChange={onAddressChange} token={token} />
						</div>
					</motion.div>
				</div>

				<div className="pb-10 sm:pb-12 lg:hidden">
					<TrustBadges />
				</div>
			</div>
		</section>
	);
}
