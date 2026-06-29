import { ShoppingBag } from "lucide-react";

interface EmptyProps {
    isSearch?: boolean;
}

export function Empty({ isSearch = false }: EmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag className="h-8 w-8 text-gray-300" strokeWidth={1.4} />
            </div>
            <p className="text-[15px] font-semibold text-gray-700">
                {isSearch ? "لا توجد نتائج" : "لا توجد منتجات"}
            </p>
            <p className="mt-1 text-[13px] text-gray-400">
                {isSearch ? "جرّب كلمة بحث مختلفة" : "لا توجد منتجات في هذا العرض حالياً"}
            </p>
        </div>
    );
}
