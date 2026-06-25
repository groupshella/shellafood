import Image from "next/image";
import Link from "next/link";
import { PromoBannerItem } from "./promo-banners.config";

interface PromoBannerCardProps {
    banner: PromoBannerItem;
    priority?: boolean;
}

export function PromoBannerCard({ banner, priority = false }: PromoBannerCardProps) {
    const card = (
        <div
            className={[
                "relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#F7F9F7] to-[#EEF2EE]",
                "shadow-sm ring-1 ring-black/[0.04]",
                "transition-transform duration-200 active:scale-[0.98]",
                banner.aspectClass,
            ].join(" ")}
        >
            <Image
                src={banner.src}
                alt={banner.alt}
                fill
                priority={priority}
                quality={90}
                className="object-cover object-center"
                sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 960px"
                loading={priority ? undefined : "lazy"}
            />
        </div>
    );

    const linkClassName =
        "block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2";

    if (banner.external) {
        return (
            <Link
                href={banner.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
                aria-label={banner.alt}
            >
                {card}
            </Link>
        );
    }

    return (
        <Link href={banner.href} className={linkClassName} aria-label={banner.alt}>
            {card}
        </Link>
    );
}
