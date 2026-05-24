"use client";

import { motion } from "framer-motion";
import { Icon, icons } from "../../constants/icons";
import { fadeUp } from "../../lib/animationUtils";
import { FEATURES } from "../../constants/landingData";

export default function FeaturesSection() {
  return (
    <section dir="rtl" className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <motion.div {...fadeUp() as any} className="text-center mb-12 sm:mb-16">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-4">
            لماذا تختارنا؟
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">مميزات تجعلنا مختلفين</h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            نقدم تجربة شحن متكاملة مبنية على الأمان والسرعة والشفافية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <motion.div key={icon} {...(fadeUp(i * 0.1) as any)}>
              <div className="group bg-gray-50 hover:bg-green-600 rounded-2xl p-7 sm:p-8 border border-gray-100 hover:border-green-600 transition-all duration-300 text-right h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-green-500 border border-gray-100 group-hover:border-green-500 flex items-center justify-center mb-5 transition-all duration-300 shadow-sm">
                  <Icon name={icon as keyof typeof icons} className="w-7 h-7 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">{title}</h3>
                <p className="text-sm text-gray-500 group-hover:text-green-100 leading-relaxed transition-colors duration-300 flex-1">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
