import { getCart } from "@/features/cart/api/cart";
import { CartEmpty } from "./CartEmpty";
import { CartListClient } from "./CartListClient";

export { default as skeleton } from "./skeleton";

export async function CartList() {
  const items = await getCart();

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return <CartListClient />;
}