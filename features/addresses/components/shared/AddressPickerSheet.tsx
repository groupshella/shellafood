"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Plus, X } from "lucide-react";
import { formatAddressLine } from "../../lib/format-address-line";
import { AddressListItem } from "../../types/address.types";

interface AddressPickerSheetProps {
	isOpen: boolean;
	onClose: () => void;
	addresses: AddressListItem[];
	selectedId: number | null;
	onSelect: (id: number) => void;
	isArabic: boolean;
}

const primaryButtonClass =
	"flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-semibold text-brand-foreground transition-all duration-200 hover:brightness-95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[56px]";

const secondaryButtonClass =
	"flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-brand/20 bg-background text-sm font-semibold text-brand transition-colors hover:bg-brand/5 active:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[56px]";

export function AddressPickerSheet({
	isOpen,
	onClose,
	addresses,
	selectedId,
	onSelect,
	isArabic,
}: AddressPickerSheetProps) {
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			closeButtonRef.current?.focus();
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50" role="presentation">
			<button
				type="button"
				className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px] transition-opacity dark:bg-black/60"
				onClick={onClose}
				aria-label={isArabic ? "إغلاق" : "Close"}
			/>

			{/* Mobile: bottom sheet · Desktop: centered modal */}
			<div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-[calc(58px+env(safe-area-inset-bottom))] md:items-center md:p-6 md:pb-6 lg:p-8 lg:pb-8">
				<div
					role="dialog"
					aria-modal="true"
					aria-label={isArabic ? "إختار العنوان" : "Choose address"}
					dir={isArabic ? "rtl" : "ltr"}
					lang={isArabic ? "ar" : "en"}
					className="pointer-events-auto flex w-full max-h-[85dvh] flex-col overflow-hidden rounded-t-3xl bg-background px-4 pb-6 pt-4 shadow-xl sm:px-5 sm:pb-8 sm:pt-5 md:max-h-[min(80dvh,640px)] md:max-w-md md:rounded-2xl lg:max-w-lg"
				>
					<div
						className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-border md:hidden"
						aria-hidden
					/>

					<div className="relative mb-4 flex shrink-0 items-center justify-center sm:mb-5">
						<button
							ref={closeButtonRef}
							type="button"
							onClick={onClose}
							aria-label={isArabic ? "إغلاق" : "Close"}
							className="absolute start-0 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-11 sm:w-11"
						>
							<X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
						</button>
						<h2 className="text-base font-bold text-foreground sm:text-lg">
							{isArabic ? "إختار العنوان" : "Choose address"}
						</h2>
					</div>

					<div
						className="mb-4 min-h-0 flex-1 space-y-2 overflow-y-auto sm:mb-5"
						role="listbox"
						aria-label={isArabic ? "العناوين المحفوظة" : "Saved addresses"}
					>
						{addresses.length === 0 ? (
							<p className="rounded-xl bg-card px-4 py-5 text-center text-sm text-muted sm:py-6">
								{isArabic
									? "لا توجد عناوين محفوظة بعد"
									: "No saved addresses yet"}
							</p>
						) : (
							addresses.map((address) => {
								const isSelected = address.id === selectedId;

								return (
									<button
										key={address.id}
										type="button"
										role="option"
										aria-selected={isSelected}
										onClick={() => {
											onSelect(address.id);
											onClose();
										}}
										className={[
											"flex w-full min-h-[56px] items-center gap-2.5 rounded-xl px-3.5 py-3 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:min-h-[60px] sm:gap-3 sm:px-4 sm:py-3.5",
											isSelected
												? "bg-brand/10"
												: "bg-background hover:bg-card",
										].join(" ")}
									>
										<span className="min-w-0 flex-1">
											<span className="block truncate text-sm font-bold text-foreground">
												({address.address_label})
											</span>
											<span className="mt-0.5 block text-xs leading-relaxed text-muted sm:text-[13px]">
												{formatAddressLine(address, isArabic)}
											</span>
										</span>
										<span
											className={[
												"flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
												isSelected
													? "bg-foreground text-background"
													: "border-2 border-border bg-background",
											].join(" ")}
											aria-hidden
										>
											{isSelected && (
												<Check className="h-3.5 w-3.5" strokeWidth={3} />
											)}
										</span>
									</button>
								);
							})
						)}
					</div>

					<div className="shrink-0 space-y-2.5 sm:space-y-3">
						<Link
							href="/addresses/add"
							onClick={onClose}
							className={primaryButtonClass}
						>
							<Plus className="h-4 w-4 shrink-0" aria-hidden />
							<span>
								{isArabic ? "أضف عنوان جديد" : "Add new address"}
							</span>
						</Link>

						<Link
							href="/addresses"
							onClick={onClose}
							className={secondaryButtonClass}
						>
							{isArabic ? "تعديل العناوين" : "Edit addresses"}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
