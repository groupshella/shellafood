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
}

const primaryButtonClass =
	"flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#30913F] to-[#267332] text-sm font-semibold text-white transition-all duration-200 hover:from-[#2a8036] hover:to-[#1f6628] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 sm:min-h-[56px]";

const secondaryButtonClass =
	"flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-[#30913F]/20 bg-white text-sm font-semibold text-[#30913F] transition-colors hover:bg-[#30913F]/5 active:bg-[#30913F]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:border-[#30913F]/30 dark:bg-gray-800 dark:text-[#3da84f] dark:hover:bg-[#30913F]/10 dark:focus-visible:ring-offset-gray-800 sm:min-h-[56px]";

export function AddressPickerSheet({
	isOpen,
	onClose,
	addresses,
	selectedId,
	onSelect,
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
				aria-label="إغلاق"
			/>

			{/* Mobile: bottom sheet · Desktop: centered modal */}
			<div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-[calc(58px+env(safe-area-inset-bottom))] md:items-center md:p-6 md:pb-6 lg:p-8 lg:pb-8">
				<div
					role="dialog"
					aria-modal="true"
					aria-label="إختار العنوان"
					className="pointer-events-auto flex w-full max-h-[85dvh] flex-col overflow-hidden rounded-t-3xl bg-white px-4 pb-6 pt-4 shadow-xl dark:bg-gray-800 sm:px-5 sm:pb-8 sm:pt-5 md:max-h-[min(80dvh,640px)] md:max-w-md md:rounded-2xl lg:max-w-lg"
					dir="rtl"
				>
					<div
						className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-600 md:hidden"
						aria-hidden
					/>

					<div className="relative mb-4 flex shrink-0 items-center justify-center sm:mb-5">
						<button
							ref={closeButtonRef}
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="absolute start-0 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:h-11 sm:w-11"
						>
							<X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
						</button>
						<h2 className="text-base font-bold text-gray-900 dark:text-gray-100 sm:text-lg">
							إختار العنوان
						</h2>
					</div>

					<div
						className="mb-4 min-h-0 flex-1 space-y-2 overflow-y-auto sm:mb-5"
						role="listbox"
						aria-label="العناوين المحفوظة"
					>
						{addresses.length === 0 ? (
							<p className="rounded-xl bg-gray-50 px-4 py-5 text-center text-sm text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 sm:py-6">
								لا توجد عناوين محفوظة بعد
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
											"flex w-full min-h-[56px] items-center gap-2.5 rounded-xl px-3.5 py-3 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] sm:min-h-[60px] sm:gap-3 sm:px-4 sm:py-3.5",
											isSelected
												? "bg-[#EEF8F0] dark:bg-[#1a3d24]"
												: "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/60",
										].join(" ")}
									>
										<span className="min-w-0 flex-1">
											<span className="block truncate text-sm font-bold text-gray-900 dark:text-gray-100">
												({address.address_label})
											</span>
											<span className="mt-0.5 block text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[13px]">
												{formatAddressLine(address)}
											</span>
										</span>
										<span
											className={[
												"flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
												isSelected
													? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
													: "border-2 border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800",
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
							<span>أضف عنوان جديد</span>
						</Link>

						<Link
							href="/addresses"
							onClick={onClose}
							className={secondaryButtonClass}
						>
							تعديل العناوين
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
