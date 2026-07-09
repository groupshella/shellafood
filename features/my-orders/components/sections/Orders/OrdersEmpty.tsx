import Image from "next/image";
import Link from "next/link";

interface OrdersEmptyProps {
    filtered?: boolean;
}

export function OrdersEmpty({ filtered = false }: OrdersEmptyProps) {
    return (
        <div className="flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center px-4 text-center sm:min-h-[calc(100dvh-11rem)] sm:px-6">
            <div className="relative mb-6 aspect-square w-full max-w-[11rem] sm:mb-8 sm:max-w-[13rem] md:max-w-[15rem]">
                <Image
                    src="/my-orders/orders-empty.png"
                    alt={filtered ? "لا توجد طلبات بهذه الفلاتر" : "لا توجد طلبات"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 240px"
                    priority
                />
            </div>

            <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 sm:text-xl">
                    {filtered ? "لا توجد طلبات" : "ما عندك أي طلبات حالياً"}
                </h2>
                <p className="mx-auto max-w-xs text-sm font-medium text-gray-500 dark:text-gray-400 sm:max-w-sm sm:text-[15px]">
                    {filtered
                        ? "لم يتم العثور على طلبات بهذه الفلاتر"
                        : "ابدأ التسوق الآن واطلب ما تحتاجه بسهولة"}
                </p>
            </div>

            {!filtered ? (
                <Link
                    href="/home"
                    className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#30913F] px-8 text-sm font-bold text-white transition-colors hover:bg-[#2a8036] active:bg-[#267332] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 sm:mt-8 sm:min-h-12 sm:px-10 sm:text-[15px]"
                >
                    تصفح المتاجر
                </Link>
            ) : null}
        </div>
    );
}
