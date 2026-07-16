"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface DeleteConfirmSheetProps {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	isDeleting?: boolean;
	isArabic: boolean;
}

export function DeleteConfirmSheet({
	isOpen,
	onConfirm,
	onCancel,
	isDeleting = false,
	isArabic,
}: DeleteConfirmSheetProps) {
	const cancelButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			cancelButtonRef.current?.focus();
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
			if (e.key === "Escape" && !isDeleting) onCancel();
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, isDeleting, onCancel]);

	if (!isOpen) return null;

	return (
		<>
			<button
				type="button"
				className="fixed inset-0 z-40 cursor-default bg-black/40 transition-opacity dark:bg-black/60"
				onClick={isDeleting ? undefined : onCancel}
				aria-label={isArabic ? "إغلاق" : "Close"}
				disabled={isDeleting}
			/>

			<div
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-desc"
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-background px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 shadow-xl sm:px-5 sm:pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pt-5 md:inset-x-auto md:bottom-auto md:start-1/2 md:top-1/2 md:w-full md:max-w-sm md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:pb-8 lg:max-w-md"
			>
				<div
					className="mx-auto mb-5 h-1 w-10 rounded-full bg-border md:hidden"
					aria-hidden
				/>

				<p
					id="delete-dialog-title"
					className="mb-2 text-center text-base font-semibold text-foreground sm:text-lg"
				>
					{isArabic
						? "هل ترغب في حذف العنوان ؟"
						: "Do you want to delete this address?"}
				</p>
				<p id="delete-dialog-desc" className="sr-only">
					{isArabic
						? "لا يمكن التراجع عن هذا الإجراء"
						: "This action cannot be undone"}
				</p>

				<button
					type="button"
					onClick={onConfirm}
					disabled={isDeleting}
					className="mb-2.5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 sm:mb-3"
				>
					{isDeleting ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
							<span>{isArabic ? "جاري الحذف..." : "Deleting..."}</span>
						</>
					) : isArabic ? (
						"حذف العنوان"
					) : (
						"Delete address"
					)}
				</button>

				<button
					ref={cancelButtonRef}
					type="button"
					onClick={onCancel}
					disabled={isDeleting}
					className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-card text-sm font-medium text-foreground transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:opacity-60"
				>
					{isArabic ? "إلغاء" : "Cancel"}
				</button>
			</div>
		</>
	);
}
