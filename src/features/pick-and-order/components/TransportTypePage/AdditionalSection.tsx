"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers";
import { MapPin, Package, CheckCircle2, Car, CreditCard, Star, Shield } from "lucide-react";
import {
	HOW_IT_WORKS_DATA,
	WHY_CHOOSE_US_DATA,
	ADDITIONAL_SECTION_CONTENT,
	ANIMATION_VARIANTS,
	VIEWPORT_SETTINGS,
	ANIMATION_DURATION,
} from "@/features/pick-and-order/constants/pick-and-order.constants";

interface AdditionalSectionProps {
	transportType: string;
}

// Animation variants for this component
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const stepVariants = {
	hidden: { opacity: 0, y: 40, scale: 0.9 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.6,
		},
	},
};

// Reusable Step Card Component
interface StepCardProps {
	step: {
		icon: React.ComponentType<{ className?: string }>;
		number: string;
		title: string;
		description: string;
	};
	index: number;
	isLast: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, isLast }) => {
	const Icon = step.icon;

	return (
		<motion.div
			variants={stepVariants}
			whileHover={{ y: -12, scale: 1.03 }}
			className="relative group"
		>
			{/* Connector Line */}
			{!isLast && (
				<div className="hidden lg:block absolute top-20 left-full w-full h-0.5 -z-10">
					<div className="relative w-full h-full">
						<div className="absolute inset-0 bg-[#31A342]/30"></div>
						<motion.div
							className="absolute inset-0 bg-[#31A342]"
							initial={{ scaleX: 0 }}
							whileInView={{ scaleX: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: index * 0.2 }}
							style={{ transformOrigin: "left" }}
						/>
						<motion.div
							className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#31A342] rounded-full shadow-lg"
							initial={{ scale: 0 }}
							whileInView={{ scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: 0.8 + index * 0.2 }}
						/>
					</div>
				</div>
			)}

			{/* Step Card */}
			<div className="relative h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
				<div className="absolute inset-0 bg-[#31A342]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

				<div className="relative flex flex-col items-center text-center">
					{/* Step Number */}
					<div className="text-[#31A342] mb-6 font-extrabold text-4xl lg:text-5xl">
						{step.number}
					</div>

					{/* Icon Container */}
					<motion.div
						className="p-5 bg-[#31A342] rounded-2xl mb-6 shadow-lg"
						whileHover={{ scale: 1.1, rotate: 5 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<Icon className="h-10 w-10 text-white" />
					</motion.div>

					{/* Content */}
					<h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg lg:text-xl">
						{step.title}
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm lg:text-base">
						{step.description}
					</p>
				</div>

				{/* Border glow on hover */}
				<div className="absolute inset-0 rounded-3xl bg-[#31A342]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
			</div>
		</motion.div>
	);
};

// Reusable Why Choose Card Component
interface WhyChooseCardProps {
	item: {
		icon: React.ComponentType<{ className?: string }>;
		title: string;
		description: string;
	};
	index: number;
}

const WhyChooseCard: React.FC<WhyChooseCardProps> = ({ item, index }) => {
	const Icon = item.icon;

	return (
		<motion.div
			variants={stepVariants}
			whileHover={{ y: -12, scale: 1.02 }}
			className="group relative"
		>
			<div className="relative h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
				<div className="absolute inset-0 bg-[#31A342]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

				<div className="relative flex flex-col items-center text-center">
					{/* Icon with pulse */}
					<motion.div
						className="relative p-5 bg-[#31A342] rounded-2xl mb-6 shadow-lg"
						whileHover={{ scale: 1.1, rotate: 5 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<Icon className="h-10 w-10 text-white" />
						<motion.div
							className="absolute inset-0 bg-[#31A342] rounded-2xl"
							animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
							transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
						/>
					</motion.div>

					<h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg lg:text-xl">
						{item.title}
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm lg:text-base">
						{item.description}
					</p>

					{/* Hover indicator */}
					<div className="mt-6 w-12 h-1 bg-[#31A342] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				{/* Border glow */}
				<div className="absolute inset-0 rounded-3xl bg-[#31A342]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
			</div>
		</motion.div>
	);
};

function AdditionalSection({ transportType }: AdditionalSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	// Icon mapping
	const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
		Car,
		MapPin,
		CreditCard,
		Package,
		Star,
		CheckCircle2,
		Shield,
	};

	// Transform How It Works data
	const steps = useMemo(
		() =>
			HOW_IT_WORKS_DATA.map((step) => ({
				icon: iconMap[step.iconName],
				number: step.number,
				title: isArabic ? step.title.ar : step.title.en,
				description: isArabic ? step.description.ar : step.description.en,
			})),
		[isArabic]
	);

	// Transform Why Choose Us data
	const whyChooseItems = useMemo(
		() =>
			WHY_CHOOSE_US_DATA.map((item) => ({
				icon: iconMap[item.iconName],
				title: isArabic ? item.title.ar : item.title.en,
				description: isArabic ? item.description.ar : item.description.en,
			})),
		[isArabic]
	);

	// Section content
	const howItWorksContent = useMemo(
		() => ({
			title: isArabic
				? ADDITIONAL_SECTION_CONTENT.howItWorks.title.ar
				: ADDITIONAL_SECTION_CONTENT.howItWorks.title.en,
			subtitle: isArabic
				? ADDITIONAL_SECTION_CONTENT.howItWorks.subtitle.ar
				: ADDITIONAL_SECTION_CONTENT.howItWorks.subtitle.en,
		}),
		[isArabic]
	);

	const whyChooseContent = useMemo(
		() => ({
			title: isArabic
				? ADDITIONAL_SECTION_CONTENT.whyChooseUs.title.ar
				: ADDITIONAL_SECTION_CONTENT.whyChooseUs.title.en,
			subtitle: isArabic
				? ADDITIONAL_SECTION_CONTENT.whyChooseUs.subtitle.ar
				: ADDITIONAL_SECTION_CONTENT.whyChooseUs.subtitle.en,
		}),
		[isArabic]
	);

	return (
		<>
			{/* How It Works Section */}
			<section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
				{/* Background decorative elements */}
				<div className="absolute top-0 right-0 w-96 h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] bg-[#31A342]/5 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-96 h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] bg-[#FA9D2B]/5 rounded-full blur-3xl" />

				<div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={VIEWPORT_SETTINGS}
						transition={{ duration: ANIMATION_DURATION.normal }}
						className="text-center mb-16"
					>
						<h2 className="font-extrabold text-gray-900 dark:text-gray-100 mb-4 text-3xl sm:text-4xl lg:text-5xl">
							{howItWorksContent.title}
						</h2>
						<p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
							{howItWorksContent.subtitle}
						</p>
					</motion.div>

					{/* Steps Grid */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={VIEWPORT_SETTINGS}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 relative"
					>
						{steps.map((step, index) => (
							<StepCard
								key={step.number}
								step={step}
								index={index}
								isLast={index === steps.length - 1}
							/>
						))}
					</motion.div>
				</div>
			</section>

			{/* Why Choose Us Section */}
			<section className="relative bg-white dark:bg-gray-900 py-20 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
				{/* Background pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] lg:bg-[size:32px_32px]" />

				<div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={VIEWPORT_SETTINGS}
						transition={{ duration: ANIMATION_DURATION.normal }}
						className="text-center mb-16 lg:mb-20"
					>
						<h2 className="font-extrabold text-gray-900 dark:text-gray-100 mb-4 text-3xl sm:text-4xl lg:text-5xl">
							{whyChooseContent.title}
						</h2>
						<p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-base sm:text-lg">
							{whyChooseContent.subtitle}
						</p>
					</motion.div>

					{/* Why Choose Items Grid */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={VIEWPORT_SETTINGS}
						className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12"
					>
						{whyChooseItems.map((item, index) => (
							<WhyChooseCard key={index} item={item} index={index} />
						))}
					</motion.div>
				</div>
			</section>
		</>
	);
}

const AdditionalSectionMemoized = React.memo(AdditionalSection);
AdditionalSectionMemoized.displayName = "AdditionalSection";

export default AdditionalSectionMemoized;
