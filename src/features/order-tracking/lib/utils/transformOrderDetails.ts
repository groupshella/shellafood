/**
 * Transform API order details response to OrderData format
 */

import { OrderData, OrderItem, TimelineStep, ORDER_TYPE } from '../../types';

interface OrderDetailsItem {
	id: number;
	item_id: number;
	order_id: number;
	price: number;
	quantity: number;
	tax_amount: number;
	discount_on_item: number;
	item_details: {
		id: number;
		name: string;
		image: string;
		image_full_url: string;
		store_name: string;
		module_id: number;
		module: {
			id: number;
			module_name: string;
			module_type: string;
		};
	};
	created_at: string;
	updated_at: string;
}

/**
 * Transform order details API response to OrderData
 */
export function transformOrderDetailsToOrderData(
	orderDetails: OrderDetailsItem[],
	orderId: string,
	language: 'en' | 'ar' = 'ar'
): OrderData {
	if (!orderDetails || orderDetails.length === 0) {
		throw new Error('Order details is empty');
	}

	const firstItem = orderDetails[0];
	const orderCreatedAt = new Date(firstItem.created_at);
	const isArabic = language === 'ar';

	// Calculate totals
	const subtotal = orderDetails.reduce((sum, item) => {
		return sum + (item.price * item.quantity) - item.discount_on_item;
	}, 0);

	const totalTax = orderDetails.reduce((sum, item) => sum + item.tax_amount, 0);
	const totalAmount = subtotal + totalTax;

	// Transform items
	const items: OrderItem[] = orderDetails.map((item) => ({
		name: item.item_details.name,
		quantity: item.quantity,
		price: item.price * item.quantity,
		image: item.item_details.image_full_url || item.item_details.image,
	}));

	// Get store info from first item
	const storeName = firstItem.item_details.store_name || '';
	const moduleName = firstItem.item_details.module?.module_name || '';

	// Determine status based on order age (temporary - should come from API)
	const hoursSinceCreation = (Date.now() - orderCreatedAt.getTime()) / (1000 * 60 * 60);
	let status = 'pending';
	if (hoursSinceCreation > 24) {
		status = 'completed';
	} else if (hoursSinceCreation > 2) {
		status = 'on_the_way';
	} else if (hoursSinceCreation > 0.5) {
		status = 'preparing';
	}

	// Build timeline based on status
	const timeline: TimelineStep[] = [
		{
			label: isArabic ? 'قيد الانتظار' : 'Pending',
			labelAr: 'قيد الانتظار',
			time: orderCreatedAt.toISOString(),
			comment: isArabic ? 'تم استلام الطلب' : 'Order received',
			commentAr: 'تم استلام الطلب',
		},
		{
			label: isArabic ? 'قيد التحضير' : 'Preparing',
			labelAr: 'قيد التحضير',
			time: status !== 'pending' ? new Date(orderCreatedAt.getTime() + 10 * 60 * 1000).toISOString() : '',
			comment: isArabic ? 'جارٍ تحضير طلبك' : 'Preparing your order',
			commentAr: 'جارٍ تحضير طلبك',
		},
		{
			label: isArabic ? 'قيد التوصيل' : 'Out for Delivery',
			labelAr: 'قيد التوصيل',
			time: ['on_the_way', 'completed'].includes(status) ? new Date(orderCreatedAt.getTime() + 30 * 60 * 1000).toISOString() : '',
			comment: isArabic ? 'السائق في الطريق' : 'Driver on the way',
			commentAr: 'السائق في الطريق',
		},
		{
			label: isArabic ? 'تم التوصيل' : 'Delivered',
			labelAr: 'تم التوصيل',
			time: status === 'completed' ? new Date(orderCreatedAt.getTime() + 2 * 60 * 60 * 1000).toISOString() : '',
			comment: isArabic ? 'تم توصيل الطلب' : 'Order delivered',
			commentAr: 'تم توصيل الطلب',
		},
	];

	// Calculate ETA (30-40 minutes from creation for ecommerce)
	const estimatedDeliveryTime = new Date(orderCreatedAt.getTime() + 35 * 60 * 1000);

	return {
		order_id: orderId,
		type: ORDER_TYPE.PRODUCT,
		status,
		eta: estimatedDeliveryTime.toISOString(),
		timeline,
		items,
		paymentMethod: 'Card', // Default - should come from API
		address: storeName ? `${storeName}, ${moduleName}` : moduleName, // Temporary - should come from API
		totalAmount,
		basePrice: subtotal,
		vat: totalTax,
		platformFee: 0, // Should come from API
		map: {
			user_lat: 24.7136, // Default Riyadh - should come from API
			user_lng: 46.6753,
		},
	};
}

