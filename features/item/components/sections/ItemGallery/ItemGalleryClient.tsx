"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { ItemImage } from "@/features/item/types/item.types";

const H_SCROLL_TRACK = [
    "flex gap-2 overflow-x-auto",
    "snap-x scroll-smooth",
    "scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
].join(" ");

interface ItemGalleryClientProps {
    title: string;
    images: ItemImage[];
    name: string;
}

export function ItemGalleryClient({ title, images, name }: ItemGalleryClientProps) {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

    const activeUrl = images[activeIndex].img;
    const showThumbs = images.length > 1;

    return (<>
        <header className="flex items-center gap-3 bg-white px-4 pb-3 pt-4 sm:px-5">
            <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F0F0] transition-transform active:scale-90"
                aria-label="رجوع"
            >
                <ArrowRight className="h-4 w-4 text-gray-700" strokeWidth={2} />
            </button>
            <h1 className="flex-1 truncate text-center text-sm font-bold text-gray-900">{title}</h1>
            <div className="h-9 w-9" aria-hidden />
        </header>
        <div className="bg-white">
            <div className="relative aspect-square w-full overflow-hidden bg-[#F7F9F7]">
                {!imgErrors[activeIndex] && activeUrl ? (
                    <Image
                        src={activeUrl}
                        alt={name}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, 480px"
                        priority
                        onError={() => setImgErrors((prev) => ({ ...prev, [activeIndex]: true }))}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center opacity-20">
                        <ShoppingBag className="h-16 w-16 text-gray-400" />
                    </div>
                )}
            </div>

            {showThumbs && (
                <div className={`${H_SCROLL_TRACK} px-4 py-3`} dir="ltr">
                    {images.map((image, index) => (
                        <button
                            key={`${image.img}-${index}`}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={[
                                "relative h-14 w-14 shrink-0 snap-start overflow-hidden rounded-lg border-2 bg-[#F7F9F7] transition-colors",
                                index === activeIndex ? "border-[#45C553]" : "border-transparent",
                            ].join(" ")}
                            aria-label={`صورة ${index + 1}`}
                        >
                            {!imgErrors[index] ? (
                                <Image
                                    src={image.img}
                                    alt=""
                                    fill
                                    className="object-contain p-1"
                                    sizes="56px"
                                    onError={() => setImgErrors((prev) => ({ ...prev, [index]: true }))}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center opacity-30">
                                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </>
    );
}
