import { isArabicLocale } from "@/shared/lib/locale";
import { PromoBannerCard } from "./PromoBannerCard";
import { WEBSITE_BANNER } from "./promo-banners.config";

export async function PromoBanners() {
	const isArabic = await isArabicLocale();

	return (
		<section
			aria-label={isArabic ? "موقع شلة" : "Shella website"}
			className="min-w-0 pt-2 sm:pt-3 lg:pt-4"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<PromoBannerCard banner={WEBSITE_BANNER} priority isArabic={isArabic} />
		</section>
	);
}
