"use client";

import { useLanguage } from "@/providers";
import CategoriesSection from "./CategoriesSection";
import DeliveryAddressHero from "./DeliveryAddressHero";
import LatestStores from "./LatestStores";
import PopularStores from "./PopularStores";
import RecommendedStores from "./RecommendedStores";
import TopRatedStores from "./TopRatedStores";
import TopOfferNearMe from "./TopOfferNearMe";
import DiscountedStores from "./DiscountedStores";
import HeroSection from "./HeroSection";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHomePage } from "../hooks/useHomePage";
import { ZoneDataModule } from "@/features/categories/types/module.types";

export default function HomePage({
	modules,
	guestId,
	token,
}: {
	modules: ZoneDataModule[];
	guestId: string;
	token: string;
}) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { showScrollToTop, handleDeliveryAddressChange, scrollToTop } = useHomePage();

	const getGuestId = async () => {
		const response = await fetch("/api/auth/guest/request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-LANG": "ar",
			},
		});
		const data = await response.json();
		console.log("data", data);
	};

	console.log("guestId", guestId);
	if (!guestId) {
		getGuestId();
	}

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
					<CategoriesSection modules={modules} />
				</div>
			</div>

			{/* ─── 3. DELIVERY ADDRESS ─────────────────────────────────────────── */}
			{/* Pulled into the page flow with elevation, right after hero */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-2 relative z-20">
				<DeliveryAddressHero
					onAddressChange={handleDeliveryAddressChange}
					token={token as string}
				/>
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
				{showScrollToTop && (
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