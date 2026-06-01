"use client";

import { useLanguage } from "@/providers";
import ModuleSection from "./ModulesSection";
import LatestStores from "./LatestStores";
import PopularStores from "./PopularStores";
import RecommendedStores from "./RecommendedStores";
import TopRatedStores from "./TopRatedStores";
import TopOfferNearMe from "./TopOfferNearMe";
import DiscountedStores from "./DiscountedStores";
import HeroSection from "./HeroSection";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Module } from "@/features/(modules)/modules/types/module.types";
import { HOME_CONSTANTS } from "../constants/home.constants";
import { useHome } from "../hooks/useHome";

export default function HomePage({
	modules,
	guestId,
}: {
	modules: Module[];
	guestId: string;
}) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { scrollToTop } = useHome(guestId);
	return (
		<div
			className="min-h-screen bg-gray-50 dark:bg-[#0d1117] font-sans antialiased"
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* ─── 1. HERO ──────────────────────────────────────────────────────── */}
			{/* Full-bleed dark cinematic banner */}
			<HeroSection />
			{/* ─── 2. CATEGORIES ───────────────────────────────────────────────── */}
			{/* Discovery strip — browse by type */}
			<div
				className="relative mt-4 py-6 sm:py-8"
				style={{
					background:
						"linear-gradient(180deg, rgba(16,185,129,0.04) 0%, transparent 100%)",
				}}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<ModuleSection modules={modules} />
				</div>
			</div>
			{/* ─── 4. STORE LISTINGS ────────────────────────────────────────────── */}
			{/* Stacked sections, unified container */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-28 space-y-2">
				{/* Thin divider helper */}
				<SectionDivider />
				<LatestStores />

				<SectionDivider />
				<PopularStores />

				<SectionDivider />
				<RecommendedStores />

				<SectionDivider />
				<TopRatedStores />

				<SectionDivider />
				<TopOfferNearMe />

				<SectionDivider />
				<DiscountedStores />
			</div>

			{/* ─── SCROLL TO TOP ────────────────────────────────────────────────── */}
			<AnimatePresence>
				{window.scrollY > HOME_CONSTANTS.SCROLL_TO_TOP_THRESHOLD && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ type: "spring", stiffness: 400, damping: 25 }}
						onClick={scrollToTop}
						className={`fixed ${isArabic ? "right-5" : "left-5"} bottom-6 z-50 h-12 w-12 rounded-xl shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95`}
						style={{
							background: "linear-gradient(135deg, #10b981, #059669)",
							boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
						}}
						aria-label={isArabic ? "الانتقال إلى الأعلى" : "Scroll to top"}
					>
						<ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}

/** Subtle emerald-tinted horizontal rule between sections */
function SectionDivider() {
	return (
		<div
			className="h-px w-full my-1"
			style={{
				background:
					"linear-gradient(90deg, transparent, rgba(16,185,129,0.12) 30%, rgba(16,185,129,0.12) 70%, transparent)",
			}}
		/>
	);
}