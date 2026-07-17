"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect } from "react";

interface JoinSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	isArabic?: boolean;
}

export function JoinSuccessModal({
	isOpen,
	onClose,
	isArabic = true,
}: JoinSuccessModalProps) {
	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 z-50 bg-black/30"
						onClick={onClose}
						aria-hidden
					/>
					<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-10">
						<motion.div
							role="dialog"
							aria-modal="true"
							aria-label={
								isArabic
									? "تم إرسال طلب انضمامك بنجاح"
									: "Your join request was sent successfully"
							}
							dir={isArabic ? "rtl" : "ltr"}
							lang={isArabic ? "ar" : "en"}
							initial={{ opacity: 0, scale: 0.92, y: 12 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.92, y: 12 }}
							transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
							className="relative mx-auto max-h-[calc(100dvh-3rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-background px-5 pb-10 pt-12 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:max-w-md sm:px-6 md:max-w-lg md:px-8 lg:max-w-xl lg:px-10"
						>
							<button
								type="button"
								onClick={onClose}
								className="absolute start-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted transition-colors active:brightness-95 sm:h-9 sm:w-9"
								aria-label={isArabic ? "إغلاق" : "Close"}
							>
								<X className="h-4 w-4" />
							</button>

							<div className="flex flex-col items-center text-center">
								<div className="relative mb-7 sm:mb-8">
									<div
										className="absolute inset-0 scale-150 rounded-full bg-brand/10 blur-xl"
										aria-hidden
									/>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{
											type: "spring",
											stiffness: 260,
											damping: 20,
											delay: 0.1,
										}}
										className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand shadow-[0_8px_24px_rgba(48,145,63,0.35)] sm:h-24 sm:w-24 md:h-28 md:w-28"
									>
										<Check
											className="h-9 w-9 text-brand-foreground sm:h-10 sm:w-10 md:h-11 md:w-11"
											strokeWidth={3}
											aria-hidden
										/>
									</motion.div>
								</div>

								<h2 className="text-lg font-bold leading-snug text-foreground sm:text-[18px] md:text-xl">
									{isArabic
										? "تم إرسال طلب انضمامك بنجاح"
										: "Your join request was sent successfully"}
								</h2>
								<p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px] md:text-base">
									{isArabic
										? "وسيتم التواصل معك قريباً"
										: "We will contact you soon"}
								</p>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}
