import { useLanguage } from "@/providers";
import { AnimatePresence,motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useState } from "react";
import { FAQItem } from "../../types/serve-me.types";

interface FAQSectionInterface
{
    faqs:FAQItem[];
}
const FAQSection=({faqs}:FAQSectionInterface)=>
{
    const {language}=useLanguage();
    const isArabic=language==='ar';
	const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

    const toggleFAQ = useCallback((index: number) => {
		setOpenFAQIndex(prev => prev === index ? null : index);
	}, []);
    return <section className="mb-16 sm:mb-20">
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

}
export default FAQSection;