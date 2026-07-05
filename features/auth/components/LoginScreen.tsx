"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import {
	AuthShell,
	AuthErrorMessage,
	InfoMessage,
	PasswordField,
	PhoneField,
	PrimaryButton,
	SecondaryButton,
} from "@/features/auth/components/shared/AuthPrimitives";

interface LoginScreenProps {
	isLoading?: boolean;
	error?: string | null;
	infoMessage?: string | null;
	prefillPhone?: string;
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
		<svg width="20" height="20" viewBox="0 0 24 24" fill="#111B18">
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

const GlobeIcon = memo(function GlobeIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
			<circle cx="12" cy="12" r="9" stroke="#111B18" strokeWidth="1.6" />
			<path
				d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
				stroke="#111B18"
				strokeWidth="1.4"
			/>
		</svg>
	);
});

const LoginScreen = memo(function LoginScreen({
	isLoading = false,
	error,
	infoMessage,
	prefillPhone = "",
	onLogin,
	onForgotPassword,
	onRegister,
	onGuest,
	onApple,
	onGoogle,
	onLanguageToggle,
}: LoginScreenProps) {
	const [phone, setPhone] = useState(prefillPhone);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);

	useEffect(() => {
		if (prefillPhone) setPhone(prefillPhone);
	}, [prefillPhone]);

	const isValid = phone.length === 9 && password.length > 0;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onLogin(`+966${phone}`, password);
	}, [phone, password, isValid, onLogin]);

	return (
		<AuthShell>
			<motion.button
				type="button"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.1 }}
				onClick={onLanguageToggle}
				className="absolute top-14 right-4 z-10 inline-flex items-center gap-1 rounded-2xl border border-[#C6C8CE] bg-white px-2 py-1 text-[14px] font-normal text-[#111B18] sm:top-16"
				aria-label="Change language"
			>
				<GlobeIcon />
				English
			</motion.button>

			<div className="mt-10 flex flex-col items-center gap-6">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 200, damping: 15 }}
					className="flex h-20 w-20 items-center justify-center rounded-full"
					style={{ background: "rgba(235, 235, 235, 0.5)" }}
				>
					<Image
						src="/favicon.ico"
						alt="شلة"
						width={64}
						height={46}
						className="h-[46px] w-16 object-contain"
						priority
					/>
				</motion.div>

				<motion.div
					initial={{ y: 12, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.15, duration: 0.4 }}
					className="flex flex-col items-center gap-2"
				>
					<h1 className="text-center text-[25px] font-bold leading-[30px] text-[#111B18]">
						مرحباً بك
					</h1>
					<p className="text-center text-[16px] font-normal text-[#555555]">
						سجل دخول أو أنشئ حساب جديد للمتابعة
					</p>
				</motion.div>
			</div>

			<motion.div
				initial={{ y: 12, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="mt-8 flex flex-col gap-4"
			>
				<PhoneField value={phone} onChange={setPhone} onEnter={handleSubmit} disabled={isLoading} />

				<div className="flex flex-col gap-2">
					<PasswordField
						label="كلمة المرور"
						value={password}
						onChange={setPassword}
						onEnter={handleSubmit}
						show={showPassword}
						onToggle={() => setShowPassword((s) => !s)}
						disabled={isLoading}
					/>

					<div className="flex items-center flex-row-reverse justify-between">
						<button
							type="button"
							onClick={onForgotPassword}
							className="text-[14px] font-medium text-[#555555] underline transition-colors hover:text-[#30913F]"
						>
							نسيت كلمة المرور ؟
						</button>
						<label className="flex cursor-pointer select-none items-center gap-2 opacity-80">
							<button
								type="button"
								role="checkbox"
								aria-checked={remember}
								onClick={() => setRemember((r) => !r)}
								className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${remember ? "border-[#30913F] bg-[#30913F]" : "border-[#555555] bg-white"
									}`}
							>
								{remember && (
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
										<path
											d="M2.5 7.5 5.5 10.5 11.5 3.5"
											stroke="#fff"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</button>
							<span className="text-[14px] font-medium text-[#111B18]">تذكرني</span>

						</label>
					</div>
				</div>

				{infoMessage && <InfoMessage>{infoMessage}</InfoMessage>}
				{error && <AuthErrorMessage error={error} />}
			</motion.div>

			<div className="mt-8 flex w-full flex-col gap-3">
				<PrimaryButton onClick={handleSubmit} disabled={!isValid || isLoading}>
					{isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
				</PrimaryButton>

				<SecondaryButton onClick={onGuest} disabled={isLoading}>
					المتابعة كزائر
				</SecondaryButton>

				<div className="flex items-center gap-3 py-1">
					<div className="h-px flex-1 bg-[#C6C8CE]" />
					<span className="text-[16px] font-normal text-[#555555]">أو المتابعة بحساب</span>
					<div className="h-px flex-1 bg-[#C6C8CE]" />
				</div>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={onApple}
						className="flex h-12 flex-1 items-center justify-center gap-3 rounded-2xl border border-[#C6C8CE] bg-white transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
					>
						<AppleIcon />
						<span className="text-[14px] font-medium text-[#555555]">Apple</span>
					</button>
					<button
						type="button"
						onClick={onGoogle}
						className="flex h-12 flex-1 items-center justify-center gap-3 rounded-2xl border border-[#C6C8CE] bg-white transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
					>
						<GoogleIcon />
						<span className="text-[14px] font-medium text-[#555555]">Google</span>
					</button>
				</div>

				<p className="pt-2 text-center text-[14px] font-medium text-[#111B18]">
					ليس لديك حساب؟{" "}
					<button
						type="button"
						onClick={onRegister}
						className="font-bold text-[#30913F] hover:text-[#2a8036]"
					>
						إنشاء حساب
					</button>
				</p>
			</div>
		</AuthShell>
	);
});

export default LoginScreen;
