import Image from "next/image";

export function CartEmpty() {
  return (
    <div
      className="flex flex-1 flex-col items-center bg-white px-4 text-center dark:bg-gray-900 sm:px-6"
      dir="rtl"
    >
      <div className="mx-auto mt-12 flex w-full max-w-xs flex-col items-center sm:mt-20 md:mt-24 lg:mt-28">
        <div className="relative aspect-[13/14] w-full max-w-[13rem] shrink-0 sm:max-w-[15rem] md:max-w-[16rem]">
          <Image
            src="/cart/emptyCart.png"
            alt="سلة فارغة"
            fill
            className="object-contain"
            sizes="(min-width: 768px) 256px, (min-width: 640px) 240px, 208px"
            priority
          />
        </div>

        <h2 className="mt-5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-6 sm:text-xl">سلتك فارغة</h2>

        <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:max-w-sm sm:text-[15px]">
          ابدأ بإضافة المنتجات أو الخدمات التي تحتاجها.
        </p>
      </div>
    </div>
  );
}
