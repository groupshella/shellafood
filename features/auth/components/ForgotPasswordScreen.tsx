"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Lock } from "lucide-react";

interface ForgotPasswordScreenProps {
	isLoading?: boolean;
	error?: string | null;
	onBack: () => void;
	onSubmit: (phone: string) => void;
}

const ForgotPasswordScreen = memo(function ForgotPasswordScreen({
	isLoading = false,
	error,
	onBack,
	onSubmit,
}: ForgotPasswordScreenProps) {
	const [phone, setPhone] = useState("");

	const isValid = phone.length === 9;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onSubmit(`+966${phone}`);
	}, [phone, isValid, onSubmit]);

	return (
		<div
			dir="rtl"
			lang="ar"
			className="relative flex min-h-dvh w-full flex-col bg-white px-6 pt-16 pb-8"
		>
			<motion.button
				type="button"
				initial={{ opacity: 0, x: 10 }}
				animate={{ opacity: 1, x: 0 }}
				onClick={onBack}
				disabled={isLoading}
				className="absolute top-6 left-3 rounded-full p-2 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-50"
				aria-label="رجوع"
			>
				<ChevronLeft className="h-6 w-6 text-gray-700" />
			</motion.button>

			<div className="mt-10">
				<motion.h1
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="text-[26px] font-bold leading-snug text-gray-900"
				>
					الاستعادة عن طريق
					<br />
					رقم الهاتف
				</motion.h1>

				<motion.div
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className="mt-8"
				>
					<label className="mb-2 block text-sm font-semibold text-gray-900">
						رقم الهاتف
					</label>
					<div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all focus-within:border-[#30913F] focus-within:ring-1 focus-within:ring-[#30913F]">
						<input
							type="tel"
							inputMode="numeric"
							value={phone}
							onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
							onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
							placeholder="00 000 0000"
							disabled={isLoading}
							className="flex-1 bg-transparent text-left text-lg text-gray-800 outline-none placeholder:text-gray-400"
							aria-label="رقم الهاتف"
						/>
						<div className="mx-3 h-6 w-px bg-gray-300" />
						<span className="text-lg font-medium text-gray-500">966+</span>
					</div>

					<div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
						<Lock className="h-3.5 w-3.5" />
						<span>سيتم ارسال رمز التحقق الى هاتفك</span>
					</div>

					{error && (
						<p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
							{error}
						</p>
					)}
				</motion.div>
			</div>

			<div className="mt-auto pt-8">
				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.25 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSubmit}
					disabled={!isValid || isLoading}
					className="w-full rounded-2xl bg-[#30913F] disabled:bg-[#30913F]/50 py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed"
				>
					{isLoading ? "جاري الإرسال..." : "المتابعة"}
				</motion.button>
			</div>
		</div>
	);
});

export default ForgotPasswordScreen;
