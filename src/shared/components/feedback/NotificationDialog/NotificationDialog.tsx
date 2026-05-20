import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Button } from "@/shared/components/ui";

type NotificationType = "success" | "error" | "info" | "confirm";

interface NotificationDialogProps {
	message: string;
	type: NotificationType;
	isVisible: boolean;
	onClose: () => void;
	isArabic: boolean;
	onConfirm?: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
	isLoading?: boolean;
}

const TITLE: Record<NotificationType, { ar: string; en: string; className: string }> = {
	success: { ar: "نجح!", en: "Success!", className: "text-green-900 dark:text-green-100" },
	error: { ar: "خطأ!", en: "Error!", className: "text-red-900 dark:text-red-100" },
	info: { ar: "معلومة", en: "Info", className: "text-blue-900 dark:text-blue-100" },
	confirm: { ar: "تأكيد", en: "Confirm", className: "text-amber-900 dark:text-amber-100" },
};

function DialogIcon({ type }: { type: NotificationType }) {
	const iconClass = "h-6 w-6";
	const wrap = (bg: string, color: string, path: string) => (
		<div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}>
			<svg className={`${iconClass} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
			</svg>
		</div>
	);

	if (type === "success") {
		return wrap("bg-green-100 dark:bg-green-900", "text-green-600 dark:text-green-400", "M5 13l4 4L19 7");
	}
	if (type === "error") {
		return wrap("bg-red-100 dark:bg-red-900", "text-red-600 dark:text-red-400", "M6 18L18 6M6 6l12 12");
	}
	if (type === "confirm") {
		return wrap(
			"bg-amber-100 dark:bg-amber-900/40",
			"text-amber-600 dark:text-amber-400",
			"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
		);
	}
	return wrap("bg-blue-100 dark:bg-blue-900", "text-blue-600 dark:text-blue-400", "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z");
}

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
	message,
	type,
	isVisible,
	onClose,
	isArabic,
	onConfirm,
	confirmLabel,
	cancelLabel,
	isLoading = false,
}) => {
	const title = TITLE[type];
	const isConfirm = type === "confirm";

	const handleOpenChange = (open: boolean) => {
		if (!open && !isLoading) onClose();
	};

	return (
		<Dialog open={isVisible} onOpenChange={handleOpenChange}>
			<DialogContent className={`sm:max-w-md ${isArabic ? "text-right" : "text-left"} z-50`} dir={isArabic ? "rtl" : "ltr"}>
				<DialogHeader>
					<DialogTitle className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
						<DialogIcon type={type} />
						<span className={title.className}>{isArabic ? title.ar : title.en}</span>
					</DialogTitle>
					<DialogDescription className={`text-base ${isArabic ? "text-right" : "text-left"}`}>
						{message}
					</DialogDescription>
				</DialogHeader>

				{isConfirm ? (
					<div className={`mt-4 flex gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
						<Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
							{cancelLabel ?? (isArabic ? "إلغاء" : "Cancel")}
						</Button>
						<Button onClick={onConfirm} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
							{confirmLabel ?? (isArabic ? "تأكيد" : "Confirm")}
						</Button>
					</div>
				) : (
					<div className={`mt-4 flex ${isArabic ? "justify-start" : "justify-end"}`}>
						<Button
							onClick={onClose}
							className={
								type === "success"
									? "bg-green-600 hover:bg-green-700 text-white"
									: type === "error"
										? "bg-red-600 hover:bg-red-700 text-white"
										: "bg-blue-600 hover:bg-blue-700 text-white"
							}
						>
							{isArabic ? "حسناً" : "OK"}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
