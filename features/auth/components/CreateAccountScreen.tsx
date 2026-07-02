"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

interface CreateAccountScreenProps {
	isLoading?: boolean;
	error?: string | null;
	onBack: () => void;
	onCreate: (data: {
		fullName: string;
		phone: string;
		email?: string;
		password: string;
		confirmPassword: string;
	}) => void;
}

const CreateAccountScreen = memo(function CreateAccountScreen({
	isLoading = false,
	error,
	onBack,
	onCreate,
}: CreateAccountScreenProps) {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [agreed, setAgreed] = useState(false);

	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;

	const isValid =
		fullName.trim().length > 1 &&
		phone.length === 9 &&
		password.length >= 8 &&
		password === confirmPassword &&
		agreed;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onCreate({
			fullName: fullName.trim(),
			phone: `+966${phone}`,
			...(email.trim() && { email: email.trim() }),
			password,
			confirmPassword,
		});
	}, [fullName, email, phone, password, confirmPassword, isValid, onCreate]);

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

			<div className="mt-10 flex-1 overflow-y-auto">
				<motion.h1
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="text-[28px] font-bold text-gray-900"
				>
					إنشاء حساب
				</motion.h1>

				<motion.div
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className="mt-8 space-y-5"
				>
					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							الاسم بالكامل
						</label>
						<input
							type="text"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							placeholder="ادخل اسمك بالكامل"
							disabled={isLoading}
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-right text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#30913F] focus:ring-1 focus:ring-[#30913F] disabled:opacity-50"
							aria-label="الاسم بالكامل"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							البريد الالكتروني <span className="text-gray-400">(اختياري)</span>
						</label>
						<input
							type="email"
							inputMode="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="اكتب البريد الالكتروني"
							disabled={isLoading}
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-right text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#30913F] focus:ring-1 focus:ring-[#30913F] disabled:opacity-50"
							aria-label="البريد الالكتروني"
						/>
					</div>

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
									setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))
								}
								placeholder="00 000 0000"
								disabled={isLoading}
								className="flex-1 bg-transparent text-left text-lg text-gray-800 outline-none placeholder:text-gray-400"
								aria-label="رقم الهاتف"
							/>
							<div className="mx-3 h-6 w-px bg-gray-300" />
							<span className="text-lg font-medium text-gray-500">966+</span>
						</div>
					</div>

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
								aria-label="كلمة المرور"
							/>
						</div>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							ادخل كلمة المرور مرة أخرى
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
								aria-label="تأكيد كلمة المرور"
							/>
						</div>
						{passwordsMismatch && (
							<p className="mt-1.5 text-xs text-red-500">كلمتا المرور غير متطابقتين</p>
						)}
					</div>

					<motion.label
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="flex cursor-pointer items-center gap-3 pt-2 select-none"
					>
						<input
							type="checkbox"
							checked={agreed}
							onChange={(e) => setAgreed(e.target.checked)}
							disabled={isLoading}
							className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 bg-white text-[#30913F] transition-all focus:ring-2 focus:ring-[#30913F] focus:ring-offset-0 disabled:opacity-50"
						/>
						<span className="text-sm text-gray-600">أوافق على الشروط وسياسة الخصوصية</span>
					</motion.label>

					{error && (
						<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
					)}
				</motion.div>
			</div>

			<div className="mt-6 pt-2">
				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.35 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSubmit}
					disabled={!isValid || isLoading}
					className="w-full rounded-2xl bg-[#30913F] disabled:bg-[#30913F]/50 py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed"
				>
					{isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
				</motion.button>
			</div>
		</div>
	);
});

export default CreateAccountScreen;
