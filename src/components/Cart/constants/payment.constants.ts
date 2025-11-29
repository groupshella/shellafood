// Payment method constants

import { PaymentOption } from '../types/payment.types';

export const PAYMENT_METHODS: PaymentOption[] = [
	{
		id: 'apple_pay',
		labelEn: 'Apple Pay',
		labelAr: 'Apple Pay',
		icon: 'smartphone',
		requiresDetails: false,
	},
	{
		id: 'stc_pay',
		labelEn: 'STC Pay',
		labelAr: 'STC Pay',
		icon: 'smartphone',
		requiresDetails: false,
	},
	{
		id: 'card',
		labelEn: 'Credit/Debit Card',
		labelAr: 'بطاقة ائتمانية/مدفوعة مسبقاً',
		icon: 'credit-card',
		requiresDetails: true,
	},
	{
		id: 'cash',
		labelEn: 'Cash on Delivery',
		labelAr: 'الدفع عند الاستلام',
		icon: 'banknote',
		descriptionEn: 'Pay upon delivery',
		descriptionAr: 'ادفع عند الاستلام',
		requiresDetails: false,
	},
	{
		id: 'kaidha',
		labelEn: 'Kaidha Wallet',
		labelAr: 'محفظة كايدة',
		icon: 'wallet',
		requiresDetails: false,
	},
];

