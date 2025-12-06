import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Button } from "@/shared/components/ui";

interface NotificationDialogProps {
	message: string;
	type: "success" | "error" | "info";
	isVisible: boolean;
	onClose: () => void;
	isArabic: boolean;
}

/**
 * Notification Dialog Component
 * Displays success/error messages using UI Dialog
 */
export const NotificationDialog: React.FC<NotificationDialogProps> = ({ 
	message, 
	type, 
	isVisible, 
	onClose, 
	isArabic 
}) => {
	return (
		<Dialog open={isVisible} onOpenChange={onClose}>
			<DialogContent className={`sm:max-w-md ${isArabic ? 'text-right' : 'text-left'}`}>
				<DialogHeader>
					<DialogTitle className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
						{type === "success" ? (
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
								<svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
						) : type === "error" ? (
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
								<svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
						) : (
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
								<svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						)}
						<span className={
							type === "success" 
								? "text-green-900 dark:text-green-100" 
								: type === "error"
								? "text-red-900 dark:text-red-100"
								: "text-blue-900 dark:text-blue-100"
						}>
							{type === "success" 
								? (isArabic ? "نجح!" : "Success!") 
								: type === "error"
								? (isArabic ? "خطأ!" : "Error!")
								: (isArabic ? "معلومة" : "Info")
							}
						</span>
					</DialogTitle>
					<DialogDescription className={`text-base ${isArabic ? 'text-right' : 'text-left'}`}>
						{message}
					</DialogDescription>
				</DialogHeader>
				<div className={`mt-4 flex ${isArabic ? 'justify-start' : 'justify-end'}`}>
					<Button
						onClick={onClose}
						className={`${
							type === "success" 
								? "bg-green-600 hover:bg-green-700" 
								: type === "error"
								? "bg-red-600 hover:bg-red-700"
								: "bg-blue-600 hover:bg-blue-700"
						} text-white`}
					>
						{isArabic ? "حسناً" : "OK"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

