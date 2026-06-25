"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddressPickerSheet } from "../../shared/AddressPickerSheet";
import { useSelectedAddress } from "../../../hooks/useSelectedAddress";
import { AddressListItem } from "../../../types/address.types";

interface AddressTopbarBannerClientProps {
    isAuthenticated: boolean;
    addresses: AddressListItem[];
    className?: string;
}

function formatAddressLine(address: AddressListItem): string {
    return [address.city, address.region, address.street_name].filter(Boolean).join(" ، ");
}

export function AddressTopbarBannerClient({
    isAuthenticated,
    addresses,
    className = "",
}: AddressTopbarBannerClientProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { selectedAddress, selectedId, setSelectedAddressId } = useSelectedAddress(addresses);

    if (!isAuthenticated) {
        return (
            <div className={className}>
                <Link
                    href="/auth"
                    className={[
                        "flex w-full items-center justify-between gap-3 rounded-xl bg-gray-100 px-3.5 py-3",
                        "transition-colors hover:bg-gray-200/80 active:scale-[0.99]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                    ].join(" ")}
                >
                    <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-gray-700 sm:text-[15px]">
                        انضم إلينا ، واستمتع بخدمات شلة
                    </p>
                    <ArrowLeft className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} aria-hidden />
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className={className}>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="عرض العناوين"
                    className={[
                        "flex w-full items-center justify-between gap-3 rounded-xl bg-gray-100 px-3.5 py-3 text-right",
                        "transition-colors hover:bg-gray-200/80 active:scale-[0.99]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                    ].join(" ")}
                >
                    <div className="min-w-0 flex-1">
                        {selectedAddress ? (
                            <>
                                <p className="truncate text-sm font-bold leading-snug text-gray-900 sm:text-[15px]">
                                    ({selectedAddress.address_label})
                                </p>
                                <p className="mt-0.5 truncate text-xs leading-relaxed text-gray-600 sm:text-sm">
                                    {formatAddressLine(selectedAddress)}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm font-semibold leading-snug text-gray-700 sm:text-[15px]">
                                اضغط لعرض عنوانك
                            </p>
                        )}
                    </div>
                    <ArrowLeft className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} aria-hidden />
                </button>
            </div>

            <AddressPickerSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                addresses={addresses}
                selectedId={selectedId}
                onSelect={setSelectedAddressId}
            />
        </>
    );
}
