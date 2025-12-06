/**
 * Orders Feature Types
 * Type definitions for order-related entities
 */

export type OrderTab = "products" | "services" | "delivery";

export type ProductOrderStatus = "pending" | "preparing" | "ready" | "delivering" | "completed" | "cancelled";
export type ServiceOrderStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
export type DeliveryOrderStatus = "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "completed" | "cancelled";

export type PaymentStatus = "paid" | "pending" | "failed";

export interface ProductOrderItem {
	id: string;
	productName: string;
	productNameAr?: string;
	image?: string;
	quantity: number;
	price: number;
}

export interface ProductOrder {
	id: string;
	orderNumber: string;
	storeName: string;
	storeNameAr?: string;
	storeLogo?: string;
	status: ProductOrderStatus;
	createdAt: string;
	items: ProductOrderItem[];
	totalAmount: number;
	paymentMethod: string;
	paymentStatus: PaymentStatus;
	address?: string;
}

export interface ServiceRequest {
	id: string;
	requestNumber: string;
	serviceName: string;
	serviceNameAr?: string;
	serviceImage?: string;
	status: ServiceOrderStatus;
	workerId?: string;
	workerName?: string;
	workerPhoto?: string;
	address?: string;
	preferredDate?: string;
	preferredTime?: string;
	urgency: "normal" | "urgent" | "emergency";
	paymentMethod?: string;
	paymentStatus?: PaymentStatus;
	totalAmount: number;
	createdAt: string;
	hasImages?: boolean;
}

export interface DeliveryOrder {
	id: string;
	orderNumber: string;
	transportType: "motorbike" | "truck";
	status: DeliveryOrderStatus;
	createdAt: string;
	senderName: string;
	senderPhone: string;
	senderAddress: string;
	receiverName: string;
	receiverPhone: string;
	receiverAddress: string;
	distance: number;
	deliveryFee: number;
	totalAmount: number;
	paymentMethod: string;
	paymentStatus: PaymentStatus;
	driverName?: string;
	driverPhoto?: string;
	orderType: "one-way" | "multi-direction";
	allPickupPoints?: Array<{
		name: string;
		phone: string;
		address: string;
		additionalDetails?: string;
	}>;
	allDropoffPoints?: Array<{
		name: string;
		phone: string;
		address: string;
		additionalDetails?: string;
	}>;
	packageDescription?: string;
	packageWeight?: string;
	packageDimensions?: string;
	specialInstructions?: string;
	isExpress?: boolean;
	requiresRefrigeration?: boolean;
	loadingEquipmentNeeded?: boolean;
	pricing?: {
		basePrice: number;
		platformFee: number;
		subtotal: number;
		vat: number;
		total: number;
		distance: number;
	};
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface OrdersResponse {
	products: ProductOrder[];
	services: ServiceRequest[];
	delivery: DeliveryOrder[];
}

