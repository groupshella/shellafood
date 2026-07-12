import { getHyperMarketBanners } from "@/features/hyper-market/StoreDetails/api/banners";
import { BannersClient } from "./BannersClient";
import { BannerSlide } from "./BannerSlide";
import BannerSkeleton from "./skeleton";

export const Banners = Object.assign(
    async function Banners({ isArabic }: { isArabic: boolean }) {
        const { banners } = await getHyperMarketBanners();

        if (banners.length === 0) return null;
        if (banners.length === 1) {
            return (
                <section aria-label={isArabic ? "العروض المميزة" : "Featured offers"} className="w-full px-4 sm:px-5" dir={isArabic ? "rtl" : "ltr"}>
                    <BannerSlide banner={banners[0]} priority isArabic={isArabic} />
                </section>
            );
        }

        return <BannersClient banners={banners} isArabic={isArabic} />;
    },
    { skeleton: BannerSkeleton }
);
