export interface CartItem {
  id: number;
  /** Product item id — used for addToCart/matching. Distinct from the cart-line id above. */
  item_id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  image_full_url: string;
  quantity: number;
  store_id?: number;
}

export type CartResponse = CartItem[];

export type CartErrorCode =
  | "item_not_found"
  | "store_closed"
  | "cart_item_limit"
  | "different_store"
  | "cart_not_found";

export interface CartErrorResponse {
  error_code: CartErrorCode;
}

export interface CartActionResult {
  success: boolean;
  items?: CartItem[];
  errorCode?: CartErrorCode;
  message?: string;
}

export const CART_ERROR_MESSAGES: Record<
  CartErrorCode,
  { ar: string; en: string }
> = {
  item_not_found: {
    ar: "المنتج غير موجود",
    en: "Product not found",
  },
  store_closed: {
    ar: "المتجر مغلق حالياً",
    en: "Store is currently closed",
  },
  cart_item_limit: {
    ar: "تجاوزت الحد الأقصى للكمية",
    en: "Maximum quantity exceeded",
  },
  different_store: {
    ar: "لا يمكن إضافة منتجات من متجر مختلف",
    en: "Cannot add products from a different store",
  },
  cart_not_found: {
    ar: "المنتج غير موجود في السلة",
    en: "Product not found in cart",
  },
};

export function getCartErrorMessage(
  code: CartErrorCode | undefined,
  isArabic: boolean,
): string {
  if (code && CART_ERROR_MESSAGES[code]) {
    const copy = CART_ERROR_MESSAGES[code];
    return isArabic ? copy.ar : copy.en;
  }
  return isArabic ? "حدث خطأ" : "Something went wrong";
}

/**
 * Extract store_id from wherever the backend puts it on a cart item.
 * Different API versions / stores return it in different locations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveItemStoreId(item: any, cartStoreId?: number): number | undefined {
  return (
    item?.store_id ??
    item?.item_details?.store_id ??
    item?.product?.store_id ??
    item?.item?.store_id ??
    cartStoreId
  );
}

/**
 * Safely extract a CartItem array from whatever the server returns.
 * Handles both a plain array and envelopes like { data: [...] } or { cart: [...] }.
 * Also normalises store_id from nested paths so it always lands at the top level.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseCartItems(json: any): CartItem[] {
  // Some backends surface the store id at the cart level, not on each item
  const cartStoreId: number | undefined =
    json?.store_id ?? json?.store?.id ?? json?.data?.store_id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let raw: any[] = [];
  if (Array.isArray(json)) raw = json;
  else if (Array.isArray(json?.data)) raw = json.data;
  else if (Array.isArray(json?.cart)) raw = json.cart;

  return raw.map((item) => ({
    ...item,
    store_id: resolveItemStoreId(item, cartStoreId),
  })) as CartItem[];
}
