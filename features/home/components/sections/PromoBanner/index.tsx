import { PromoBannerCard } from "./PromoBannerCard";
import { PROMO_BANNERS } from "./promo-banners.config";

export function PromoBanners() {
    return (
        <section aria-label="عروض ترويجية" className="mx-auto w-full max-w-5xl space-y-6 px-4">
            {PROMO_BANNERS.map((banner, index) => (
                <article key={banner.id} className="space-y-3">
                    {banner.title && (
                        <h2 className="text-lg font-bold text-gray-800">{banner.title}</h2>
                    )}
                    <PromoBannerCard banner={banner} priority={index === 0} />
                </article>
            ))}
        </section>
    );
}
