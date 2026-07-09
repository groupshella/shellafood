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
		otpFlow === "forgot_password" ? "التحقق من رقم هاتفك الخاص" : "ادخل رمز التفعيل";

	return (
		<AuthShell>
			<BackHeader onBack={onBack} disabled={isLoading} />

			<AuthTitle>{title}</AuthTitle>

			<motion.p
				initial={{ y: 8, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.4 }}
				className="mt-2 text-start text-[16px] font-normal leading-relaxed text-[#555555] dark:text-gray-400"
			>
				تم ارسال رمز التحقق الى الرقم الخاص بك{" "}
				<span dir="ltr" className="inline-block font-semibold text-[#111B18] dark:text-gray-100">
					{formattedPhone}
				</span>
			</motion.p>

			<motion.div
				initial={{ y: 8, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="mt-8"
				dir="ltr"
				role="group"
				aria-label="رمز التحقق المكون من 6 أرقام"
			>
				<div className="flex justify-center gap-2 sm:gap-3">
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
										? "مسح رمز التحقق وإعادة الإدخال"
										: `خانة ${i + 1}${isFilled ? `: ${code[i]}` : ""}`
								}
								className={[
									"flex h-14 min-w-0 flex-1 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-200",
									"focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900",
									error ? "cursor-pointer" : "cursor-default disabled:opacity-100",
									isActive
										? "border-[#30913F] bg-green-50/60 text-[#111B18] dark:bg-green-900/20 dark:text-gray-100"
										: error
											? "border-red-400 bg-red-50 text-red-500 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400"
											: isFilled
												? "border-[#30913F] bg-green-50/30 text-[#111B18] dark:bg-green-900/10 dark:text-gray-100"
												: "border-[#C6C8CE] bg-white text-[#111B18] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
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
				className="mt-6 flex flex-col items-center gap-1.5 text-center"
			>
				{timer > 0 ? (
					<>
						<p className="text-[15px] font-medium text-[#555555] dark:text-gray-400">
							في حال عدم وصول الرمز؟ إعادة الإرسال
						</p>
						<span className="inline-flex items-center gap-1.5 text-[15px] font-normal tabular-nums text-[#555555] dark:text-gray-400">
							<ClockIcon />
							{formatTime(timer)}
						</span>
					</>
				) : (
					<button
						type="button"
						onClick={handleResend}
						disabled={isResending}
						className="rounded-lg px-2 py-1 text-[15px] font-medium text-[#555555] transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:opacity-50 dark:text-gray-400 dark:focus-visible:ring-offset-gray-900"
					>
						في حال عدم وصول الرمز؟{" "}
						<span className="font-bold text-[#30913F]">
							{isResending ? "جاري الإرسال..." : "إعادة الإرسال"}
						</span>
					</button>
				)}
			</motion.div>

			<div className="mt-8">
				<PrimaryButton onClick={handleVerify} disabled={code.length !== 6 || isLoading}>
					{isLoading ? "جاري التحقق..." : "إرسال"}
				</PrimaryButton>
			</div>

			<div className="-mx-4 mt-auto">
				<NumericKeypad onPress={handleKeyPress} onBackspace={handleBackspace} />
			</div>
		</AuthShell>
	);
});

export default OtpScreen;
