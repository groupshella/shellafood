"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";

	const HeroSection: React.FC = React.memo(() => {
  const title = "خدمة توصيل سريعة وموثوقة";
  const description = "نقدم لك خدمات التوصيل السريع والآمن اختر خدمتك المناسبة واترك الباقي علينا";
  const buttonText = "ابدأ الآن";
  const imageUrl = "/driver.png";

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleStartNow = () => {
    const transportSection = document.getElementById("transport-section");
    if (transportSection) {
      const header = document.querySelector("header, nav");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const sectionPosition = transportSection.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = sectionPosition - headerHeight - 20;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-200 rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 lg:order-1 text-right"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-xl mr-0 ml-auto lg:ml-0">
              {description}
            </p>
            <div className="text-right">
              <motion.button
                onClick={handleStartNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 flex-row-reverse bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/50 text-base sm:text-lg"
                aria-label="الانتقال إلى قسم أنواع النقل"
              >
                <span>{buttonText}</span>
                <ArrowRight className="h-5 w-5 rotate-180" aria-hidden="true" />
              </motion.button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2 flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[550px] xl:max-w-[600px] group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-300 -z-10 scale-105" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 bg-gray-200">
                {imageLoading && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
                  </div>
                )}
                {imageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 p-4">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">فشل تحميل الصورة</p>
                  </div>
                )}
                {!imageError && (
                  <>
                    <img
                      src={"/driver.png"}
                      alt="خدمة التوصيل"
                      className={`w-full h-auto object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-90"}`}
                      loading="eager"
                      onLoad={() => setImageLoading(false)}
                      onError={() => { setImageLoading(false); setImageError(true); }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 pointer-events-none rounded-3xl" />
                  </>
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full opacity-20 blur-xl animate-pulse hidden md:block" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500 rounded-full opacity-20 blur-xl animate-pulse hidden md:block" style={{ animationDelay: "1s" }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
export default React.memo(HeroSection);
