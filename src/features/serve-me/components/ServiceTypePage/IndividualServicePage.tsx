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
import HeroSection from "@/features/serve-me/components/ServiceTypePage/HeroSection";
import GallerySection from "./GallerySection";
import ServiceDetailsSection from "./ServiceDetailsSection";
import FAQSection from "./FAQSection";
import CustomerReviews from "./CustomerReviewsSection";
import CustomerReviewsSection from "./CustomerReviewsSection";
import WhyChooseUsSection from "./WhyChooseUsSection";

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
		serviceData,
		isLoading,
		title,
		description,
		features,
		serviceDetails,
		rating,
		reviews,
		faqs,
		priceText,
		startsFromText,
		priceIncludesText,
		bookNowTitle,
		statusValue,
		responseTimeValue,
		guaranteeValue,
		bookingPath,
	galleryImages,
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
			<HeroSection title={title||"title"} description={description||"description"} heroImage={serviceData?.heroImage} reviewsCount={serviceData?.reviewsCount} rating={serviceData?.rating}   />

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
								<p className="text-sm text-gray-500 dark:text-gray-400">{serviceData?.reviewsCount} {isArabic ? "تقييم" : "reviews"}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Why Choose Us - Clean Grid */}
				<WhyChooseUsSection features={features||[]}/>
				
                {/* Gallery  - Vertical List */}
				<GallerySection title={title||"our Gallery"} galleryImages={galleryImages}/>

				{/* Service Details - Vertical List */}
				<ServiceDetailsSection serviceDetails={serviceDetails||[]}/>

				{/* Customer Reviews - Blockquote Style */}
				<CustomerReviewsSection reviews={reviews}/>

				{/* FAQ Section - Minimal Accordion */}
				<FAQSection faqs={faqs} />

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
								<span>{isArabic ? "احجز الآن" : "Book Now"}</span>
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
