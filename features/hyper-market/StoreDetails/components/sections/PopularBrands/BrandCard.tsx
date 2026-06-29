import Image from "next/image";
import { HyperMarketPopularBrand } from "@/features/hyper-market/StoreDetails/types/popular-brands.types";
import { useRouter } from "next/navigation";
export function BrandCard({ brand }: { brand: HyperMarketPopularBrand }) {
    const name = brand.name?.trim() || "";
    const router = useRouter();

    return (
        <div
            className={[
                "flex min-h-[76px] items-center gap-3 rounded-2xl bg-white p-3",
                "ring-1 ring-black/[0.06]",
            ].join(" ")}
            aria-label={name}
            onClick={() => router.push(`/hyper-market/brands/${brand.id}`)}
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 ring-black/[0.04]">
                {brand.image_full_url ? (
                    <Image
                        src={brand.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            <h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-bold text-gray-900 sm:text-[15px]">
                {name}
            </h3>
        </div>
    );
}
