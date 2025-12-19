"use client";

import { useLanguage } from "@/providers";
import { Store, Product } from "@/shared/components";
import DeliveryAddressHero from "./DeliveryAddressHero";
import PromotionalBanner from "./PromotionalBanner";
import OffersStrip from "./OffersStrip";
import CategoriesSection from "./CategoriesSection";
import PreviouslyOrderedStores from "./PreviouslyOrderedStores";
import NearbyStores from "./NearbyStores";
import Discounts from "./Discounts";
import PopularStores from "./PopularStores";
import { TEST_STORES, TEST_CATEGORIES, TEST_PRODUCTS } from "@/lib/data/categories/testData";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceRequestsSection from "./ServiceRequestsSection";	
import { useHomePage } from "../hooks/useHomePage";
import { startTransition, useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ZoneDataModule } from "@/features/categories/types/module.types";

export default function HomePage({ modules }: { modules: ZoneDataModule[] }) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const {  showScrollToTop, handleDeliveryAddressChange, scrollToTop } = useHomePage();

	
	return (
		<div
			className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans antialiased"
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Hero Section with Address Selector */}
			<DeliveryAddressHero onAddressChange={handleDeliveryAddressChange} />

			{/* Main Content */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
				{/* Categories Section */}
				<CategoriesSection modules={modules} />
				{/* Promotional Banner */}
				<PromotionalBanner />
                {/* <ServiceRequestsSection /> */}
				{/* Offers Strip */}
				<OffersStrip />
				{/* Previously Ordered Stores */}
				<PreviouslyOrderedStores stores={TEST_STORES.slice(0, 5) as Store[]} />
				{/* Nearby Stores */}
				<NearbyStores stores={TEST_STORES.slice(0, 4) as Store[]} />
				{/* Discounts */}
				<Discounts
					products={TEST_PRODUCTS.filter(
						(p) => p.badge || (p.originalPrice && p.originalPrice > (p.price || 0))
					).slice(0, 8) as Product[]}
				/>

				{/* Popular Stores */}
				<PopularStores stores={TEST_STORES.slice(0, 4) as Store[]} />	
			</div>

			{/* Scroll to Top Button - Square like cart button */}
			<AnimatePresence>
				{showScrollToTop && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						onClick={scrollToTop}
						className={`fixed ${isArabic ? "right-4" : "left-4"} bottom-6 z-50 w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-2xl flex items-center justify-center active:scale-95 transition-transform hover:shadow-green-500/50`}
						aria-label={isArabic ? 'الانتقال إلى الأعلى' : 'Scroll to top'}
					>
						<ArrowUp className="w-6 h-6 text-white" />
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}
