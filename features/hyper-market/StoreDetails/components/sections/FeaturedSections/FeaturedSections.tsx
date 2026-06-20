import Image from "next/image";
import { ProductCard } from "@/features/hyper-market/StoreDetails/components/shared/ProductCard";
import {
    DiscountedProduct,
    FeaturedStoreDiscounted,
    FeaturedStoreProducts,
    Product,
} from "@/features/hyper-market/StoreDetails/types/store-details.types";

/* ─── Shared tokens ─────────────────────────────────────────────────────── */

const H_SCROLL =
    "flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const PRODUCT_ITEM =
    "flex w-[calc((100%-1rem)/2.4)] max-w-[7rem] shrink-0 snap-start self-stretch sm:w-[calc((100%-1.5rem)/3.2)] sm:max-w-[8.5rem] md:max-w-[10rem]";

/* ─── Store logo badge ──────────────────────────────────────────────────── */

function StoreLogo({ logoUrl }: { logoUrl: string }) {
    if (!logoUrl) return null;
    return (
        <div className="absolute -top-5 start-4 z-10 h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-white shadow-md sm:-top-6 sm:h-14 sm:w-14">
            <Image
                src={logoUrl}
                alt=""
                fill
                className="object-contain p-1"
                sizes="56px"
            />
        </div>
    );
}

/* ─── Section heading chip ──────────────────────────────────────────────── */

function SectionSlogan({ text, light = false }: { text: string; light?: boolean }) {
    return (
        <p
            className={`truncate text-sm font-bold leading-tight sm:text-[0.9375rem] ${light ? "text-white/90" : "text-white"
                }`}
        >
            {text}
        </p>
    );
}

/* ─── Gradient overlay on card header ──────────────────────────────────── */

function CardHeader({
    slogan,
    accentColor,
}: {
    slogan: string;
    accentColor: string;
}) {
    return (
        <div
            className="px-4 pb-3 pt-4 pe-[4rem] sm:px-5 sm:pe-[4.5rem]"
            style={{ backgroundColor: accentColor }}
        >
            <SectionSlogan text={slogan} />
        </div>
    );
}

/* ─── Shared featured shell ─────────────────────────────────────────────── */

function FeaturedShell({
    slogan,
    logoUrl,
    bgColor,
    accentColor,
    children,
}: {
    slogan: string;
    logoUrl: string;
    bgColor: string;
    accentColor: string;
    children: React.ReactNode;
}) {
    return (
        <div className="relative mx-3 mb-6 pt-5 sm:mx-4 sm:mb-7 sm:pt-6">
            <StoreLogo logoUrl={logoUrl} />

            <section
                className="overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm"
                style={{ backgroundColor: bgColor }}
            >
                <CardHeader slogan={slogan} accentColor={accentColor} />

                {/* Subtle divider between header and product row */}
                <div className="h-px w-full opacity-10 bg-white" />

                <div className={`${H_SCROLL} px-3 py-3 sm:px-4 sm:py-4`} dir="ltr">
                    {children}
                </div>
            </section>
        </div>
    );
}

/* ─── Discounted featured section ───────────────────────────────────────── */

export function FeaturedDiscounted({ data }: { data: FeaturedStoreDiscounted }) {
    return (
        <FeaturedShell
            slogan={data.slogan}
            logoUrl={data.logo_url}
            bgColor="#1A4731"     /* rich dark green surface */
            accentColor="#15803D" /* vivid header stripe */
        >
            {data.products.map((product: DiscountedProduct) => (
                <div key={product.id} className={PRODUCT_ITEM}>
                    <ProductCard
                        productId={product.id}
                        name={product.name}
                        imageUrl={product.full_image_url}
                        price={product.discounted_price}
                        originalPrice={product.original_price}
                    />
                </div>
            ))}
        </FeaturedShell>
    );
}

/* ─── Regular featured section ──────────────────────────────────────────── */

export function FeaturedProducts({ data }: { data: FeaturedStoreProducts }) {
    return (
        <FeaturedShell
            slogan={data.slogan}
            logoUrl={data.logo_url}
            bgColor="#7F1D1D"     /* deep crimson surface */
            accentColor="#B91C1C" /* vivid header stripe */
        >
            {data.products.map((product: Product) => (
                <div key={product.id} className={PRODUCT_ITEM}>
                    <ProductCard
                        productId={product.id}
                        name={product.name}
                        imageUrl={product.full_image_url}
                        price={product.price}
                    />
                </div>
            ))}
        </FeaturedShell>
    );
}

/* ─── Category products row ─────────────────────────────────────────────── */

export function CategoryProductsRow({ products, title }: { products: Product[]; title: string }) {
    if (!products.length) return null;

    return (
        <section
            className="pb-6 pt-4 sm:pb-8 sm:pt-5"
            style={{ background: "linear-gradient(to top, #EBFEEB, #30913F)" }}
        >
            <div className="flex items-center justify-between px-4 pb-3 sm:px-6">
                <h2 className="text-sm font-bold text-white drop-shadow-sm sm:text-base">{title}</h2>
            </div>
            <div className={`${H_SCROLL} px-4 sm:px-6`} dir="ltr">
                {products.map((product) => (
                    <div key={product.id} className={PRODUCT_ITEM}>
                        <ProductCard
                            productId={product.id}
                            name={product.name}
                            imageUrl={product.full_image_url}
                            price={product.price}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}