"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { addToCart } from "@/features/cart/actions/add-to-cart";

interface AddToCartClientProps {
    itemId: string;
    inStock: boolean;
}

export function AddToCartClient({ itemId, inStock }: AddToCartClientProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setQuantity(1);
        setError(null);
    }, [itemId]);

    function handleAddToCart() {
        setError(null);

        startTransition(async () => {
            const result = await addToCart({
                item_id: Number(itemId),
                quantity,
            });

            if (result.success) {
                router.push("/cart");
                router.refresh();
                return;
            }

            setError(result.message ?? "حدث خطأ");
        });
    }

    return (
        <div className="sticky bottom-0 mt-2 border-t border-gray-100 bg-white px-4 py-3 sm:px-5" dir="rtl">
            {error && (
                <p className="mb-2 text-center text-xs text-red-600">{error}</p>
            )}

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-full border border-gray-200 px-2 py-1">
                    <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors active:bg-gray-100"
                        aria-label="تقليل الكمية"
                        disabled={isPending}
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm font-bold text-gray-900">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors active:bg-gray-100"
                        aria-label="زيادة الكمية"
                        disabled={isPending}
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!inStock || isPending}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#45C553] py-3 text-sm font-bold text-white transition-opacity active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ShoppingBag className="h-4 w-4" />
                    {isPending ? "جاري الإضافة..." : "إضافة للسلة"}
                </button>
            </div>
        </div>
    );
}
