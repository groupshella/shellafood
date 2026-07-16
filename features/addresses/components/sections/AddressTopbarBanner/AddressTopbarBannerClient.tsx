"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { AddressPickerSheet } from "../../shared/AddressPickerSheet";
import { useSelectedAddress } from "../../../hooks/useSelectedAddress";
import { formatAddressLine } from "../../../lib/format-address-line";
import { AddressListItem } from "../../../types/address.types";

interface AddressTopbarBannerClientProps {
	isAuthenticated: boolean;
	addresses: AddressListItem[];
	isArabic: boolean;
	className?: string;
}

const pillClass =
	"inline-flex max-w-full min-h-[36px] items-center gap-1.5 rounded-lg bg-brand/10 px-2.5 py-1.5 text-start transition-colors hover:bg-brand/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] sm:min-h-[40px] sm:gap-2 sm:px-3 md:max-w-md lg:max-w-lg";

function LocationPill({
	children,
	onClick,
	href,
	ariaLabel,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	href?: string;
	ariaLabel: string;
}) {
	const content = (
		<>
			<MapPin
				className="h-4 w-4 shrink-0 text-foreground sm:h-[18px] sm:w-[18px]"
				strokeWidth={2}
				aria-hidden
			/>
			<span className="min-w-0 truncate text-xs font-bold leading-snug text-foreground sm:text-[12px] md:text-sm">
				{children}
			</span>
		</>
	);

	if (href) {
		return (
			<Link href={href} className={pillClass} aria-label={ariaLabel}>
				{content}
			</Link>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			className={pillClass}
			aria-haspopup="dialog"
			aria-label={ariaLabel}
		>
			{content}
		</button>
	);
}

export function AddressTopbarBannerClient({
	isAuthenticated,
	addresses,
	isArabic,
	className = "",
}: AddressTopbarBannerClientProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { selectedAddress, selectedId, setSelectedAddressId } =
		useSelectedAddress(addresses);

	const placeholder = isArabic
		? "انضم إلينا ، واستمتع بخدمات شلة"
		: "Join us and enjoy Shella services";

	const handleOpen = useCallback(() => {
		setIsOpen(true);
	}, []);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	if (!isAuthenticated) {
		return (
			<div
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				className={`flex min-w-0 justify-start ${className}`}
			>
				<LocationPill href="/auth" ariaLabel={placeholder}>
					{placeholder}
				</LocationPill>
			</div>
		);
	}

	const selectedLine = selectedAddress
		? formatAddressLine(selectedAddress, isArabic)
		: placeholder;

	return (
		<>
			<div
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				className={`flex min-w-0 justify-start ${className}`}
			>
				<LocationPill
					onClick={handleOpen}
					ariaLabel={
						selectedAddress
							? isArabic
								? `العنوان المحدد: ${selectedLine}`
								: `Selected address: ${selectedLine}`
							: isArabic
								? "اختر عنوان التوصيل"
								: "Choose delivery address"
					}
				>
					{selectedLine}
				</LocationPill>
			</div>

			<AddressPickerSheet
				isOpen={isOpen}
				onClose={handleClose}
				addresses={addresses}
				selectedId={selectedId}
				onSelect={setSelectedAddressId}
				isArabic={isArabic}
			/>
		</>
	);
}
