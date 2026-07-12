import { getBanners } from "@/features/home/api/banners";
import { BannersClient } from "./BannersClient";
import { BannerSlide } from "./BannerSlide";
import BannerSkeleton from "./skeleton";

export const Banners = Object.assign(
    async function Banners({ isArabic }: { isArabic: boolean }) {
        const { banners } = await getBanners({ isArabic });

        if (banners.length === 0) return null;
        if (banners.length === 1) return <BannerSlide banner={banners[0]} priority isArabic={isArabic} />;

        return <BannersClient banners={banners} isArabic={isArabic} />;
    },
    { skeleton: BannerSkeleton }
);
