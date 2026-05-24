"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "../../lib/animationUtils";
import { STEPS } from "../../constants/landingData";

export default function StepsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} dir="rtl" className="bg-gray-50 py-14 sm:py-20 lg:py-24">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <motion.div {...fadeUp() as any} className="text-center mb-12 sm:mb-16">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-4">
            كيف يعمل؟
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">أسهل طريقة للشحن</h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">أربع خطوات بسيطة وشحنتك في الطريق</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 right-[10%] left-[10%] h-px bg-gray-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {STEPS.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 text-right flex flex-col items-start"
              >
                {/* Step number bubble */}
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-green-500 flex items-center justify-center mb-5 shadow-md shadow-green-100">
                  <span className="text-2xl font-black text-green-600">{n}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA block */}
        <motion.div {...fadeUp(0.3) as any} className="mt-14 sm:mt-16">
          <div
            className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 text-right"
            style={{ background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #16a34a 100%)" }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">جاهز للبدء؟</h3>
                <p className="text-green-100 text-sm sm:text-base">أنشئ طلبك الآن واستمتع بتجربة شحن لا مثيل لها</p>
              </div>
              <button
                onClick={() => document.getElementById("transport-section")?.scrollIntoView({ behavior: "smooth" })}
                className="flex-shrink-0 bg-white text-green-700 font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl hover:bg-green-50 transition-all duration-200 active:scale-95 shadow-lg"
              >
                ابدأ الشحن الآن ←
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
