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

export const CART_ERROR_MESSAGES: Record<CartErrorCode, string> = {
  item_not_found: "المنتج غير موجود",
  store_closed: "المتجر مغلق حالياً",
  cart_item_limit: "تجاوزت الحد الأقصى للكمية",
  different_store: "لا يمكن إضافة منتجات من متجر مختلف",
  cart_not_found: "المنتج غير موجود في السلة",
};

/**
 * Safely extract a CartItem array from whatever the server returns.
 * Handles both a plain array and an envelope { data: [...] } or { cart: [...] }.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseCartItems(json: any): CartItem[] {
  if (Array.isArray(json)) return json as CartItem[];
  if (Array.isArray(json?.data)) return json.data as CartItem[];
  if (Array.isArray(json?.cart)) return json.cart as CartItem[];
  return [];
}
