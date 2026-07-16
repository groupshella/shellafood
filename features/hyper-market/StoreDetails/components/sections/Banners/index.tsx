import { getHyperMarketBanners } from "@/features/hyper-market/StoreDetails/api/banners";
import { BannersClient } from "./BannersClient";
import { BannerSlide } from "./BannerSlide";
import BannerSkeleton from "./skeleton";

export const Banners = Object.assign(
    async function Banners({ isArabic }: { isArabic: boolean }) {
        const lang = isArabic ? "ar" : "en";
        const { banners } = await getHyperMarketBanners(lang);

        if (banners.length === 0) return null;
        if (banners.length === 1) {
            return (
                <section
                    aria-label={isArabic ? "العروض المميزة" : "Featured offers"}
                    className="w-full px-4 sm:px-5 md:px-6 lg:px-6"
                >
                    <BannerSlide banner={banners[0]} priority isArabic={isArabic} />
                </section>
            );
        }

        return <BannersClient banners={banners} isArabic={isArabic} />;
    },
    { skeleton: BannerSkeleton }
);
