"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Icon, icons } from "../../constants/icons";
import { fadeUp } from "../../lib/animationUtils";
import { TRANSPORT_DATA, CATEGORIES, CAT_AR, TransportTypeData } from "../../constants/landingData";
import { useRouter } from "next/navigation";

export default function TransportTypeSection() {
  const [activeCategory, setActiveCategory] = useState("light");
  const router = useRouter();
  const filtered = useMemo(
    () => TRANSPORT_DATA.filter((t) => t.category === activeCategory),
    [activeCategory]
  );

  const handleChoose = useCallback((type: TransportTypeData) => {
    router.push(`/pickandorder/${type.slug}/order/details?title=${decodeURIComponent(type.title)}`);
  }, []);

  return (
    <section id="transport-section" dir="rtl" className="bg-gray-50 py-14 sm:py-20 lg:py-24" aria-labelledby="transport-heading">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">

        {/* Header */}
        <motion.div {...fadeUp() as any} className="text-center mb-10 sm:mb-14">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            اختر وسيلة الشحن
          </p>
          <h2 id="transport-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            ما هي طبيعة شحنتك؟
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            نظام فلترة متتابع يعرض الوسائل المناسبة بناءً على فئة الشحن التي تختارها
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div {...fadeUp(0.1) as any} className="flex justify-center gap-2 sm:gap-3 mb-10 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-green-600 text-white shadow-md shadow-green-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
            >
              {CAT_AR[cat]}
            </button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {filtered.map((type, index) => (
            <motion.div
              key={type.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="relative h-full bg-white rounded-2xl border border-gray-150 hover:border-green-200 hover:shadow-xl shadow-sm transition-all duration-250 overflow-hidden">

                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-l from-green-500 to-emerald-400" />

                <div className="p-6 sm:p-7">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex flex-col items-end gap-1">
                      {type.badge && (
                        <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                          {type.badge}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 font-medium">{type.weight}</span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon name={type.iconName as keyof typeof icons} className="w-7 h-7 text-green-600" />
                    </div>
                  </div>

                  {/* Title & description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-right">{type.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed text-right mb-5">{type.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {type.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5  text-sm text-gray-600">
                        <Icon name="Check" className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleChoose(type)}
                    className="w-full py-3 px-5 bg-gray-900 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/40 group-hover:bg-green-600"
                    aria-label={`اختيار ${type.title}`}
                  >
                    اختيار هذه الوسيلة
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Addon note */}
        <motion.div {...fadeUp(0.2) as any} className="max-w-6xl mx-auto mt-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-right">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Icon name="Package" className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 mb-1">وحدات مساندة إضافية</p>
              <p className="text-sm text-gray-500">يمكنك إضافة رافعة هيدروليكية، طاقم عمالة مدربة، أو مواد تغليف متخصصة — خلال تأكيد طلبك لتجربة نقل متكاملة.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
