import { ShoppingBag } from "lucide-react";

interface EmptyProps {
    isSearch?: boolean;
    isArabic: boolean;
}

export function Empty({ isSearch = false, isArabic }: EmptyProps) {
    return (
        <div
            className="flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card sm:mb-5 sm:h-[4.5rem] sm:w-[4.5rem]">
                <ShoppingBag
                    className="h-8 w-8 text-muted sm:h-9 sm:w-9"
                    strokeWidth={1.4}
                    aria-hidden
                />
            </div>
            <p className="text-[15px] font-semibold text-foreground sm:text-base">
                {isSearch
                    ? isArabic
                        ? "لا توجد نتائج"
                        : "No results"
                    : isArabic
                      ? "لا توجد منتجات"
                      : "No products"}
            </p>
            <p className="mt-1 max-w-xs text-[13px] text-muted sm:mt-1.5 sm:max-w-sm sm:text-sm">
                {isSearch
                    ? isArabic
                        ? "جرّب كلمة بحث مختلفة"
                        : "Try a different search term"
                    : isArabic
                      ? "لا توجد منتجات في هذا العرض حالياً"
                      : "No products in this offer right now"}
            </p>
        </div>
    );
}
