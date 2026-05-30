"use client";
import { useLanguage } from "@/providers";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import DescriptionTooltipModal from "../../Modals/DescriptionTooltipModal";
interface ProblemDescriptionSectionProps
{
    title:string;
    placeholder:string;
    description:string;
    handleInputChange:(e: React.ChangeEvent<HTMLTextAreaElement>) =>void;
}
export default function ProblemDescriptionSection({title,placeholder,description,handleInputChange}:ProblemDescriptionSectionProps)
{
	const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false);
const {language}=useLanguage();
const isArabic=language==='ar';
    return <>
    	<section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
        </h2>
        <div className="relative flex-shrink-0">
            <button
                type="button"
                onClick={() => setShowDescriptionTooltip(true)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 active:text-gray-600 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 rounded-full p-1"
                aria-label={isArabic ? "عرض التلميح" : "Show hint"}
            >
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
        </div>
    </div>
    <textarea
        name="description"
        value={description}
        onChange={handleInputChange}
        placeholder={placeholder}
        rows={5}
        required
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-0 focus:outline-none resize-none text-sm sm:text-base transition-all touch-manipulation placeholder-gray-400 dark:placeholder-gray-500 ${
            isArabic ? "text-right" : "text-left"
        }`}
        dir={isArabic ? "rtl" : "ltr"}
    />
</section>
<DescriptionTooltipModal
				isOpen={showDescriptionTooltip}
				onClose={() => setShowDescriptionTooltip(false)}
				isArabic={isArabic}
			/>
            </>
}