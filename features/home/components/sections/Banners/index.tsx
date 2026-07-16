import { getBanners } from "@/features/home/api/banners";
import { isArabicLocale } from "@/shared/lib/locale";
import { BannersClient } from "./BannersClient";
import { BannerSlide } from "./BannerSlide";
import BannerSkeleton from "./skeleton";

export const Banners = Object.assign(
	async function Banners() {
		const isArabic = await isArabicLocale();
		const lang = isArabic ? "ar" : "en";
		const { banners } = await getBanners(lang);

		if (banners.length === 0) return null;
		if (banners.length === 1) {
			return <BannerSlide banner={banners[0]} priority isArabic={isArabic} />;
		}

		return <BannersClient banners={banners} isArabic={isArabic} />;
	},
	{ skeleton: BannerSkeleton }
);
