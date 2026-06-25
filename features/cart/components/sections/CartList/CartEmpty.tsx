import Image from "next/image";
import Link from "next/link";

export function CartEmpty() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center sm:py-16"
      dir="rtl"
    >
      <div className="relative mb-5 h-44 w-44 sm:mb-6 sm:h-52 sm:w-52">
        <Image
          src="/cart/emptyCart.png"
          alt=""
          fill
          className="object-contain"
          sizes="(max-width: 640px) 176px, 208px"
          priority
        />
      </div>

      <h2 className="text-lg font-bold text-[#111B18] sm:text-xl">سلتك فارغة</h2>
      <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-gray-500 sm:max-w-xs sm:text-[15px]">
        ابدأ بإضافة المنتجات أو الخدمات التي تحتاجها.
      </p>

      <Link
        href="/home"
        className="mt-6 rounded-2xl bg-[#30913F] px-8 py-3 text-sm font-semibold text-white transition-colors active:bg-[#267332]"
      >
        تصفّح المنتجات
      </Link>
    </div>
  );
}
