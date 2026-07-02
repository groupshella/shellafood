import type { AvailableCoupon, Coupon } from "@/features/coupons/types/coupon.types";

/**
 * Safely parses `expire_date`. Missing or unparsable dates are treated as
 * "no expiry" (never expired) — matching the reference app's behavior.
 */
function parseExpireDate(coupon: Coupon): Date | null {
	if (!coupon.expire_date) return null;
	const parsed = new Date(coupon.expire_date);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isCouponExpiredByDate(coupon: Coupon, now: Date = new Date()): boolean {
	const expireDate = parseExpireDate(coupon);
	if (!expireDate) return false;
	return expireDate.getTime() < now.getTime();
}

/** تبويب "المتاحة" — expire_date فارغ أو لم يحن بعد */
export function couponsNotExpiredByDate(coupons: Coupon[], now: Date = new Date()): Coupon[] {
	return coupons.filter((coupon) => !isCouponExpiredByDate(coupon, now));
}

/** تبويب "المنتهية" — فلترة محلية فقط، لا يوجد status من الـ API */
export function couponsExpiredByDate(coupons: Coupon[], now: Date = new Date()): Coupon[] {
	return coupons.filter((coupon) => isCouponExpiredByDate(coupon, now));
}

export function couponIsUsableAvailable(coupon: Coupon, now: Date = new Date()): boolean {
	return !isCouponExpiredByDate(coupon, now) && !coupon.is_used;
}

/** كوبونات قابلة للاستخدام أولاً، ثم المستخدمة (غير المنتهية) بعدها */
export function sortCouponsForFirstTab(coupons: Coupon[], now: Date = new Date()): AvailableCoupon[] {
	const annotated: AvailableCoupon[] = coupons.map((coupon) => ({
		...coupon,
		isUsable: couponIsUsableAvailable(coupon, now),
	}));

	return [...annotated].sort((a, b) => Number(b.isUsable) - Number(a.isUsable));
}

const EXPIRY_LOCALE_FORMATTER = new Intl.DateTimeFormat("ar", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

/** "صالح حتى 25 يونيو 2026" — يعيد null إذا لا يوجد تاريخ انتهاء */
export function formatExpireDate(coupon: Coupon): string | null {
	const expireDate = parseExpireDate(coupon);
	if (!expireDate) return null;
	return `صالح حتى ${EXPIRY_LOCALE_FORMATTER.format(expireDate)}`;
}

/** كوبون على وشك الانتهاء خلال `thresholdDays` أيام — يُبرز بلون تحذيري في القائمة */
export function isCouponExpiringSoon(coupon: Coupon, thresholdDays = 3, now: Date = new Date()): boolean {
	const expireDate = parseExpireDate(coupon);
	if (!expireDate) return false;
	const msRemaining = expireDate.getTime() - now.getTime();
	if (msRemaining <= 0) return false;
	return msRemaining <= thresholdDays * 24 * 60 * 60 * 1000;
}
