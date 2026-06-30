"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { AddressListItem } from "../../types/address.types";

interface AddressPickerSheetProps {
    isOpen: boolean;
    onClose: () => void;
    addresses: AddressListItem[];
    selectedId: number | null;
    onSelect: (id: number) => void;
}

function formatAddressLine(address: AddressListItem): string {
    return [address.city, address.region, address.street_name].filter(Boolean).join(" ، ");
}

export function AddressPickerSheet({
    isOpen,
    onClose,
    addresses,
    selectedId,
    onSelect,
}: AddressPickerSheetProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/40 transition-opacity"
                onClick={onClose}
                aria-hidden
            />

            <div
                role="dialog"
                aria-modal
                aria-label="إختار العنوان"
                className="fixed inset-x-0 bottom-15 z-50 rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-xl sm:inset-x-auto sm:start-1/2 sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
                dir="rtl"
            >
                <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

                <div className="relative mb-5 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="absolute start-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors active:bg-gray-200"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <h2 className="text-base font-bold text-gray-900">إختار العنوان</h2>
                </div>

                <div className="mb-5 max-h-[min(50vh,320px)] space-y-2 overflow-y-auto">
                    {addresses.length === 0 ? (
                        <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                            لا توجد عناوين محفوظة بعد
                        </p>
                    ) : (
                        addresses.map((address) => {
                            const isSelected = address.id === selectedId;

                            return (
                                <button
                                    key={address.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(address.id);
                                        onClose();
                                    }}
                                    className={[
                                        "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-right transition-colors",
                                        isSelected
                                            ? "bg-[#EEF8F0]"
                                            : "bg-white hover:bg-gray-50",
                                    ].join(" ")}
                                >


                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-bold text-gray-900">
                                            ({address.address_label})
                                        </span>
                                        <span className="mt-0.5 block text-xs leading-relaxed text-gray-600">
                                            {formatAddressLine(address)}
                                        </span>
                                    </span>
                                    <span
                                        className={[
                                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                                            isSelected
                                                ? "bg-gray-900 text-white"
                                                : "border-2 border-gray-200 bg-white",
                                        ].join(" ")}
                                        aria-hidden
                                    >
                                        {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>

                <div className="space-y-3">
                    <Link
                        href="/addresses/add"
                        onClick={onClose}
                        className="flex w-full items-center justify-center rounded-xl bg-[#30913F] py-3.5 text-sm font-semibold text-white transition-colors active:bg-[#267332]"
                    >
                        أضف عنوان جديد
                    </Link>

                    <Link
                        href="/addresses"
                        onClick={onClose}
                        className="flex w-full items-center justify-center rounded-xl border border-[#30913F]/20 bg-white py-3.5 text-sm font-semibold text-[#30913F] transition-colors active:bg-[#30913F]/5"
                    >
                        تعديل العناوين
                    </Link>
                </div>
            </div>
        </>
    );
}
