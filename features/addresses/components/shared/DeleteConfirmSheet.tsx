"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface DeleteConfirmSheetProps {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	isDeleting?: boolean;
}

export function DeleteConfirmSheet({
	isOpen,
	onConfirm,
	onCancel,
	isDeleting = false,
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
				aria-label="إغلاق"
				disabled={isDeleting}
			/>

			<div
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-desc"
				className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 shadow-xl dark:bg-gray-800 sm:px-5 sm:pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pt-5 md:inset-x-auto md:bottom-auto md:start-1/2 md:top-1/2 md:w-full md:max-w-sm md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:pb-8"
			>
				<div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-600 md:hidden" aria-hidden />

				<p
					id="delete-dialog-title"
					className="mb-2 text-center text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg"
				>
					هل ترغب في حذف العنوان ؟
				</p>
				<p id="delete-dialog-desc" className="sr-only">
					لا يمكن التراجع عن هذا الإجراء
				</p>

				<button
					type="button"
					onClick={onConfirm}
					disabled={isDeleting}
					className="mb-2.5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#30913F] text-sm font-semibold text-white transition-colors hover:bg-[#2a8036] active:bg-[#267332] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-gray-800 sm:mb-3"
				>
					{isDeleting ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
							<span>جاري الحذف...</span>
						</>
					) : (
						"حذف العنوان"
					)}
				</button>

				<button
					ref={cancelButtonRef}
					type="button"
					onClick={onCancel}
					disabled={isDeleting}
					className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gray-100 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-60 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus-visible:ring-gray-500"
				>
					إلغاء
				</button>
			</div>
		</>
	);
}
