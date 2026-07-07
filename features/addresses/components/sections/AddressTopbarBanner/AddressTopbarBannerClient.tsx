"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { AddressPickerSheet } from "../../shared/AddressPickerSheet";
import { useSelectedAddress } from "../../../hooks/useSelectedAddress";
import { formatAddressLine } from "../../../lib/format-address-line";
import { AddressListItem } from "../../../types/address.types";

interface AddressTopbarBannerClientProps {
	isAuthenticated: boolean;
	addresses: AddressListItem[];
	className?: string;
}

const pillClass =
	"inline-flex max-w-full min-h-[36px] items-center gap-1.5 rounded-lg bg-[#EBFEEB] px-2.5 py-1.5 text-right transition-colors hover:bg-[#dff8df] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 active:scale-[0.98] dark:bg-[#1a3d24] dark:hover:bg-[#224d2e] dark:focus-visible:ring-offset-gray-900 sm:min-h-[40px] sm:gap-2 sm:px-3 md:max-w-md lg:max-w-lg";

function LocationPill({
	children,
	onClick,
	href,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	href?: string;
}) {
	const content = (
		<>
			<MapPin
				className="h-4 w-4 shrink-0 text-[#292D32] dark:text-[#6fcf87] sm:h-[18px] sm:w-[18px]"
				strokeWidth={2}
				aria-hidden
			/>
			<span className="min-w-0 truncate text-xs font-bold leading-snug text-[#111B18] dark:text-gray-100 sm:text-[12px] md:text-sm">
				{children}
			</span>
		</>
	);

	if (href) {
		return (
			<Link href={href} className={pillClass}>
				{content}
			</Link>
		);
	}

	return (
		<button type="button" onClick={onClick} className={pillClass} aria-haspopup="dialog">
			{content}
		</button>
	);
}

export function AddressTopbarBannerClient({
	isAuthenticated,
	addresses,
	className = "",
}: AddressTopbarBannerClientProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { selectedAddress, selectedId, setSelectedAddressId } = useSelectedAddress(addresses);

	const placeholder = "الرياض ،اسم المنطقة ،اسم الشارع";

	if (!isAuthenticated) {
		return (
			<div className={`flex min-w-0 justify-end ${className}`}>
				<LocationPill href="/auth">{placeholder}</LocationPill>
			</div>
		);
	}

	return (
		<>
			<div className={`flex min-w-0 justify-start ${className}`}>
				<LocationPill onClick={() => setIsOpen(true)}>
					{selectedAddress ? formatAddressLine(selectedAddress) : placeholder}
				</LocationPill>
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
