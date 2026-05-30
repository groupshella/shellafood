/**
 * Payment Methods Constants
 * 
 * Centralized payment method definitions for order flow.
 * 
 * @module features/pick-and-order/lib/utils/paymentMethods
 */

import { CreditCard, Wallet, Wallet2, Smartphone } from "lucide-react";
import type { PaymentMethodUI } from '../../types/pick-and-order.types';

export const PAYMENT_METHODS: PaymentMethodUI[] = [
	{
		id: "card",
		icon: CreditCard,
		titleEn: "Pay with Credit / Mada Card",
		titleAr: "الدفع ببطاقة مدى / الائتمان",
		descriptionEn: "Secure payment using Visa, MasterCard, or Mada.",
		descriptionAr: "دفع آمن باستخدام فيزا، ماستركارد، أو مدى.",
		buttonTextEn: "Complete Payment via Credit Card",
		buttonTextAr: "إتمام الدفع ببطاقة الائتمان",
	},
	{
		id: "cash",
		icon: Wallet,
		titleEn: "Pay on Delivery (COD)",
		titleAr: "الدفع عند الاستلام",
		descriptionEn: "Pay directly when you receive your delivery.",
		descriptionAr: "ادفع مباشرة عند استلام الشحنة.",
		buttonTextEn: "Complete Payment on Delivery",
		buttonTextAr: "إتمام الدفع عند الاستلام",
	},
	{
		id: "apple-pay",
		icon: Wallet2,
		titleEn: "Standard Wallet",
		titleAr: "المحفظة العادية",
		descriptionEn: "Use your regular in-app wallet balance.",
		descriptionAr: "استخدم رصيد محفظتك العادية في التطبيق.",
		buttonTextEn: "Complete Payment via Standard Wallet",
		buttonTextAr: "إتمام الدفع من المحفظة العادية",
	},
	{
		id: "qaydha-wallet",
		icon: Smartphone,
		titleEn: "Qaydha Wallet",
		titleAr: "محفظة قيدها",
		descriptionEn: "Secure payment through your registered Qaydha account wallet.",
		descriptionAr: "ادفع بأمان من خلال محفظة حسابك المسجلة في قيدها.",
		buttonTextEn: "Complete Payment via Qaydha Wallet",
		buttonTextAr: "إتمام الدفع من محفظة قيدها",
	},
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

