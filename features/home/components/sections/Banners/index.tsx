import { getBanners } from "@/features/home/api/banners";
import { BannersClient } from "./BannersClient";
import { BannerSlide } from "./BannerSlide";
import BannerSkeleton from "./skeleton";

export const Banners = Object.assign(
    async function Banners() {
        const { banners } = await getBanners();

        if (banners.length === 0) return null;
        if (banners.length === 1) return <BannerSlide banner={banners[0]} priority />;

        return <BannersClient banners={banners} />;
    },
    { skeleton: BannerSkeleton }
);
