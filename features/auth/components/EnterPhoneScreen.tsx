"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface EnterPhoneScreenProps {
	onBack: () => void;
	onContinue: (phone: string) => void;
	onApple?: () => void;
	onGoogle?: () => void;
}

const AppleIcon = memo(function AppleIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
		</svg>
	);
});

const GoogleIcon = memo(function GoogleIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24">
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
});

const EnterPhoneScreen = memo(function EnterPhoneScreen({
	onBack,
	onContinue,
	onApple,
	onGoogle,
}: EnterPhoneScreenProps) {
	const [phone, setPhone] = useState("");

	const handleSubmit = useCallback(() => {
		if (phone.trim().length >= 9) onContinue(phone);
	}, [phone, onContinue]);

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
				className="absolute top-6 left-3 rounded-full p-2 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
				aria-label="رجوع"
			>
				<ChevronLeft className="h-6 w-6 text-gray-700" />
			</motion.button>

			<div className="mt-10">
				<motion.h1
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="text-[28px] font-bold text-gray-900"
				>
					تسجيل الدخول
				</motion.h1>

				<motion.div
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className="mt-8 space-y-6"
				>
					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							رقم الهاتف
						</label>
						<div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all focus-within:border-[#30913F] focus-within:ring-1 focus-within:ring-[#30913F]">
							<input
								type="tel"
								inputMode="numeric"
								value={phone}
								onChange={(e) =>
									setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
								}
								placeholder="00 000 0000"
								className="flex-1 bg-transparent text-left text-lg text-gray-800 outline-none placeholder:text-gray-400"
								aria-label="رقم الهاتف"
							/>
							<div className="mx-3 h-6 w-px bg-gray-300" />
							<span className="text-lg font-medium text-gray-500">966+</span>
						</div>
						<p className="mt-3 text-right text-sm leading-relaxed text-gray-500">
							سوف نصلك رسالة نصية قصيرة تحتوي على رمز التفعيل إلى هاتفك
						</p>
					</div>
				</motion.div>
			</div>

			<div className="mt-auto w-full space-y-4">
				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.25 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSubmit}
					disabled={phone.length < 9}
					className="w-full rounded-2xl bg-[#30913F] py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					المتابعة
				</motion.button>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.35 }}
					className="relative flex items-center py-1"
				>
					<div className="h-px flex-1 bg-gray-200" />
					<span className="mx-4 text-sm font-medium text-gray-400">أو المتابعة بحساب</span>
					<div className="h-px flex-1 bg-gray-200" />
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="flex gap-3"
				>
					<button
						type="button"
						onClick={onGoogle}
						className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
					>
						<GoogleIcon />
						<span className="text-sm font-semibold text-gray-800">Google</span>
					</button>
					<button
						type="button"
						onClick={onApple}
						className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
					>
						<AppleIcon />
						<span className="text-sm font-semibold text-gray-800">Apple</span>
					</button>
				</motion.div>
			</div>
		</div>
	);
});

export default EnterPhoneScreen;
