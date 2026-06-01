import type { DeliveryInfo, PaymentMethod } from '../types/checkout.types';

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatPrice(amount: number, locale = 'ar-SA'): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'SAR',
		minimumFractionDigits: 2,
	}).format(amount);
}

// ─── Totals ───────────────────────────────────────────────────────────────────

export function calculateOrderTotal(
	subtotal: number,
	deliveryInfo: DeliveryInfo | null,
	dmTips = 0
): number {
	if (!deliveryInfo) return subtotal + dmTips;
	return (
		subtotal +
		deliveryInfo.delivery_charge +
		deliveryInfo.additional_charge +
		deliveryInfo.extra_packaging_amount +
		dmTips
	);
}

// ─── Payment Method Labels ────────────────────────────────────────────────────

export const PAYMENT_LABELS: Record<PaymentMethod, { ar: string; en: string; icon: string }> = {
	cash_on_delivery: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery', icon: '💵' },
	wallet: { ar: 'المحفظة', en: 'Wallet', icon: '👛' },
	wallet_qidha: { ar: 'محفظة قيدها', en: 'Qidha Wallet', icon: '🏦' },
	digital_payment: { ar: 'الدفع الإلكتروني', en: 'Digital Payment', icon: '💳' },
};

export function getPaymentLabel(method: PaymentMethod, lang: 'ar' | 'en' = 'ar'): string {
	return PAYMENT_LABELS[method]?.[lang] ?? method;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateAddress(address: {
	address?: string;
	latitude?: string | number;
	longitude?: string | number;
}): string | null {
	if (!address.address?.trim()) return 'العنوان مطلوب';
	if (!address.latitude || !address.longitude) return 'الموقع الجغرافي مطلوب';
	return null;
}

// ─── Cookie helpers (browser-safe) ────────────────────────────────────────────

export function getCookieClient(name: string): string | null {
	if (typeof document === 'undefined') return null;
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
	return null;
}