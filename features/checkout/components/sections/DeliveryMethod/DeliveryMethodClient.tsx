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

const SECTION_HEADING = "mb-3 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]";

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
                "flex min-h-[4.5rem] w-full items-center justify-between rounded-xl border p-3.5 text-right transition-colors sm:min-h-20 sm:p-4",
                selected
                    ? "border-[#30913F] bg-[#EBFEEB] dark:border-[#30913F] dark:bg-[#0d2e12]"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
            ].join(" ")}
            aria-pressed={selected}
        >
            <div className="flex min-w-0 flex-col items-start gap-0.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-[15px]">{label}</p>
                <p className={`text-xs sm:text-[13px] ${selected ? "text-[#30913F]" : "text-gray-500 dark:text-gray-400"}`}>
                    {subLabel}
                </p>
            </div>
            <div
                className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:h-[22px] sm:w-[22px]",
                    selected
                        ? "border-[#30913F]"
                        : "border-gray-300 dark:border-gray-600",
                ].join(" ")}
                aria-hidden
            >
                {selected && <div className="h-2.5 w-2.5 rounded-full bg-[#30913F] sm:h-3 sm:w-3" />}
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
            <h2 className={SECTION_HEADING}>طريقة الاستلام</h2>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
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
                <div className="mt-4 sm:mt-5">
                    {!isAuthenticated ? (
                        <Link
                            href="/auth"
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg text-sm font-medium text-[#30913F] transition-colors active:text-[#267332] dark:text-[#4db860] sm:text-[15px]"
                        >
                            <MapPin className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
                            <span>سجل الدخول لإضافة عنوان</span>
                        </Link>
                    ) : !selectedAddress ? (
                        <div className="space-y-1.5">
                            <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-[13px]">لا يوجد عنوان محفوظ بعد</p>
                            <Link
                                href="/addresses/add"
                                className="inline-flex min-h-10 items-center text-sm font-medium text-[#30913F] transition-colors active:text-[#267332] dark:text-[#4db860] sm:text-[15px]"
                            >
                                أضف عنوان جديد
                            </Link>
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsAddressSheetOpen(true)}
                                className="mb-2 flex min-h-10 items-center gap-1 text-sm font-medium text-[#30913F] transition-colors active:text-[#267332] dark:text-[#4db860] sm:text-[15px]"
                            >
                                <span>سيصلك على {selectedAddress.address_label}</span>
                                <ChevronDown className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} />
                            </button>
                            <div className="flex items-start gap-2 sm:gap-2.5">
                                <MapPin
                                    className="mt-0.5 h-4 w-4 shrink-0 text-[#30913F] dark:text-[#4db860] sm:h-[18px] sm:w-[18px]"
                                    strokeWidth={2}
                                />
                                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[13px]">
                                    {formatAddressLine(selectedAddress)}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {method === "pickup" && (
                <div className="mt-4 sm:mt-5">
                    <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">عنوان المتجر</h3>
                    <div className="flex items-start gap-2 sm:gap-2.5">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#30913F] dark:text-[#4db860] sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[13px]">
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
