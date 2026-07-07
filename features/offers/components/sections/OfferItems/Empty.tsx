import { ShoppingBag } from "lucide-react";

interface EmptyProps {
    isSearch?: boolean;
}

export function Empty({ isSearch = false }: EmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 sm:mb-5 sm:h-[4.5rem] sm:w-[4.5rem]">
                <ShoppingBag className="h-8 w-8 text-gray-300 dark:text-gray-500 sm:h-9 sm:w-9" strokeWidth={1.4} />
            </div>
            <p className="text-[15px] font-semibold text-gray-700 dark:text-gray-200 sm:text-base">
                {isSearch ? "لا توجد نتائج" : "لا توجد منتجات"}
            </p>
            <p className="mt-1 max-w-xs text-[13px] text-gray-400 dark:text-gray-500 sm:mt-1.5 sm:max-w-sm sm:text-sm">
                {isSearch ? "جرّب كلمة بحث مختلفة" : "لا توجد منتجات في هذا العرض حالياً"}
            </p>
        </div>
    );
}
