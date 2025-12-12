import { useLanguage } from "@/providers";
import { ReviewItem } from "../../types/serve-me.types";
import { Star } from "lucide-react";
interface CustomerReviewsInterface
{
    reviews:ReviewItem[];
}
const CustomerReviewsSection=({reviews}:CustomerReviewsInterface)=>{
    const {language}=useLanguage();
    const isArabic=language==='ar';
return <section className="mb-16 sm:mb-20">
<h2 className={`text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 ${isArabic ? "text-right" : "text-left"}`}>
    {isArabic ? "آراء عملائنا" : "Customer Reviews"}
</h2>
<div className="space-y-8">
    {reviews.map((review, index) => (
        <blockquote
            key={index}
            className={`border-l-4 border-[#10b981] pl-6 py-4 ${isArabic ? "border-l-0 border-r-4 pr-6 pl-0 text-right" : ""}`}
        >
            <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${
                            i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                "{review.comment}"
            </p>
            <footer className="flex items-center gap-3">
                <cite className="font-semibold text-gray-900 dark:text-gray-100 not-italic">{review.name}</cite>
                {review.verified && (
                    <span className="text-xs text-[#10b981] font-medium">
                        {isArabic ? "✓ مؤكد" : "✓ Verified"}
                    </span>
                )}
                <span className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </footer>
        </blockquote>
    ))}
</div>
</section>
}
export default CustomerReviewsSection;