import { useLanguage } from "@/providers"
import { CheckCircle2 } from "lucide-react";
interface WhyChooseUsInterface
{
    features: Array<{ text: string; included: boolean }>
}
const WhyChooseUsSection=({features}:WhyChooseUsInterface)=>{
    const {language}=useLanguage();
    const isArabic=language==='ar';
    return <section className="mb-16 sm:mb-20">
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
}
export default WhyChooseUsSection;