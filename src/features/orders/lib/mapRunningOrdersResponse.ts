import type { PaymentStatus, ProductOrder, ProductOrderStatus } from "../types";

/** Shape from `GET /api/v1/customer/order/running-orders` */
export interface RunningOrdersApiResponse {
	total_size: number;
	limit: string | number;
	offset: string | number;
	orders: RunningOrderRow[];
}

/** Laravel may send amounts as numbers or numeric strings */
export interface RunningOrderRow {
	id: number;
	order_type?: string;
	order_status: string;
	payment_status?: string;
	payment_method?: string;
	created_at: string;
	updated_at?: string;
	details_count: number;

	/** Primary total — often present on full resources; list may omit */
	order_amount?: number | string | null;
	/** Alternate keys seen in Laravel / StackFood forks */
	amount?: number | string | null;
	total_order_amount?: number | string | null;
	order_total?: number | string | null;
	grand_total?: number | string | null;

	store: {
		id: number;
		name: string;
		logo?: string | null;
		logo_full_url?: string | null;
	};

	delivery_address?: {
		address?: string | null;
		contact_person_number?: string | null;
		contact_person_name?: string | null;
	};
}

/** First finite number wins */
function parseAmount(...values: unknown[]): number | null {
	for (const v of values) {
		if (v === null || v === undefined || v === "") continue;
		const n = typeof v === "string" ? parseFloat(v.trim()) : Number(v);
		if (Number.isFinite(n)) return n;
	}
	return null;
}

function mapOrderStatus(apiStatus: string): ProductOrderStatus {
	const key = apiStatus.toLowerCase();
	const statusMap: Record<string, ProductOrderStatus> = {
		pending: "pending",
		accepted: "preparing",
		confirmed: "preparing",
		processing: "preparing",
		handover: "ready",
		picked_up: "delivering",
		out_for_delivery: "delivering",
		delivered: "completed",
		completed: "completed",
		canceled: "cancelled",
		cancelled: "cancelled",
		refund_requested: "cancelled",
		refunded: "cancelled",
		failed: "cancelled",
	};
	return statusMap[key] ?? "pending";
}

function mapPaymentStatus(apiStatus: string | undefined): PaymentStatus {
	if (!apiStatus) return "pending";
	const key = apiStatus.toLowerCase();
	const statusMap: Record<string, PaymentStatus> = {
		paid: "paid",
		unpaid: "pending",
		pending: "pending",
		failed: "failed",
		partially_paid: "pending",
	};
	return statusMap[key] ?? "pending";
}

function normalizePaymentMethod(raw: string | undefined): string {
	if (raw == null || String(raw).trim() === "") return "—";
	const m = String(raw).toLowerCase();
	const labels: Record<string, string> = {
		cod: "الدفع عند الاستلام",
		cash_on_delivery: "الدفع عند الاستلام",
		wallet: "المحفظة",
		digital_payment: "دفع إلكتروني",
		online: "دفع إلكتروني",
		card: "بطاقة",
		mada: "مدى",
	};
	return labels[m] ?? raw;
}

function streetAddress(order: RunningOrderRow): string | undefined {
	const a = order.delivery_address?.address?.trim();
	return a ? a : undefined;
}

export function mapRunningOrdersResponse(
	apiData: RunningOrdersApiResponse,
): { products: ProductOrder[]; totalSize: number } {
	const products: ProductOrder[] = (apiData.orders ?? []).map((order) => {
		const logo =
			order.store.logo_full_url ?? order.store.logo ?? undefined;

		const extra = order as RunningOrderRow & Record<string, unknown>;

		const totalAmount = parseAmount(
			order.order_amount,
			order.amount,
			order.total_order_amount,
			order.order_total,
			order.grand_total,
			extra.total_order_amount,
			extra.order_amount,
			extra.amount,
		);

		const addressLine = streetAddress(order);

		const paymentRaw =
			(typeof extra.payment_method === "string"
				? extra.payment_method
				: undefined) ?? order.payment_method;

		const phone = order.delivery_address?.contact_person_number?.trim();
		const contactName = order.delivery_address?.contact_person_name?.trim();

		return {
			id: String(order.id),
			orderNumber: String(order.id),
			storeId: order.store.id,
			storeName: order.store.name,
			storeNameAr: order.store.name,
			storeLogo: logo,
			status: mapOrderStatus(order.order_status),
			createdAt: order.created_at,
			updatedAt: order.updated_at,
			items: [],
			totalAmount,
			paymentMethod: normalizePaymentMethod(paymentRaw),
			paymentStatus: mapPaymentStatus(order.payment_status),
			address: addressLine || undefined,
			deliveryPhone: phone || undefined,
			deliveryContactName: contactName || undefined,
			detailsCount: order.details_count,
			orderType: order.order_type,
		};
	});

	return {
		products,
		totalSize: apiData.total_size ?? products.length,
	};
}
