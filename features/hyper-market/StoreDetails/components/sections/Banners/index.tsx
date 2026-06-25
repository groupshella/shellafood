import { getHyperMarketBanners } from "@/features/hyper-market/StoreDetails/api/banners";
import { BannersClient } from "./BannersClient";
import { BannerSlide } from "./BannerSlide";
import BannerSkeleton from "./skeleton";

export const Banners = Object.assign(
    async function Banners() {
        const { banners } = await getHyperMarketBanners();

        if (banners.length === 0) return null;
        if (banners.length === 1) {
            return (
                <section aria-label="العروض المميزة" className="w-full px-4 sm:px-5">
                    <BannerSlide banner={banners[0]} priority />
                </section>
            );
        }

        return <BannersClient banners={banners} />;
    },
    { skeleton: BannerSkeleton }
);
