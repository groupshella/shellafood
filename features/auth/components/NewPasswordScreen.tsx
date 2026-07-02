"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff, Lock } from "lucide-react";

interface NewPasswordScreenProps {
	isLoading?: boolean;
	error?: string | null;
	onBack: () => void;
	onSubmit: (password: string, confirmPassword: string) => void;
}

const NewPasswordScreen = memo(function NewPasswordScreen({
	isLoading = false,
	error,
	onBack,
	onSubmit,
}: NewPasswordScreenProps) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;
	const isValid = password.length >= 8 && password === confirmPassword;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onSubmit(password, confirmPassword);
	}, [password, confirmPassword, isValid, onSubmit]);

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
					className="text-[26px] font-bold text-gray-900"
				>
					إنشاء كلمة مرور جديدة
				</motion.h1>

				<motion.p
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1 }}
					className="mt-2 text-sm text-gray-500"
				>
					ادخل كلمة المرور الجديدة
				</motion.p>

				<motion.div
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.15, duration: 0.4 }}
					className="mt-8 space-y-5"
				>
					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							كلمة المرور
						</label>
						<div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all focus-within:border-[#30913F] focus-within:ring-1 focus-within:ring-[#30913F]">
							<button
								type="button"
								onClick={() => setShowPassword((s) => !s)}
								className="text-gray-400 transition-colors hover:text-gray-600"
								aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
							>
								{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
							</button>
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="كلمة المرور"
								disabled={isLoading}
								className="flex-1 bg-transparent px-3 text-right text-gray-800 outline-none placeholder:text-gray-400"
								aria-label="كلمة المرور الجديدة"
							/>
						</div>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							اعادة كتابة كلمة المرور
						</label>
						<div
							className={`flex items-center rounded-xl border bg-white px-4 py-3.5 transition-all focus-within:ring-1 ${passwordsMismatch
								? "border-red-400 focus-within:border-red-400 focus-within:ring-red-400"
								: "border-gray-200 focus-within:border-[#30913F] focus-within:ring-[#30913F]"
								}`}
						>
							<button
								type="button"
								onClick={() => setShowConfirm((s) => !s)}
								className="text-gray-400 transition-colors hover:text-gray-600"
								aria-label={showConfirm ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
							>
								{showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
							</button>
							<input
								type={showConfirm ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
								placeholder="كلمة المرور"
								disabled={isLoading}
								className="flex-1 bg-transparent px-3 text-right text-gray-800 outline-none placeholder:text-gray-400"
								aria-label="تأكيد كلمة المرور الجديدة"
							/>
						</div>
						{passwordsMismatch && (
							<p className="mt-1.5 text-xs text-red-500">كلمتا المرور غير متطابقتين</p>
						)}
					</div>

					<p className="flex items-center gap-1.5 text-xs text-gray-400">
						<Lock className="h-3.5 w-3.5" />
						يجب أن تتكون كلمة المرور من 8 أحرف على الأقل
					</p>

					{error && (
						<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
					)}
				</motion.div>
			</div>

			<div className="mt-auto pt-8">
				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSubmit}
					disabled={!isValid || isLoading}
					className="w-full rounded-2xl bg-[#30913F] disabled:bg-[#30913F]/50 py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed"
				>
					{isLoading ? "جاري الحفظ..." : "حفظ"}
				</motion.button>
			</div>
		</div>
	);
});

export default NewPasswordScreen;
