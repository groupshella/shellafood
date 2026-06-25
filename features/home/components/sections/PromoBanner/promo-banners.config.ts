export interface PromoBannerItem {
    id: string;
    title?: string;
    src: string;
    href: string;
    alt: string;
    external?: boolean;
    /** Tailwind aspect ratio class — tuned per artwork so nothing gets cropped */
    aspectClass: string;
}

export const PROMO_BANNERS: PromoBannerItem[] = [
    {
        id: "hypermarket-offers",
        title: "عروض وخصومات",
        src: "/home/banner-1.png",
        href: "/hyper-market?module_id=3",
        alt: "خصومات حصرية حتى 50% على آلاف المنتجات المختارة",
        aspectClass: "aspect-[343/120] sm:aspect-[343/110]",
    },
    {
        id: "shellah-services",
        src: "/home/banner.png",
        href: "https://www.shellaksa.com/",
        alt: "اكتشف خدمات أكثر عبر موقع شلّة — التوصيل، الجمال، التعليم، القانون، الصيانة",
        external: true,
        aspectClass: "aspect-[21/6] sm:aspect-[21/5]",
    },
];
