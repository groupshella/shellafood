"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaceOrder } from "@/features/checkout/hooks/usePlaceOrder";
import {
	calculateInvoiceTotals,
	formatCheckoutInvoice,
} from "@/features/checkout/lib/invoice";
import type {
	CheckoutData,
	CheckoutInvoice,
	DeliveryMethodType,
	ElectronicPaymentType,
	PaymentMethodType,
	PlaceOrderPayload,
} from "@/features/checkout/types/checkout.types";
import type { AddressListItem } from "@/features/addresses/types/address.types";
import { formatAddressLine } from "@/features/addresses/lib/format-address-line";
import { useNotification } from "@/shared/components/NotificationToast";

function parseInvoiceAmount(formatted: string): number {
	return Number(formatted.replace(/[^\d.]/g, "")) || 0;
}

async function qidhaDebit(
	amount: number,
	orderId: number,
	isArabic: boolean,
): Promise<void> {
	const res = await fetch("/api/profile/qidha/pay", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ amount, order_id: orderId }),
	});
	if (!res.ok) {
		const json = await res.json().catch(() => ({}));
		throw new Error(
			(json as { message?: string }).message ??
				(isArabic
					? "فشل الخصم من محفظة قيدها"
					: "Failed to debit from Qidha wallet"),
		);
	}
}

interface CheckoutContextValue {
	data: CheckoutData;
	payload: PlaceOrderPayload;
	invoice: CheckoutInvoice;
	deliveryMethod: DeliveryMethodType;
	selected: PaymentMethodType;
	electronicMethod: ElectronicPaymentType;
	showPaymentWarning: boolean;
	isPlacingOrder: boolean;
	orderError: string | null;
	/** False when cart subtotal is below store minimum_order. */
	canPlaceOrder: boolean;
	isArabic: boolean;
	setSelected: (id: PaymentMethodType) => void;
	setElectronicMethod: (id: ElectronicPaymentType) => void;
	setDeliveryMethod: (method: DeliveryMethodType) => void;
	updateDeliveryAddress: (address: AddressListItem) => void;
	confirmPayment: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

interface CheckoutProviderProps {
	data: CheckoutData;
	isArabic: boolean;
	children: React.ReactNode;
}

export function CheckoutProvider({ data, isArabic, children }: CheckoutProviderProps) {
	const lang = isArabic ? "ar" : "en";
	const router = useRouter();
	const { placeOrder, isLoading: isPlacingOrder } = usePlaceOrder();
	const { error: notifyError, success: notifySuccess } = useNotification();

	const [selected, setSelectedState] = useState<PaymentMethodType>(null);
	const [electronicMethod, setElectronicMethodState] =
		useState<ElectronicPaymentType>(null);
	const [showPaymentWarning, setShowPaymentWarning] = useState(false);
	const [orderError, setOrderError] = useState<string | null>(null);
	const [deliveryMethod, setDeliveryMethodState] = useState<DeliveryMethodType>(
		data.deliveryMethod,
	);
	const [payload, setPayload] = useState<PlaceOrderPayload>(data.placeOrderPayload);
	const [invoice, setInvoice] = useState<CheckoutInvoice>(data.invoice);

	const priceFromCoords = useCallback(
		(method: DeliveryMethodType, latitude: string, longitude: string) => {
			return calculateInvoiceTotals({
				subtotal: data.subtotal,
				method,
				store: data.storeSummary,
				userLatitude: Number(latitude) || 0,
				userLongitude: Number(longitude) || 0,
			});
		},
		[data.storeSummary, data.subtotal],
	);

	const setSelected = (id: PaymentMethodType) => {
		setSelectedState(id);
		setShowPaymentWarning(false);
		setOrderError(null);
		if (id !== "electronic") {
			setElectronicMethodState(null);
		}
	};

	const setElectronicMethod = (id: ElectronicPaymentType) => {
		setElectronicMethodState(id);
		setShowPaymentWarning(false);
	};

	const setDeliveryMethod = useCallback(
		(method: DeliveryMethodType) => {
			setDeliveryMethodState(method);
			setPayload((prev) => {
				const totals = priceFromCoords(method, prev.latitude, prev.longitude);
				setInvoice(formatCheckoutInvoice(totals, method));
				return {
					...prev,
					order_type: method,
					distance: totals.distanceKm,
					order_amount: totals.total,
				};
			});
		},
		[priceFromCoords],
	);

	const updateDeliveryAddress = useCallback(
		(address: AddressListItem) => {
			const latitude = String(address.latitude);
			const longitude = String(address.longitude);
			const totals = priceFromCoords(deliveryMethod, latitude, longitude);

			setInvoice(formatCheckoutInvoice(totals, deliveryMethod));
			setPayload((prev) => ({
				...prev,
				address: formatAddressLine(address, isArabic),
				latitude,
				longitude,
				order_type: deliveryMethod,
				distance: totals.distanceKm,
				order_amount: totals.total,
			}));
		},
		[deliveryMethod, priceFromCoords, isArabic],
	);

	const canPlaceOrder = !invoice.belowMinimumOrder;

	const confirmPayment = useCallback(async () => {
		const fallbackError = isArabic
			? "تعذر إتمام الطلب، يرجى المحاولة مرة أخرى"
			: "Could not complete the order. Please try again";

		if (invoice.belowMinimumOrder) {
			notifyError(
				isArabic
					? `الحد الأدنى للطلب من هذا المتجر ${invoice.minimumOrder}`
					: `Minimum order for this store is ${invoice.minimumOrder}`,
			);
			return;
		}

		if (!selected) {
			setShowPaymentWarning(true);
			notifyError(
				isArabic ? "بالرجاء تحديد طريقة الدفع" : "Please select a payment method",
			);
			return;
		}

		setOrderError(null);

		if (selected === "my-wallet") {
			try {
				const { order_id } = await placeOrder(
					{ ...payload, payment_method: "wallet" },
					lang,
				);
				notifySuccess(
					isArabic ? "تم تأكيد طلبك بنجاح 🎉" : "Your order was confirmed 🎉",
				);
				router.push(`/my-orders/${order_id}`);
			} catch (err) {
				const message = err instanceof Error ? err.message : fallbackError;
				setOrderError(message);
				notifyError(message);
			}
			return;
		}

		if (selected === "qidha-wallet") {
			try {
				const { order_id } = await placeOrder(
					{ ...payload, payment_method: "wallet" },
					lang,
				);
				try {
					await qidhaDebit(payload.order_amount, order_id, isArabic);
				} catch {
					// Qidha debit failed — order is already placed, navigate and let backend reconcile
				}
				notifySuccess(
					isArabic ? "تم تأكيد طلبك بنجاح 🎉" : "Your order was confirmed 🎉",
				);
				router.push(`/my-orders/${order_id}`);
			} catch (err) {
				const message = err instanceof Error ? err.message : fallbackError;
				setOrderError(message);
				notifyError(message);
			}
			return;
		}

		try {
			const { order_id } = await placeOrder(payload, lang);

			const params = new URLSearchParams({
				orderId: String(order_id),
				amount: String(parseInvoiceAmount(invoice.total)),
				currency: "SAR",
			});

			router.push(`/checkout/payment?${params.toString()}`);
		} catch (err) {
			const message = err instanceof Error ? err.message : fallbackError;
			setOrderError(message);
			notifyError(message);
		}
	}, [
		invoice.belowMinimumOrder,
		invoice.minimumOrder,
		invoice.total,
		isArabic,
		lang,
		notifyError,
		notifySuccess,
		payload,
		placeOrder,
		router,
		selected,
	]);

	const contextData = useMemo(
		() => ({
			...data,
			deliveryMethod,
			invoice,
		}),
		[data, deliveryMethod, invoice],
	);

	return (
		<CheckoutContext.Provider
			value={{
				data: contextData,
				payload,
				invoice,
				deliveryMethod,
				selected,
				electronicMethod,
				showPaymentWarning,
				isPlacingOrder,
				orderError,
				canPlaceOrder,
				isArabic,
				setSelected,
				setElectronicMethod,
				setDeliveryMethod,
				updateDeliveryAddress,
				confirmPayment,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	);
}

export function useCheckout() {
	const context = useContext(CheckoutContext);
	if (!context) {
		throw new Error("useCheckout must be used within CheckoutProvider");
	}
	return context;
}
