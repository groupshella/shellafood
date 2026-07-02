"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { AddressPickerSheet } from "@/features/addresses/components/shared/AddressPickerSheet";
import { useSelectedAddress } from "@/features/addresses/hooks/useSelectedAddress";
import { formatAddressLine } from "@/features/addresses/lib/format-address-line";
import type { AddressListItem } from "@/features/addresses/types/address.types";
import type { DeliveryMethodType } from "@/features/checkout/types/checkout.types";

interface DeliveryMethodClientProps {
    isAuthenticated: boolean;
    addresses: AddressListItem[];
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

export function DeliveryMethodClient({ isAuthenticated, addresses }: DeliveryMethodClientProps) {
    const [method, setMethod] = useState<DeliveryMethodType>("delivery");
    const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
    const { selectedAddress, selectedId, setSelectedAddressId } = useSelectedAddress(addresses);

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
                    {!isAuthenticated ? (
                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#30913F] transition-colors active:text-[#267332]"
                        >
                            <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} />
                            <span>سجل الدخول لإضافة عنوان</span>
                        </Link>
                    ) : !selectedAddress ? (
                        <div className="space-y-2">
                            <p className="text-[13px] text-gray-500">لا يوجد عنوان محفوظ بعد</p>
                            <Link
                                href="/addresses/add"
                                className="inline-flex text-[13px] font-medium text-[#30913F] transition-colors active:text-[#267332]"
                            >
                                أضف عنوان جديد
                            </Link>
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsAddressSheetOpen(true)}
                                className="mb-2 flex items-center gap-1 text-[13px] font-medium text-[#30913F]"
                            >
                                <span>سيصلك على {selectedAddress.address_label}</span>
                                <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                            <div className="flex items-start gap-2">
                                <MapPin
                                    className="mt-0.5 h-4 w-4 shrink-0 text-[#30913F]"
                                    strokeWidth={2}
                                />
                                <p className="text-[13px] leading-relaxed text-gray-600">
                                    {formatAddressLine(selectedAddress)}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {method === "pickup" && (
                <div className="mt-4">
                    <h2 className="mb-3 text-[15px] font-bold text-gray-900">عنوان المتجر</h2>
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#30913F]" strokeWidth={2} />
                        <p className="text-[13px] leading-relaxed text-gray-600">
                            سيتم عرض عنوان المتجر عند تأكيد الطلب
                        </p>
                    </div>
                </div>
            )}

            {isAuthenticated && (
                <AddressPickerSheet
                    isOpen={isAddressSheetOpen}
                    onClose={() => setIsAddressSheetOpen(false)}
                    addresses={addresses}
                    selectedId={selectedId}
                    onSelect={setSelectedAddressId}
                />
            )}
        </div>
    );
}
