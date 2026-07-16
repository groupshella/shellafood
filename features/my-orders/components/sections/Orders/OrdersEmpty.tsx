import Image from "next/image";
import Link from "next/link";

interface OrdersEmptyProps {
    filtered?: boolean;
    isArabic: boolean;
}

export function OrdersEmpty({ filtered = false, isArabic }: OrdersEmptyProps) {
    return (
        <div className="flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center px-4 text-center sm:min-h-[calc(100dvh-11rem)] sm:px-6 md:px-8">
            <div className="relative mb-6 aspect-square w-full max-w-[11rem] sm:mb-8 sm:max-w-[13rem] md:max-w-[15rem] lg:max-w-[16rem]">
                <Image
                    src="/my-orders/orders-empty.png"
                    alt={
                        filtered
                            ? isArabic
                                ? "لا توجد طلبات بهذه الفلاتر"
                                : "No orders match these filters"
                            : isArabic
                              ? "لا توجد طلبات"
                              : "No orders"
                    }
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 256px"
                    priority
                />
            </div>

            <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                    {filtered
                        ? isArabic
                            ? "لا توجد طلبات"
                            : "No orders found"
                        : isArabic
                          ? "ما عندك أي طلبات حالياً"
                          : "You have no orders yet"}
                </h2>
                <p className="mx-auto max-w-xs text-sm font-medium text-muted sm:max-w-sm sm:text-[15px] md:max-w-md">
                    {filtered
                        ? isArabic
                            ? "لم يتم العثور على طلبات بهذه الفلاتر"
                            : "No orders match these filters"
                        : isArabic
                          ? "ابدأ التسوق الآن واطلب ما تحتاجه بسهولة"
                          : "Start shopping and order what you need"}
                </p>
            </div>

            {!filtered ? (
                <Link
                    href="/home"
                    className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-8 text-sm font-bold text-brand-foreground transition-colors hover:brightness-95 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mt-8 sm:min-h-12 sm:px-10 sm:text-[15px]"
                >
                    {isArabic ? "تصفح المتاجر" : "Browse stores"}
                </Link>
            ) : null}
        </div>
    );
}
