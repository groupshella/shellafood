"use client";

import { memo } from "react";
import { Trash2, MapPin, Pencil } from "lucide-react";
import { formatAddressLine } from "@/features/addresses/lib/format-address-line";
import { AddressListItem } from "@/features/addresses/types/address.types";
import { useLanguage } from "@/features/language/useLanguage";

interface AddressCardProps {
	address: AddressListItem;
	showDelete: boolean;
	onClick: (id: number) => void;
	onDelete: (id: number) => void;
	onEdit: (id: number) => void;
	isDeleting?: boolean;
}

const actionButtonClass =
	"flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-gray-800 sm:h-11 sm:w-11";

export const AddressCard = memo(function AddressCard({
	address,
	showDelete,
	onClick,
	onDelete,
	onEdit,
	isDeleting = false,
}: AddressCardProps) {
	const { isArabic } = useLanguage();
	const addressLine = formatAddressLine(address, isArabic);

	return (
		<article
			className={[
				"flex h-full min-w-0 items-start justify-between gap-2.5 rounded-2xl border border-gray-100 bg-white px-3 py-3.5 shadow-sm transition-opacity dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:gap-3 sm:px-4 sm:py-4 md:px-5",
				isDeleting ? "pointer-events-none opacity-50" : "",
			].join(" ")}
		>
			<button
				type="button"
				onClick={() => onClick(address.id)}
				className="flex min-w-0 flex-1 items-start gap-2.5 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 rounded-xl dark:focus-visible:ring-offset-gray-800 sm:gap-3"
				aria-label={
					isArabic
						? `عرض تفاصيل عنوان ${address.address_label}`
						: `View details for address ${address.address_label}`
				}
			>
				<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#30913F]/10 dark:bg-[#30913F]/20 sm:h-11 sm:w-11">
					<MapPin className="h-4 w-4 text-[#30913F] dark:text-[#3da84f]" aria-hidden />
				</div>

				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					<span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-base">
						{address.address_label}
					</span>
					<span className="line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-[13px]">
						{addressLine}
					</span>
				</div>
			</button>

			<div className="flex shrink-0 flex-col items-center gap-0.5">
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onEdit(address.id);
					}}
					className={`${actionButtonClass} text-[#30913F] hover:bg-[#30913F]/10 active:bg-[#30913F]/20 dark:text-[#3da84f] dark:hover:bg-[#30913F]/20`}
					aria-label={
						isArabic
							? `تعديل عنوان ${address.address_label}`
							: `Edit address ${address.address_label}`
					}
					disabled={isDeleting}
				>
					<Pencil className="h-4 w-4" aria-hidden />
				</button>

				{showDelete && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onDelete(address.id);
						}}
						className={`${actionButtonClass} text-red-400 hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/40 dark:active:bg-red-950/60`}
						aria-label={
							isArabic
								? `حذف عنوان ${address.address_label}`
								: `Delete address ${address.address_label}`
						}
						disabled={isDeleting}
					>
						<Trash2 className="h-4 w-4" aria-hidden />
					</button>
				)}
			</div>
		</article>
	);
});
