"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Globe } from "lucide-react";
import Image from "next/image";

interface LoginScreenProps {
	isLoading?: boolean;
	error?: string | null;
	infoMessage?: string | null;
	onLogin: (phone: string, password: string) => void;
	onForgotPassword: () => void;
	onRegister: () => void;
	onGuest: () => void;
	onApple?: () => void;
	onGoogle?: () => void;
	onLanguageToggle?: () => void;
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

const LoginScreen = memo(function LoginScreen({
	isLoading = false,
	error,
	infoMessage,
	onLogin,
	onForgotPassword,
	onRegister,
	onGuest,
	onApple,
	onGoogle,
	onLanguageToggle,
}: LoginScreenProps) {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const isValid = phone.length === 9 && password.length > 0;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onLogin(`+966${phone}`, password);
	}, [phone, password, isValid, onLogin]);

	return (
		<div
			dir="rtl"
			lang="ar"
			className="relative flex min-h-dvh w-full flex-col bg-white px-6 pt-16 pb-8"
		>
			<motion.button
				type="button"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				onClick={onLanguageToggle}
				className="absolute top-6 right-6 z-10 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
				aria-label="Change language"
			>
				<Globe className="h-4 w-4 text-black" />
				English
			</motion.button>

			<div className="mt-8 flex flex-col items-center gap-3">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 200, damping: 15 }}
					className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50"
				>
					<Image
						src="/favicon.ico"
						alt="شلة"
						width={40}
						height={40}
						className="h-10 w-10 object-contain"
						priority
					/>
				</motion.div>

				<motion.div
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.15, duration: 0.4 }}
					className="text-center"
				>
					<h1 className="text-[22px] font-bold text-gray-900">مرحباً بك</h1>
					<p className="mt-1 text-sm text-gray-500">
						سجل دخول أو أنشئ حساب جديد للمتابعة
					</p>
				</motion.div>
			</div>

			<motion.div
				initial={{ y: 15, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="mt-8 space-y-5"
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
							onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
							placeholder="00 000 0000"
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
							onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
							placeholder="كلمة المرور"
							className="flex-1 bg-transparent px-3 text-right text-gray-800 outline-none placeholder:text-gray-400"
							aria-label="كلمة المرور"
						/>
					</div>
					<button
						type="button"
						onClick={onForgotPassword}
						className="mt-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#30913F]"
					>
						نسيت كلمة المرور؟
					</button>
				</div>

				{infoMessage && (
					<p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-[#2a8036]">
						{infoMessage}
					</p>
				)}
				{error && (
					<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
				)}
			</motion.div>

			<div className="mt-8 w-full space-y-3">
				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.4 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSubmit}
					disabled={!isValid || isLoading}
					className="w-full rounded-2xl bg-[#30913F] disabled:bg-[#30913F]/50 py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed"
				>
					{isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
				</motion.button>

				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.35, duration: 0.4 }}
					whileTap={{ scale: 0.98 }}
					onClick={onGuest}
					disabled={isLoading}
					className="w-full rounded-2xl bg-gray-100 py-4 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					المتابعة كزائر
				</motion.button>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="relative flex items-center py-2"
				>
					<div className="h-px flex-1 bg-gray-200" />
					<span className="mx-4 text-sm font-medium text-gray-400">أو المتابعة بحساب</span>
					<div className="h-px flex-1 bg-gray-200" />
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.45, duration: 0.4 }}
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

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="pt-2 text-center text-sm text-gray-500"
				>
					ليس لديك حساب؟{" "}
					<button
						type="button"
						onClick={onRegister}
						className="font-semibold text-[#30913F] hover:text-[#2a8036]"
					>
						إنشاء حساب
					</button>
				</motion.p>
			</div>
		</div>
	);
});

export default LoginScreen;
