"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { getGuestId } from "@/features/auth/lib/auth.lib";
import { useRouter } from "next/navigation";

interface LoginScreenProps {
	isArabic: boolean;
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
		<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
			<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
		</svg>
	);
});

const GoogleIcon = memo(function GoogleIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
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
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
			<path
				d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
		</svg>
	);
});

const GuestIcon = memo(function GuestIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
			<circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
			<path
				d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
		</svg>
	);
});

const GuestActiveIcon = memo(function GuestActiveIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
			<path
				d="M8.5 12.5 11 15l4.5-5"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
});

const LoginScreen = memo(function LoginScreen({
	isArabic,
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
	const [hasGuestId, setHasGuestId] = useState(false);
	const router = useRouter();
	useEffect(() => {
		if (prefillPhone) setPhone(prefillPhone);
	}, [prefillPhone]);

	useEffect(() => {
		void getGuestId().then((guestId) => setHasGuestId(Boolean(guestId)));
	}, []);

	const isValid = phone.length === 9 && password.length > 0;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onLogin(`+966${phone}`, password);
	}, [phone, password, isValid, onLogin]);

	const handleTogglePassword = useCallback(() => {
		setShowPassword((s) => !s);
	}, []);

	return (
		<AuthShell isArabic={isArabic}>
			{onLanguageToggle && (
				<motion.button
					type="button"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1 }}
					onClick={onLanguageToggle}
					className="absolute top-14 end-4 z-10 inline-flex min-h-9 items-center gap-1 rounded-2xl border border-[#C6C8CE] bg-background px-2.5 py-1.5 text-[14px] font-normal text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:top-16 md:top-20 md:end-6 lg:end-8"
					aria-label={isArabic ? "تغيير اللغة" : "Change language"}
				>
					<GlobeIcon />
					{isArabic ? "English" : "العربية"}
				</motion.button>
			)}

			<div className="mt-8 flex flex-col items-center gap-6 sm:mt-10 md:mt-12 md:gap-8">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 200, damping: 15 }}
					className="flex h-20 w-20 items-center justify-center rounded-full bg-card/60 sm:h-24 sm:w-24 md:h-28 md:w-28"
				>
					<Image
						src="/favicon.ico"
						alt={isArabic ? "شلة" : "Shella"}
						width={64}
						height={46}
						sizes="64px"
						className="h-auto w-14 object-contain sm:w-16 md:w-[72px]"
						priority
					/>
				</motion.div>

				<motion.div
					initial={{ y: 12, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.15, duration: 0.4 }}
					className="flex max-w-xs flex-col items-center gap-2 md:max-w-sm lg:max-w-md"
				>
					<h1 className="text-center text-2xl font-bold leading-tight text-foreground sm:text-[25px] md:text-[28px]">
						{isArabic ? "مرحباً بك" : "Welcome"}
					</h1>
					<p className="text-center text-[15px] font-normal leading-relaxed text-muted sm:text-[16px] md:text-[17px]">
						{isArabic
							? "سجل دخول أو أنشئ حساب جديد للمتابعة"
							: "Sign in or create a new account to continue"}
					</p>
				</motion.div>
			</div>

			<motion.div
				initial={{ y: 12, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="mt-8 flex flex-col gap-4 md:mt-10"
			>
				<PhoneField
					value={phone}
					onChange={setPhone}
					onEnter={handleSubmit}
					disabled={isLoading}
					isArabic={isArabic}
				/>

				<div className="flex flex-col gap-2">
					<PasswordField
						label={isArabic ? "كلمة المرور" : "Password"}
						value={password}
						onChange={setPassword}
						onEnter={handleSubmit}
						show={showPassword}
						onToggle={handleTogglePassword}
						disabled={isLoading}
						isArabic={isArabic}
					/>

					<div className="flex flex-row-reverse items-center justify-between gap-3">
						<button
							type="button"
							onClick={onForgotPassword}
							disabled={isLoading}
							className="rounded px-1 py-0.5 text-[14px] font-medium text-muted underline transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-50"
						>
							{isArabic ? "نسيت كلمة المرور ؟" : "Forgot password?"}
						</button>
						<label className="flex cursor-pointer select-none items-center gap-2 opacity-80">
							<button
								type="button"
								role="checkbox"
								aria-checked={remember}
								aria-label={isArabic ? "تذكرني" : "Remember me"}
								disabled={isLoading}
								onClick={() => setRemember((r) => !r)}
								className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 ${remember
									? "border-brand bg-brand"
									: "border-muted bg-background"
									}`}
							>
								{remember && (
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
										<path
											d="M2.5 7.5 5.5 10.5 11.5 3.5"
											stroke="var(--brand-foreground)"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</button>
							<span className="text-[14px] font-medium text-foreground">
								{isArabic ? "تذكرني" : "Remember me"}
							</span>
						</label>
					</div>
				</div>

				<AnimatePresence>
					{infoMessage && (
						<motion.div
							initial={{ opacity: 0, y: -4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -4 }}
						>
							<InfoMessage>{infoMessage}</InfoMessage>
						</motion.div>
					)}
				</AnimatePresence>
				<AnimatePresence>
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -4 }}
						>
							<AuthErrorMessage error={error} isArabic={isArabic} />
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			<div className="mt-8 flex w-full flex-col gap-3 md:mt-10 md:gap-4">
				<PrimaryButton onClick={handleSubmit} disabled={!isValid || isLoading}>
					{isLoading
						? isArabic
							? "جاري تسجيل الدخول..."
							: "Signing in..."
						: isArabic
							? "تسجيل الدخول"
							: "Sign in"}
				</PrimaryButton>

				<SecondaryButton
					onClick={hasGuestId ? () => router.push("/home") : onGuest}
					disabled={isLoading}
					aria-label={
						hasGuestId
							? isArabic
								? "أنت تتصفح بالفعل كزائر"
								: "You are already browsing as a guest"
							: isArabic
								? "المتابعة كزائر"
								: "Continue as guest"
					}
				>
					<span className="inline-flex items-center justify-center gap-2">
						<span className={hasGuestId ? "text-brand" : "text-muted"}>
							{hasGuestId ? <GuestActiveIcon /> : <GuestIcon />}
						</span>
						{hasGuestId
							? isArabic
								? "أنت تتصفح كزائر"
								: "Browsing as guest"
							: isArabic
								? "المتابعة كزائر"
								: "Continue as guest"}
					</span>
				</SecondaryButton>

				<div className="flex items-center gap-3 py-1">
					<div className="h-px flex-1 bg-[#C6C8CE]" />
					<span className="shrink-0 text-[15px] font-normal text-muted sm:text-[16px]">
						{isArabic ? "أو المتابعة بحساب" : "Or continue with"}
					</span>
					<div className="h-px flex-1 bg-[#C6C8CE]" />
				</div>

				<div className="flex gap-2 md:gap-3">
					<button
						type="button"
						onClick={onApple}
						disabled={isLoading}
						aria-label={
							isArabic ? "تسجيل الدخول بحساب Apple" : "Sign in with Apple"
						}
						className="flex h-12 flex-1 items-center justify-center gap-3 rounded-2xl border border-[#C6C8CE] bg-background text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50"
					>
						<AppleIcon />
						<span className="text-[14px] font-medium text-muted">Apple</span>
					</button>
					<button
						type="button"
						onClick={onGoogle}
						disabled={isLoading}
						aria-label={
							isArabic ? "تسجيل الدخول بحساب Google" : "Sign in with Google"
						}
						className="flex h-12 flex-1 items-center justify-center gap-3 rounded-2xl border border-[#C6C8CE] bg-background transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50"
					>
						<GoogleIcon />
						<span className="text-[14px] font-medium text-muted">Google</span>
					</button>
				</div>

				<p className="pt-2 text-center text-[14px] font-medium text-foreground">
					{isArabic ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
					<button
						type="button"
						onClick={onRegister}
						disabled={isLoading}
						className="rounded font-bold text-brand transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-50"
					>
						{isArabic ? "إنشاء حساب" : "Create account"}
					</button>
				</p>
			</div>
		</AuthShell>
	);
});

export default LoginScreen;
