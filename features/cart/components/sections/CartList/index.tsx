import { isArabicLocale } from "@/shared/lib/locale";
import { CartListClient } from "./CartListClient";

export { default as skeleton } from "./skeleton";

export async function CartList() {
  const isArabic = await isArabicLocale();
  return <CartListClient isArabic={isArabic} />;
}
