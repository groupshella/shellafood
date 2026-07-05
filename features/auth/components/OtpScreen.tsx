"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import NumericKeypad from "./NumericKeypad";
import {
	AuthTitle,
	BackHeader,
	PrimaryButton,
	tajawal,
} from "@/features/auth/components/shared/AuthPrimitives";
import type { OtpFlow } from "@/features/auth/types/auth.types";

interface OtpScreenProps {
	phone: string;
	otpFlow: OtpFlow;
	cooldownSeconds: number;
	isLoading?: boolean;
	error?: string | null;
	onBack: () => void;
	onVerify: (code: string) => void;
	onResend: () => Promise<{ retry_after_seconds?: number } | undefined>;
	clearError: () => void;
}

function formatPhone(phone: string) {
	const digits = phone.replace(/\D/g, "");
	const local = digits.slice(-9);
	return `+966${local}`;
}

function formatTime(seconds: number) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const ClockIcon = memo(function ClockIcon() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
			<circle cx="12" cy="12" r="9" stroke="#555555" strokeWidth="1.6" />
			<path d="M12 7v5l3 2" stroke="#555555" strokeWidth="1.6" strokeLinecap="round" />
		</svg>
	);
});

const OtpScreen = memo(function OtpScreen({
	phone,
	otpFlow,
	cooldownSeconds,
	isLoading = false,
	error,
	clearError,
	onBack,
	onVerify,
	onResend,
}: OtpScreenProps) {
	const [code, setCode] = useState("");
	const [timer, setTimer] = useState(cooldownSeconds);
	const [isResending, setIsResending] = useState(false);

	useEffect(() => {
		setTimer(cooldownSeconds);
	}, [cooldownSeconds]);

	useEffect(() => {
		if (timer <= 0) return;
		const t = setInterval(() => setTimer((s) => s - 1), 1000);
		return () => clearInterval(t);
	}, [timer]);

	useEffect(() => {
		if (error) setCode("******");
	}, [error]);

	const handleClear = useCallback(() => {
		if (error) {
			clearError();
			setCode("");
		}
	}, [error, clearError]);

	const handleKeyPress = useCallback(
		(key: string) => {
			if (error) {
				handleClear();
				return;
			}
			setCode((prev) => (prev.length < 6 ? prev + key : prev));
		},
		[error, handleClear],
	);

	const handleBackspace = useCallback(() => {
		setCode((prev) => prev.slice(0, -1));
	}, []);

	const handleResend = useCallback(async () => {
		setIsResending(true);
		try {
			const data = (await onResend()) ?? { retry_after_seconds: 60 };
			setTimer(data.retry_after_seconds ?? 60);
		} finally {
			setIsResending(false);
		}
	}, [onResend]);

	const formattedPhone = formatPhone(phone);
	const title =
		otpFlow === "forgot_password" ? "التحقق من رقم هاتفك الخاص" : "ادخل رمز التفعيل";

	return (
		<div
			dir="rtl"
			lang="ar"
			className={`${tajawal.className} relative flex min-h-dvh w-full flex-col bg-white text-[#111B18]`}
		>
			<div className="mx-auto flex w-full max-w-md flex-col px-4 pb-4 pt-14 sm:pt-16">
				<BackHeader onBack={onBack} disabled={isLoading} />

				<AuthTitle>{title}</AuthTitle>

				<motion.p
					initial={{ y: 8, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className="mt-2 text-right text-[16px] font-normal leading-relaxed text-[#555555]"
				>
					تم ارسال رمز التحقق الى الرقم الخاص بك{" "}
					<span dir="ltr" className="inline-block font-medium text-[#111B18]">
						{formattedPhone}
					</span>
				</motion.p>

				<motion.div
					initial={{ y: 8, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="mt-8"
					dir="ltr"
				>
					<div className="flex justify-center gap-2">
						{[0, 1, 2, 3, 4, 5].map((i) => {
							const isActive = i === code.length;
							const isFilled = i < code.length;
							return (
								<div
									key={i}
									onClick={handleClear}
									className={`flex h-14 min-w-0 flex-1 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-200 ${
										isActive
											? "border-[#30913F] text-[#111B18]"
											: error
												? "border-red-500 text-red-500"
												: isFilled
													? "border-[#30913F] text-[#111B18]"
													: "border-[#C6C8CE] text-[#111B18]"
									}`}
								>
									<AnimatePresence mode="popLayout">
										{isFilled && (
											<motion.span
												key="digit"
												initial={{ scale: 0.5, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												exit={{ scale: 0.5, opacity: 0 }}
											>
												{code[i]}
											</motion.span>
										)}
									</AnimatePresence>
								</div>
							);
						})}
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="mt-6 flex flex-col items-center gap-2 text-center"
				>
					{timer > 0 ? (
						<>
							<p className="text-[16px] font-medium text-[#555555]">
								في حال عدم وصول الرمز؟ إعادة الإرسال
							</p>
							<span className="inline-flex items-center gap-2 text-[16px] font-normal text-[#555555]">
								<ClockIcon />
								{formatTime(timer)}
							</span>
						</>
					) : (
						<button
							type="button"
							onClick={handleResend}
							disabled={isResending}
							className="text-[16px] font-medium text-[#555555] disabled:opacity-50"
						>
							في حال عدم وصول الرمز؟{" "}
							<span className="font-bold text-[#30913F]">
								{isResending ? "جاري الإرسال..." : "إعادة الإرسال"}
							</span>
						</button>
					)}
				</motion.div>

				<div className="mt-8">
					<PrimaryButton
						onClick={() => onVerify(code)}
						disabled={code.length !== 6 || isLoading}
					>
						{isLoading ? "جاري التحقق..." : "إرسال"}
					</PrimaryButton>
				</div>
			</div>

			<div className="mt-auto">
				<NumericKeypad onPress={handleKeyPress} onBackspace={handleBackspace} />
			</div>
		</div>
	);
});

export default OtpScreen;
