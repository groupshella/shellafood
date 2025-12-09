"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers";
import { 
	Star, 
	CheckCircle, 
	Clock, 
	Shield, 
	ArrowLeft, 
	ArrowRight,
	ChevronDown,
	ChevronUp,
	Calendar,
	MapPin,
	Award,
	CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIndividualService } from "../../hooks/useIndividualService";

/**
 * Individual Service Page Component
 * Formal, editorial-style layout with flowing content and minimal card styling
 * Professional service page inspired by premium editorial design
 */
const IndividualServicePage: React.FC<{ serviceSlug: string; serviceTypeSlug: string }> = ({ 
	serviceSlug, 
	serviceTypeSlug 
}) => {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const ArrowIcon = isArabic ? ArrowRight : ArrowLeft;

	const {
		openFAQIndex,
		selectedImageIndex,
		setSelectedImageIndex,
		serviceData,
		isLoading,
		title,
		description,
		features,
		serviceDetails,
		rating,
		galleryImages,
		reviews,
		faqs,
		priceText,
		startsFromText,
		priceIncludesText,
		reviewsText,
		bookNowTitle,
		chooseTechnicianText,
		statusValue,
		responseTimeValue,
		guaranteeValue,
		bookingPath,
		scrollToBooking,
		toggleFAQ,
		handleBookingMouseEnter,
	} = useIndividualService(serviceSlug, serviceTypeSlug, isArabic);

	// Show loading state - must be after all hooks
	if (isLoading || !serviceData) {
		return (
			<div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center" dir={isArabic ? "rtl" : "ltr"}>
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-white dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Hero Section - Full Width */}
			<div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
				<Image
					src={serviceData?.heroImage || "/serveme-hero.png"}
					alt={title || ""}
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				{/* Subtle Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
				
				{/* Hero Content */}
				<div className="absolute inset-0 flex items-center">
					<div className="w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-0">
						<div className={`max-w-3xl ${isArabic ? "text-right ml-auto lg:pr-16" : "text-left lg:pl-16"}`}>
							<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
								{title}
							</h1>
							<p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light">
								{description}
							</p>
							
							{/* Trust Elements Inline */}
							<div className={`flex flex-wrap items-center gap-6 mb-8 text-white/80 `}>
								<div className="flex items-center  gap-2">
									<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
									<span className="text-sm font-medium">{serviceData?.rating} ({serviceData?.reviewsCount} {reviewsText})</span>
								</div>
								
								<div className="flex items-center gap-2">
									<Award className="w-5 h-5" />
									<span className="text-sm">{isArabic ? "5+ سنوات خبرة" : "5+ Years Experience"}</span>
								</div>
							</div>

							{/* CTA Button - Refined Style */}
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={scrollToBooking}
								className={`inline-flex items-center gap-3 bg-[#10b981] hover:bg-[#059669] text-white px-8 py-4 rounded-lg font-semibold text-base transition-colors duration-200 `}
							>
								<Calendar className="w-5 h-5" />
								<span>{chooseTechnicianText}</span>
								<ArrowIcon className="w-5 h-5" />
							</motion.button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content - Editorial Style */}
			<div className="w-full max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-0 py-12 sm:py-16 md:py-20">
				
				{/* Intro Paragraph - Full Width */}
				<div className="mb-16 sm:mb-20">
					<div className={`prose prose-lg max-w-none ${isArabic ? "text-right" : "text-left"}`}>
						<p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
							{isArabic 
								? "في عالم يتزايد فيه الاهتمام بالصحة والرفاهية، أصبحت خدمات الصيانة والتنظيف الاحترافية ضرورة لا يمكن تجاهلها. نحن نقدم حلولاً شاملة وموثوقة تلبي أعلى معايير الجودة والاحترافية، مما يضمن راحة بالك ورضاك التام."
								: "In a world where health and wellness are increasingly prioritized, professional maintenance and cleaning services have become essential. We provide comprehensive, reliable solutions that meet the highest standards of quality and professionalism, ensuring your complete peace of mind and satisfaction."
							}
						</p>
						<p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
							{isArabic
								? "مع فريق من الخبراء المدربين والمعدات الحديثة، نضمن لك تجربة استثنائية تبدأ من لحظة الحجز حتى إتمام الخدمة. نحن فخورون بخدمة آلاف العملاء الراضين في جميع أنحاء المملكة."
								: "With a team of trained experts and modern equipment, we guarantee an exceptional experience from the moment you book until service completion. We are proud to serve thousands of satisfied customers across the Kingdom."
							}
						</p>
					</div>
				</div>

				{/* Price & Rating - Inline, Not Card */}
				<div className={`mb-16 sm:mb-20 pb-12 border-b border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
					<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-6">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{startsFromText}</p>
							<div className="flex items-baseline gap-2">
								<span className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100">{serviceData?.priceStartsFrom}</span>
								<span className="text-xl text-gray-600 dark:text-gray-400">{priceText}</span>
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2">
								<Shield className="w-4 h-4 text-[#10b981]" />
								{priceIncludesText}
							</p>
						</div>
						<div className={`flex items-center gap-4 `}>
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-5 h-5 ${
											i < rating 
												? "text-yellow-400 fill-yellow-400" 
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							<div>
								<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{serviceData?.rating}</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">{serviceData?.reviewsCount} {reviewsText}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Why Choose Us - Clean Grid */}
				<section className="mb-16 sm:mb-20">
					<h2 className={`text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "لماذا تختارنا" : "Why Choose Us"}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
						{features?.filter(f => f.included).slice(0, 4).map((feature, index) => (
							<div
								key={index}
								className={`flex items-start gap-4 `}
							>
								<div className="flex-shrink-0 mt-1">
									<CheckCircle2 className="w-6 h-6 text-[#10b981]" />
								</div>
								<div className="flex-1">
									<p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed">{feature.text}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Gallery Section - Image Slider with Thumbnails */}
				<section className="mb-16 sm:mb-20">
				<h2 className={`text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "معرض أعمالنا" : "Our Work Gallery"}
					</h2>
					
					{/* Main Image Display */}
					<div className="relative mb-6 overflow-hidden bg-gray-100 rounded-lg">
						<AnimatePresence mode="wait">
							<motion.div
								key={selectedImageIndex}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.4 }}
								className="relative w-full h-64 sm:h-80 md:h-96"
							>
								<Image
									src={galleryImages[selectedImageIndex]}
									alt={`${title} - ${selectedImageIndex + 1}`}
									fill
									sizes="(max-width: 768px) 100vw, 800px"
									className="object-cover"
									priority={selectedImageIndex === 0}
								/>
							</motion.div>
						</AnimatePresence>
						
						{/* Image Counter Overlay */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
							<span className="text-sm font-semibold text-white">
								{selectedImageIndex + 1} / {galleryImages.length}
							</span>
						</div>
					</div>

					{/* Thumbnail Grid */}
					<div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
						{galleryImages.map((image, index) => (
							<motion.button
								key={index}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setSelectedImageIndex(index)}
								className={`relative h-20 sm:h-24 md:h-28 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
									selectedImageIndex === index
										? "border-[#10b981] shadow-lg shadow-[#10b981]/30 ring-2 ring-[#10b981]/20"
										: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
								}`}
								aria-label={`View image ${index + 1}`}
							>
								<Image
									src={image}
									alt={`${title} thumbnail ${index + 1}`}
									fill
									sizes="(max-width: 640px) 25vw, 150px"
									className="object-cover"
								/>
								{selectedImageIndex === index && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="absolute inset-0 bg-[#10b981]/20"
									/>
								)}
							</motion.button>
						))}
					</div>
				</section>

				{/* Service Details - Vertical List */}
				<section className="mb-16 sm:mb-20">
				<h2 className={`text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "ما تشمله الخدمة" : "What the Service Includes"}
					</h2>
					<div className="space-y-4">
						{serviceDetails?.map((detail, index) => (
							<div
								key={index}
								className={`flex items-start gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 `}
							>
								<CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-1" />
								<p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{detail.text}</p>
							</div>
						))}
					</div>
				</section>

				{/* Customer Reviews - Blockquote Style */}
				<section className="mb-16 sm:mb-20">
					<h2 className={`text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "آراء عملائنا" : "Customer Reviews"}
					</h2>
					<div className="space-y-8">
						{reviews.map((review, index) => (
							<blockquote
								key={index}
								className={`border-l-4 border-[#10b981] pl-6 py-4 ${isArabic ? "border-l-0 border-r-4 pr-6 pl-0 text-right" : ""}`}
							>
								<div className="flex items-center gap-2 mb-3">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${
												i < review.rating
													? "text-yellow-400 fill-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
									"{review.comment}"
								</p>
								<footer className="flex items-center gap-3">
									<cite className="font-semibold text-gray-900 dark:text-gray-100 not-italic">{review.name}</cite>
									{review.verified && (
										<span className="text-xs text-[#10b981] font-medium">
											{isArabic ? "✓ مؤكد" : "✓ Verified"}
										</span>
									)}
									<span className="text-xs text-gray-500">
										{new Date(review.date).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
								</footer>
							</blockquote>
						))}
					</div>
				</section>

				{/* FAQ Section - Minimal Accordion */}
				<section className="mb-16 sm:mb-20">
				<h2 className={`text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
					</h2>
					<div className="space-y-1">
						{faqs.map((faq, index) => (
							<div
								key={index}
								className="border-b border-gray-200 dark:border-gray-700"
							>
								<button
									onClick={() => toggleFAQ(index)}
									className={`w-full flex items-center justify-between py-6 text-left transition-colors hover:text-[#10b981] ${
										isArabic ? " text-right" : ""
									}`}
								>
									<span className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">{faq.question}</span>
									{openFAQIndex === index ? (
										<ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
									) : (
										<ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
									)}
								</button>
								<AnimatePresence>
									{openFAQIndex === index && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.2 }}
											className="overflow-hidden"
										>
											<div className={`pb-6 ${isArabic ? "text-right pr-4" : "text-left pl-4"}`}>
												<p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						))}
					</div>
				</section>

				{/* Booking Section - Full Width */}
				<section id="booking-section" className="bg-gray-50 dark:bg-gray-800 -mx-6 sm:-mx-8 md:-mx-12 lg:mx-0 px-6 sm:px-8 md:px-12 lg:px-0 py-12 sm:py-16">
					<div className="max-w-2xl mx-auto lg:px-16">
						<div className={`text-center mb-10 ${isArabic ? "text-right" : "text-left"}`}>
							<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
								{bookNowTitle}
							</h2>
							<p className="text-lg text-gray-600 dark:text-gray-400">
								{isArabic 
									? "احجز خدمتك الآن واستمتع بأفضل جودة واحترافية"
									: "Book your service now and enjoy the best quality and professionalism"
								}
							</p>
						</div>

						{/* Inline Trust Elements */}
						<div className={`flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400 `}>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-[#10b981] dark:text-green-400" />
								<span>{statusValue}</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-[#10b981] dark:text-green-400" />
								<span>{responseTimeValue}</span>
							</div>
							<div className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-[#10b981] dark:text-green-400" />
								<span>{guaranteeValue}</span>
							</div>
						</div>

						{/* CTA Button */}
						<div className="text-center">
							<Link
								href={bookingPath}
								prefetch={true}
								onMouseEnter={handleBookingMouseEnter}
								className={`inline-flex items-center gap-3 bg-[#10b981] hover:bg-[#059669] text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 `}
							>
								<Calendar className="w-5 h-5" />
								<span>{chooseTechnicianText}</span>
								<ArrowIcon className="w-5 h-5" />
							</Link>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default IndividualServicePage;
