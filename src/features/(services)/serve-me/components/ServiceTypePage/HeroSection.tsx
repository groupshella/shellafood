"use client";

import Image from "next/image";
import { useLanguage } from "@/providers";
import { 
	Star, 
	Award,
    Calendar,
    ArrowUpIcon,
} from "lucide-react";
import { motion, } from "framer-motion";
import { useCallback } from "react";
interface HeroSection{
heroImage :string;
title:string;
description:string;
rating: number;
	reviewsCount: number;
}
const HeroSection=({heroImage,title,description,rating,reviewsCount}:HeroSection)=>{
    const { language } = useLanguage();
    	// Event handlers
	const scrollToBooking = useCallback(() => {
		const bookingElement = document.getElementById("booking-section");
		if (bookingElement) {
			bookingElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);
	const isArabic = language === "ar";
    return  <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
        <Image
            src={heroImage || "/serveme-hero.png"}
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
                            <span className="text-sm font-medium">{rating} ({reviewsCount} {isArabic ? "تقييم" : "reviews"})</span>
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
                        <span>{isArabic ? "احجز الآن" : "Book Now"}</span>
                        <ArrowUpIcon className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    </div>
}
export default HeroSection;