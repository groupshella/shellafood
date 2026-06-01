// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderType = 'delivery' | 'take_away';

export type PaymentMethod =
	| 'cash_on_delivery'
	| 'wallet'
	| 'wallet_qidha'
	| 'digital_payment';

export type OrderStatus =
	| 'pending'
	| 'confirmed'
	| 'processing'
	| 'handover'
	| 'picked_up'
	| 'delivered'
	| 'canceled'
	| 'failed';

export type PaymentStatus = 'paid' | 'unpaid' | 'partially_paid';

// ─── Address ──────────────────────────────────────────────────────────────────

export interface DeliveryAddress {
	address: string;
	latitude: string | number;
	longitude: string | number;
	contact_person_name?: string;
	contact_person_number?: string;
	address_type?: string;
	floor?: string;
	road?: string;
	house?: string;
}

// ─── Place Order ─────────────────────────────────────────────────────────────

export interface PlaceOrderPayload {
	order_amount: number;
	order_type: OrderType;
	store_id: number;
	distance?: number;
	address?: string;
	longitude?: string | number;
	latitude?: string | number;
	contact_person_name?: string;
	contact_person_number?: string;
	order_note?: string;
	coupon_code?: string;
	dm_tips?: number;
	schedule_at?: string;
	guest_id?: string;
	use_cart?: boolean;
}

export interface PlaceOrderResponse {
	message: string;
	order_id: number;
	total_ammount: number;
	status: OrderStatus;
	payment_status: PaymentStatus;
	created_at: string;
	user_id: number;
}

// ─── Process Payment ─────────────────────────────────────────────────────────

export interface ProcessPaymentPayload {
	order_id: number;
	payment_method: PaymentMethod;
	amount: number;
}

export interface ProcessPaymentResponse {
	message: string;
	order_id: number;
	payment_method: PaymentMethod;
	amount: number;
	status: PaymentStatus;
	transaction_id: string;
}

// ─── Delivery Info (prepare_payment response) ────────────────────────────────

export interface DeliveryInfo {
	delivery_charge: number;
	original_delivery_charge: number;
	total_amount: number;
	final_total: number;
	dm_tips: number;
	additional_charge: number;
	extra_packaging_amount: number;
	available_payment_methods: PaymentMethod[];
}

// ─── Checkout State ───────────────────────────────────────────────────────────

export interface CheckoutState {
	// Step
	step: 'address' | 'payment' | 'confirm' | 'success';

	// Order config
	orderType: OrderType;
	address: DeliveryAddress | null;
	paymentMethod: PaymentMethod | null;
	orderNote: string;
	dmTips: number;
	couponCode: string;

	// Derived from backend
	deliveryInfo: DeliveryInfo | null;
	placedOrderId: number | null;
	orderAmount: number;

	// UI
	isLoading: boolean;
	error: string | null;
}

// ─── Hook Return ──────────────────────────────────────────────────────────────

export interface UseCheckoutReturn {
	state: CheckoutState;
	// Step navigation
	goToPayment: () => void;
	goToConfirm: () => void;
	goBack: () => void;
	// Setters
	setAddress: (address: DeliveryAddress) => void;
	setPaymentMethod: (method: PaymentMethod) => void;
	setOrderNote: (note: string) => void;
	setDmTips: (tips: number) => void;
	setCouponCode: (code: string) => void;
	setOrderType: (type: OrderType) => void;
	// Actions
	placeOrder: () => Promise<void>;
	processPayment: () => Promise<void>;
}