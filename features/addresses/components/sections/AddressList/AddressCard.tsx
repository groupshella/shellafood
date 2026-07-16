import { memo } from "react";
import { Trash2, MapPin, Pencil } from "lucide-react";
import { AddressListItem } from "@/features/addresses/types/address.types";

interface AddressCardProps {
	address: AddressListItem;
	showDelete: boolean;
	isArabic: boolean;
	onClick: (id: number) => void;
	onDelete: (id: number) => void;
	onEdit: (id: number) => void;
	isDeleting?: boolean;
}

const actionButtonClass =
	"flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 sm:h-11 sm:w-11";

export const AddressCard = memo(function AddressCard({
	address,
	showDelete,
	isArabic,
	onClick,
	onDelete,
	onEdit,
	isDeleting = false,
}: AddressCardProps) {
	const addressLine = [address.city, address.region, address.street_name]
		.filter(Boolean)
		.join(isArabic ? " ، " : ", ");

	return (
		<article
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className={[
				"flex h-full min-w-0 items-start justify-between gap-2.5 rounded-2xl border border-border bg-background px-3 py-3.5 shadow-sm transition-opacity sm:gap-3 sm:px-4 sm:py-4 md:px-5",
				isDeleting ? "pointer-events-none opacity-50" : "",
			].join(" ")}
		>
			<button
				type="button"
				onClick={() => onClick(address.id)}
				className="flex min-w-0 flex-1 items-start gap-2.5 rounded-xl text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-3"
				aria-label={
					isArabic
						? `عرض تفاصيل عنوان ${address.address_label}`
						: `View details for ${address.address_label}`
				}
			>
				<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 sm:h-11 sm:w-11 md:h-12 md:w-12">
					<MapPin className="h-4 w-4 text-brand" aria-hidden />
				</div>

				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					<span className="truncate text-sm font-semibold text-foreground sm:text-base">
						{address.address_label}
					</span>
					<span className="line-clamp-2 text-xs leading-relaxed text-muted sm:text-[13px]">
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
					className={`${actionButtonClass} text-brand hover:bg-brand/10 active:bg-brand/20`}
					aria-label={
						isArabic
							? `تعديل عنوان ${address.address_label}`
							: `Edit ${address.address_label}`
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
						className={`${actionButtonClass} text-red-400 hover:bg-red-50 active:bg-red-100 dark:hover:bg-red-950/40 dark:active:bg-red-950/60`}
						aria-label={
							isArabic
								? `حذف عنوان ${address.address_label}`
								: `Delete ${address.address_label}`
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
