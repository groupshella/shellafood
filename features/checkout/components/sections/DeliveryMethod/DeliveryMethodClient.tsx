"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { MOCK_ADDRESSES } from "@/features/checkout/constants/checkout.constants";
import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { useBottomSheet } from "@/features/checkout/components/shared/useBottomSheet";
import type { CheckoutData, DeliveryMethodType, SavedAddress } from "@/features/checkout/types/checkout.types";

interface DeliveryMethodClientProps {
    data: CheckoutData;
}

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
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-right transition-colors ${
                selected
                    ? "border-[#30913F] bg-[#EBFEEB]"
                    : "border-gray-200 bg-[#F6F5F8]"
            }`}
        >
            <div>
                <p className="text-[14px] font-semibold text-gray-900">{label}</p>
                <p className={`text-[12px] ${selected ? "text-[#30913F]" : "text-gray-500"}`}>
                    {subLabel}
                </p>
            </div>
            <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-[#30913F]" : "border-gray-300"
                }`}
            >
                {selected && <div className="h-2.5 w-2.5 rounded-full bg-[#30913F]" />}
            </div>
        </button>
    );
}

interface SelectAddressSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    addresses: SavedAddress[];
    selectedId: number;
    onSelect: (address: SavedAddress) => void;
}

function SelectAddressSheet({
    isOpen,
    isVisible,
    onClose,
    addresses,
    selectedId,
    onSelect,
}: SelectAddressSheetProps) {
    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel="إختار العنوان"
            title="إختار العنوان"
        >
            <div className="space-y-3">
                {addresses.map((address) => {
                    const isSelected = address.id === selectedId;

                    return (
                        <button
                            key={address.id}
                            type="button"
                            onClick={() => {
                                onSelect(address);
                                onClose();
                            }}
                            className={`flex w-full items-center justify-between rounded-xl border p-4 text-right transition-colors ${
                                isSelected
                                    ? "border-[#30913F] bg-[#EBFEEB]"
                                    : "border-gray-200 bg-[#F6F5F8]"
                            }`}
                        >
                            <div>
                                <p className="text-[14px] font-semibold text-gray-900">
                                    {address.label}
                                </p>
                                <p className="text-[13px] text-gray-600">{address.address}</p>
                            </div>
                            <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                    isSelected ? "border-[#30913F]" : "border-gray-300"
                                }`}
                            >
                                {isSelected && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#30913F]" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 space-y-3">
                <button
                    type="button"
                    className="w-full rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
                >
                    أضف عنوان جديد
                </button>
                <button
                    type="button"
                    className="w-full rounded-xl bg-[#F6F5F8] py-3.5 text-[14px] font-semibold text-gray-700 transition-colors active:bg-gray-200"
                >
                    تعديل العناوين
                </button>
            </div>
        </CheckoutBottomSheet>
    );
}

export function DeliveryMethodClient({ data }: DeliveryMethodClientProps) {
    const [method, setMethod] = useState<DeliveryMethodType>(data.deliveryMethod);
    const [selectedAddress, setSelectedAddress] = useState<SavedAddress>(MOCK_ADDRESSES[0]);
    const addressSheet = useBottomSheet();

    return (
        <div dir="rtl">
            <h2 className="mb-3 text-[15px] font-bold text-gray-900">طريقة الاستلام</h2>

            <div className="space-y-3">
                <DeliveryOptionCard
                    selected={method === "delivery"}
                    onSelect={() => setMethod("delivery")}
                    label="توصيل الطلبات للعنوان"
                    subLabel="إضافي 31.95 ﷼"
                />
                <DeliveryOptionCard
                    selected={method === "pickup"}
                    onSelect={() => setMethod("pickup")}
                    label="استلام من المتجر"
                    subLabel="مجاني"
                />
            </div>

            {method === "delivery" && (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={addressSheet.open}
                        className="mb-2 flex items-center gap-1 text-[13px] font-medium text-[#30913F]"
                    >
                        <span>سيصلك على {data.deliveryAddressShort}</span>
                        <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#30913F]" strokeWidth={2} />
                        <p className="text-[13px] leading-relaxed text-gray-600">
                            {selectedAddress.address}
                        </p>
                    </div>
                </div>
            )}

            {method === "pickup" && (
                <div className="mt-4">
                    <h2 className="mb-3 text-[15px] font-bold text-gray-900">عنوان المتجر</h2>
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#30913F]" strokeWidth={2} />
                        <p className="text-[13px] leading-relaxed text-gray-600">
                            {data.deliveryAddress}
                        </p>
                    </div>
                </div>
            )}

            <SelectAddressSheet
                isOpen={addressSheet.isOpen}
                isVisible={addressSheet.isVisible}
                onClose={addressSheet.close}
                addresses={MOCK_ADDRESSES}
                selectedId={selectedAddress.id}
                onSelect={setSelectedAddress}
            />
        </div>
    );
}
