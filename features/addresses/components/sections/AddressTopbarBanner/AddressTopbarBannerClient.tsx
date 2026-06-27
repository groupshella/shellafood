"use client";

import { useState } from "react";
import Link from "next/link";
import { AddressPickerSheet } from "../../shared/AddressPickerSheet";
import { useSelectedAddress } from "../../../hooks/useSelectedAddress";
import { AddressListItem } from "../../../types/address.types";
import { MapPinIcon } from "lucide-react";

interface AddressTopbarBannerClientProps {
    isAuthenticated: boolean;
    addresses: AddressListItem[];
    className?: string;
}

function formatAddressLine(address: AddressListItem): string {
    return [address.city, address.region, address.street_name].filter(Boolean).join(" ، ");
}

function LocationPinIcon() {
    return (
        <MapPinIcon className="h-4 w-4 text-gray-950" />
    );
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
                    className="group inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-black transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
                >
                    <LocationPinIcon />
                    <span className="min-w-0 truncate whitespace-nowrap text-[13px] font-semibold leading-none text-black sm:text-sm">
                        سجل الدخول لإضافة عنوان
                    </span>
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
                    className="group inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-black transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
                >
                    <LocationPinIcon />
                    <span className="min-w-0 p-2 truncate whitespace-nowrap text-[13px] font-semibold leading-none text-black sm:text-sm">
                        {selectedAddress
                            ? formatAddressLine(selectedAddress)
                            : "اختر عنوان التوصيل"}
                    </span>
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
