import { CartListClient } from "./CartListClient";

export { default as skeleton } from "./skeleton";

export function CartList({ isArabic }: { isArabic: boolean }) {
  return <CartListClient isArabic={isArabic} />;
}
