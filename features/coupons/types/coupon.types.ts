export type CouponDiscountType = "percent" | "amount";

export interface CouponStore {
	id: number;
	name?: string;
	logo?: string | null;
	logo_full_url?: string | null;
}

export interface Coupon {
	id: number;
	title: string;
	code: string;
	start_date: string;
	expire_date: string | null;
	min_purchase: number;
	max_discount: number;
	discount: number;
	discount_type: CouponDiscountType;
	coupon_type: string;
	limit: number;
	store_id: number | null;
	module_id: number;
	status: number;
	is_used: boolean;
	used_order_id: number | null;
	used_at: string | null;
	store?: CouponStore | null;
}

export type CouponTab = "available" | "expired";

/**
 * Available-tab coupon annotated with a UI-only usability flag so the card
 * can render the "تفعيل" vs "مستخدم" state without re-deriving it in the client.
 */
export interface AvailableCoupon extends Coupon {
	isUsable: boolean;
}
