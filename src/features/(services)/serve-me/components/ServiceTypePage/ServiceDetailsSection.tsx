import { useLanguage } from "@/providers"
import { CheckCircle } from "lucide-react";
interface ServiceDetailsSectionInterface
{
  serviceDetails:  Array<{ text: string }>
}
const ServiceDetailsSection=({serviceDetails}:ServiceDetailsSectionInterface)=>{
    const {language}=useLanguage();
    const isArabic=language==='ar';

    return <section className="mb-16 sm:mb-20">
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
}
export default ServiceDetailsSection;