import Image from "@/shared/components/SecureImage";
import Link from "next/link";
import { HyperMarketBanner } from "@/features/hyper-market/StoreDetails/types/banners.types";

function getBannerHref(banner: HyperMarketBanner): string | null {
    if (banner.link) return banner.link;
    if (banner.store?.slug) return `/store/${banner.store.slug}`;
    return null;
}

export function BannerSlide({
    banner,
    priority = false,
    isArabic,
}: {
    banner: HyperMarketBanner;
    priority?: boolean;
    isArabic: boolean;
}) {
    const href = getBannerHref(banner);

    const image = (
        <Image
            src={banner.image_full_url}
            alt={banner.title || (isArabic ? "عرض ترويجي" : "Promotional offer")}
            fill
            priority={priority}
            quality={85}
            className="object-cover object-center"
            sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 48px), (max-width: 1536px) 960px, 1152px"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iMzIwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
        />
    );

    const wrapper = (
        <div className="group relative aspect-[21/8] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-card to-border shadow-sm ring-1 ring-border sm:aspect-[21/7] md:aspect-[21/6] xl:aspect-[21/5.5]">
            {image}
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
                aria-hidden
            />
        </div>
    );

    if (href) {
        return (
            <Link
                href={"/hyper-market/"}
                className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:rounded-2xl"
                draggable={false}
            >
                {wrapper}
            </Link>
        );
    }

    return wrapper;
}
