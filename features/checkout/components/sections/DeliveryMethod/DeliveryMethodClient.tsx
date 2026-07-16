"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { AddressPickerSheet } from "@/features/addresses/components/shared/AddressPickerSheet";
import { useSelectedAddress } from "@/features/addresses/hooks/useSelectedAddress";
import { formatAddressLine } from "@/features/addresses/lib/format-address-line";
import type { AddressListItem } from "@/features/addresses/types/address.types";
import type { DeliveryMethodType } from "@/features/checkout/types/checkout.types";
import { useCheckout } from "@/features/checkout/context/CheckoutContext";

interface DeliveryMethodClientProps {
	isAuthenticated: boolean;
	addresses: AddressListItem[];
	isArabic: boolean;
}

const SECTION_HEADING = "mb-3 text-sm font-bold text-foreground sm:text-[15px]";

interface DeliveryOptionCardProps {
	selected: boolean;
	onSelect: () => void;
	label: string;
	subLabel: string;
}

function DeliveryOptionCard({ selected, onSelect, label, subLabel }: DeliveryOptionCardProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={[
				"flex min-h-[4.5rem] w-full items-center justify-between rounded-xl border p-3.5 text-start transition-colors sm:min-h-20 sm:p-4",
				selected
					? "border-brand bg-brand/10"
					: "border-border bg-card",
			].join(" ")}
			aria-pressed={selected}
		>
			<div className="flex min-w-0 flex-col items-start gap-0.5">
				<p className="text-sm font-semibold text-foreground sm:text-[15px]">{label}</p>
				<p className={`text-xs sm:text-[13px] ${selected ? "text-brand" : "text-muted"}`}>
					{subLabel}
				</p>
			</div>
			<div
				className={[
					"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:h-[22px] sm:w-[22px]",
					selected ? "border-brand" : "border-border",
				].join(" ")}
				aria-hidden
			>
				{selected && (
					<div className="h-2.5 w-2.5 rounded-full bg-brand sm:h-3 sm:w-3" />
				)}
			</div>
		</button>
	);
}

export function DeliveryMethodClient({
	isAuthenticated,
	addresses,
	isArabic,
}: DeliveryMethodClientProps) {
	const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
	const {
		deliveryMethod,
		setDeliveryMethod,
		updateDeliveryAddress,
		invoice,
		data,
	} = useCheckout();
	const { selectedAddress, selectedId, setSelectedAddressId } = useSelectedAddress(addresses);
	const store = data.storeSummary;

	useEffect(() => {
		if (selectedAddress) {
			updateDeliveryAddress(selectedAddress);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAddress?.id]);

	function handleSelectMethod(method: DeliveryMethodType) {
		setDeliveryMethod(method);
	}

	function handleSelectAddress(id: number) {
		setSelectedAddressId(id);
		const addr = addresses.find((a) => a.id === id);
		if (addr) updateDeliveryAddress(addr);
	}

	const deliverySubLabel =
		invoice.deliveryFee === "0 ﷼" || invoice.deliveryFee.startsWith("0 ")
			? isArabic
				? "مجاني"
				: "Free"
			: isArabic
				? `إضافي ${invoice.deliveryFee}`
				: `Extra ${invoice.deliveryFee}`;

	return (
		<div dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"}>
			<h2 className={SECTION_HEADING}>
				{isArabic ? "طريقة الاستلام" : "Fulfillment method"}
			</h2>

			<div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
				<DeliveryOptionCard
					selected={deliveryMethod === "delivery"}
					onSelect={() => handleSelectMethod("delivery")}
					label={isArabic ? "توصيل الطلبات للعنوان" : "Deliver to address"}
					subLabel={
						deliveryMethod === "delivery"
							? deliverySubLabel
							: isArabic
								? "يُحسب حسب المسافة"
								: "Calculated by distance"
					}
				/>
				<DeliveryOptionCard
					selected={deliveryMethod === "pickup"}
					onSelect={() => handleSelectMethod("pickup")}
					label={isArabic ? "استلام من المتجر" : "Pickup from store"}
					subLabel={isArabic ? "مجاني" : "Free"}
				/>
			</div>

			{deliveryMethod === "delivery" && (
				<div className="mt-4 sm:mt-5">
					{!isAuthenticated ? (
						<Link
							href="/auth"
							className="inline-flex min-h-10 items-center gap-1.5 rounded-lg text-sm font-medium text-brand transition-colors active:brightness-95 sm:text-[15px]"
						>
							<MapPin
								className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]"
								strokeWidth={2}
							/>
							<span>
								{isArabic
									? "سجل الدخول لإضافة عنوان"
									: "Sign in to add an address"}
							</span>
						</Link>
					) : !selectedAddress ? (
						<div className="space-y-1.5">
							<p className="text-xs text-muted sm:text-[13px]">
								{isArabic
									? "لا يوجد عنوان محفوظ بعد"
									: "No saved address yet"}
							</p>
							<Link
								href="/addresses/add"
								className="inline-flex min-h-10 items-center text-sm font-medium text-brand transition-colors active:brightness-95 sm:text-[15px]"
							>
								{isArabic ? "أضف عنوان جديد" : "Add a new address"}
							</Link>
						</div>
					) : (
						<>
							<button
								type="button"
								onClick={() => setIsAddressSheetOpen(true)}
								className="mb-2 flex min-h-10 items-center gap-1 text-sm font-medium text-brand transition-colors active:brightness-95 sm:text-[15px]"
							>
								<span>
									{isArabic
										? `سيصلك على ${selectedAddress.address_label}`
										: `Delivering to ${selectedAddress.address_label}`}
								</span>
								<ChevronDown
									className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
									strokeWidth={2.5}
								/>
							</button>
							<div className="flex items-start gap-2 sm:gap-2.5">
								<MapPin
									className="mt-0.5 h-4 w-4 shrink-0 text-brand sm:h-[18px] sm:w-[18px]"
									strokeWidth={2}
								/>
								<p className="text-xs leading-relaxed text-muted sm:text-[13px]">
									{formatAddressLine(selectedAddress, isArabic)}
								</p>
							</div>
						</>
					)}
				</div>
			)}

			{deliveryMethod === "pickup" && (
				<div className="mt-4 sm:mt-5">
					<h3 className="mb-2 text-sm font-bold text-foreground sm:text-[15px]">
						{isArabic ? "عنوان المتجر" : "Store address"}
					</h3>
					<div className="flex items-start gap-2 sm:gap-2.5">
						<MapPin
							className="mt-0.5 h-4 w-4 shrink-0 text-brand sm:h-[18px] sm:w-[18px]"
							strokeWidth={2}
						/>
						<div className="min-w-0">
							{store ? (
								<>
									<p className="text-sm font-medium text-foreground">{store.name}</p>
									<p className="mt-0.5 text-xs leading-relaxed text-muted sm:text-[13px]">
										{store.address}
									</p>
								</>
							) : (
								<p className="text-xs leading-relaxed text-muted sm:text-[13px]">
									{isArabic
										? "تعذر جلب عنوان المتجر حالياً"
										: "Could not load the store address right now"}
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{isAuthenticated && (
				<AddressPickerSheet
					isOpen={isAddressSheetOpen}
					onClose={() => setIsAddressSheetOpen(false)}
					addresses={addresses}
					selectedId={selectedId}
					onSelect={handleSelectAddress}
					isArabic={isArabic}
				/>
			)}
		</div>
	);
}
