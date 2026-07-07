import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

interface ProductCardProps {
    productId: number;
    name: string;
    imageUrl: string;
    price: number;
    originalPrice?: number | null;
}

export function ProductCard({ productId, name, imageUrl, price, originalPrice }: ProductCardProps) {
    const hasDiscount = originalPrice != null && originalPrice > price;

    return (
        <Link
            href={`/items/${productId}`}
            className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] outline-none transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:bg-gray-800 dark:shadow-[0_2px_12px_rgba(0,0,0,0.25)] dark:focus-visible:ring-offset-gray-900"
            aria-label={name}
        >
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-xl bg-[#F7F9F7] dark:bg-gray-700">
                {imageUrl ? (
                    <Image src={imageUrl} alt="" fill className="object-cover" sizes="120px" loading="lazy" />
                ) : null}
                <span
                    className="absolute bottom-1.5 start-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#45C553] shadow-sm sm:h-7 sm:w-7"
                    aria-hidden
                >
                    <Plus className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </span>
            </div>
            <div className="flex flex-1 flex-col gap-0.5 p-2 sm:p-2.5">
                <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-[#111B18] dark:text-gray-50 sm:text-xs">
                    {name}
                </p>
                <div className="mt-auto flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#111B18] dark:text-gray-50">{price.toFixed(2)}</span>
                    {hasDiscount && (
                        <span className="text-[10px] text-gray-400 line-through dark:text-gray-500">
                            {originalPrice!.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
