"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import NumericKeypad from "./NumericKeypad";
import {
	AuthShell,
	AuthTitle,
	BackHeader,
	PrimaryButton,
} from "@/features/auth/components/shared/AuthPrimitives";
import type { OtpFlow } from "@/features/auth/types/auth.types";

interface OtpScreenProps {
	isArabic: boolean;
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
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
			<path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
		</svg>
	);
});

const OtpScreen = memo(function OtpScreen({
	isArabic,
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

	const handleVerify = useCallback(() => {
		onVerify(code);
	}, [code, onVerify]);

	const formattedPhone = formatPhone(phone);
	const title =
		otpFlow === "forgot_password"
			? isArabic
				? "التحقق من رقم هاتفك الخاص"
				: "Verify your phone number"
			: isArabic
				? "ادخل رمز التفعيل"
				: "Enter the activation code";

	return (
		<AuthShell isArabic={isArabic}>
			<BackHeader onBack={onBack} disabled={isLoading} isArabic={isArabic} />

			<AuthTitle>{title}</AuthTitle>

			<motion.p
				initial={{ y: 8, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.4 }}
				className="mt-2 text-start text-[16px] font-normal leading-relaxed text-muted md:text-[17px]"
			>
				{isArabic
					? "تم ارسال رمز التحقق الى الرقم الخاص بك"
					: "A verification code was sent to"}{" "}
				<span dir="ltr" className="inline-block font-semibold text-foreground">
					{formattedPhone}
				</span>
			</motion.p>

			<motion.div
				initial={{ y: 8, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="mt-8 md:mt-10"
				dir="ltr"
				role="group"
				aria-label={
					isArabic
						? "رمز التحقق المكون من 6 أرقام"
						: "6-digit verification code"
				}
			>
				<div className="mx-auto flex w-full max-w-sm justify-center gap-2 sm:gap-3 md:max-w-md md:gap-4 lg:max-w-lg">
					{[0, 1, 2, 3, 4, 5].map((i) => {
						const isActive = i === code.length && !error;
						const isFilled = i < code.length;
						return (
							<button
								key={i}
								type="button"
								onClick={error ? handleClear : undefined}
								disabled={!error}
								aria-label={
									error
										? isArabic
											? "مسح رمز التحقق وإعادة الإدخال"
											: "Clear code and re-enter"
										: isArabic
											? `خانة ${i + 1}${isFilled ? `: ${code[i]}` : ""}`
											: `Digit ${i + 1}${isFilled ? `: ${code[i]}` : ""}`
								}
								className={[
									"flex h-14 min-w-0 flex-1 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-200 md:h-16 md:text-2xl",
									"focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-background",
									error ? "cursor-pointer" : "cursor-default disabled:opacity-100",
									isActive
										? "border-brand bg-green-50/60 text-foreground dark:bg-green-900/20"
										: error
											? "border-red-400 bg-red-50 text-red-500 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400"
											: isFilled
												? "border-brand bg-green-50/30 text-foreground dark:bg-green-900/10"
												: "border-[#C6C8CE] bg-background text-foreground",
								]
									.filter(Boolean)
									.join(" ")}
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
							</button>
						);
					})}
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className="mt-6 flex flex-col items-center gap-1.5 text-center md:mt-8"
			>
				{timer > 0 ? (
					<>
						<p className="text-[15px] font-medium text-muted md:text-[16px]">
							{isArabic
								? "في حال عدم وصول الرمز؟ إعادة الإرسال"
								: "Didn't get the code? Resend"}
						</p>
						<span className="inline-flex items-center gap-1.5 text-[15px] font-normal tabular-nums text-muted md:text-[16px]">
							<ClockIcon />
							{formatTime(timer)}
						</span>
					</>
				) : (
					<button
						type="button"
						onClick={handleResend}
						disabled={isResending}
						className="rounded-lg px-2 py-1 text-[15px] font-medium text-muted transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 md:text-[16px]"
					>
						{isArabic ? "في حال عدم وصول الرمز؟" : "Didn't get the code?"}{" "}
						<span className="font-bold text-brand">
							{isResending
								? isArabic
									? "جاري الإرسال..."
									: "Sending..."
								: isArabic
									? "إعادة الإرسال"
									: "Resend"}
						</span>
					</button>
				)}
			</motion.div>

			<div className="mt-8 md:mt-10">
				<PrimaryButton onClick={handleVerify} disabled={code.length !== 6 || isLoading}>
					{isLoading
						? isArabic
							? "جاري التحقق..."
							: "Verifying..."
						: isArabic
							? "إرسال"
							: "Submit"}
				</PrimaryButton>
			</div>

			<div className="-mx-4 mt-auto md:-mx-6 lg:-mx-8">
				<NumericKeypad
					isArabic={isArabic}
					onPress={handleKeyPress}
					onBackspace={handleBackspace}
				/>
			</div>
		</AuthShell>
	);
});

export default OtpScreen;
