"use client";

import { useState } from "react";
import Link from "next/link";

import { AddressPickerSheet } from "../../shared/AddressPickerSheet";
import { useSelectedAddress } from "../../../hooks/useSelectedAddress";
import { formatAddressLine } from "../../../lib/format-address-line";
import { AddressListItem } from "../../../types/address.types";

interface AddressTopbarBannerClientProps {
	isAuthenticated: boolean;
	addresses: AddressListItem[];
	className?: string;
}

function LocationIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="#292D32" aria-hidden>
			<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
		</svg>
	);
}

function LocationPill({
	children,
	onClick,
	href,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	href?: string;
}) {
	const className =
		"inline-flex max-w-full items-center gap-1 rounded bg-[#EBFEEB] px-1 py-1 text-right transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1";

	const content = (
		<>
			<LocationIcon />

			<span className="min-w-0 truncate text-[12px] font-bold leading-[1.83] text-[#111B18]">
				{children}
			</span>
		</>
	);

	if (href) {
		return (
			<Link href={href} className={className}>
				{content}
			</Link>
		);
	}

	return (
		<button type="button" onClick={onClick} className={className}>
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

	if (!isAuthenticated) {
		return (
			<div className={`flex justify-end ${className}`}>
				<LocationPill href="/auth">الرياض ،اسم المنطقة ،اسم الشارع</LocationPill>
			</div>
		);
	}

	return (
		<>
			<div className={`flex justify-start ${className}`}>
				<LocationPill onClick={() => setIsOpen(true)}>
					{selectedAddress
						? formatAddressLine(selectedAddress)
						: "الرياض ،اسم المنطقة ،اسم الشارع"}
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
