import { getCart } from "@/features/cart/api/cart";
import { CartListClient } from "./CartListClient";

export { default as skeleton } from "./skeleton";

export async function CartList() {
  const items = await getCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16" dir="rtl">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100" />
        <p className="text-center text-sm text-gray-500">سلتك فارغة</p>
        <a
          href="/home"
          className="rounded-2xl bg-[#30913F] px-8 py-3 text-sm font-semibold text-white"
        >
          تصفّح المنتجات
        </a>
      </div>
    );
  }

  return <CartListClient items={items} />;
}
