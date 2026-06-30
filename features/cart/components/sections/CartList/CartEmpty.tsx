import Image from "next/image";
import Link from "next/link";

export function CartEmpty() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center"
      dir="rtl"
    >
      <div className="flex w-full max-w-md flex-col items-center">
        <div className="relative mb-6 h-44 w-44 sm:h-52 sm:w-52 md:h-60 md:w-60">
          <Image
            src="/cart/emptyCart.png"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 240px"
            priority
          />
        </div>

        <h2 className="text-xl font-bold text-[#111B18] sm:text-2xl">
          سلتك فارغة
        </h2>

        <p className="mt-3 max-w-sm text-base leading-7 text-gray-500 sm:text-lg">
          ابدأ بإضافة المنتجات أو الخدمات التي تحتاجها.
        </p>

        <Link
          href="/home"
          className="mt-8 rounded-2xl bg-[#30913F] px-10 py-4 text-base font-semibold text-white transition-colors active:bg-[#267332] sm:text-lg"
        >
          تصفّح المنتجات
        </Link>
      </div>
    </div>
  );
}