"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Image from "next/image";

interface WelcomeScreenProps {
	isLoading?: boolean;
	onPhone: () => void;
	onApple: () => void;
	onGoogle: () => void;
	onGuest: () => void;
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

const Logo = memo(function Logo() {
	return (
		<Image
			src="/favicon.ico"
			alt="شله معك"
			width={223}
			height={160}
			className="h-[160px] w-[223px] rounded-lg object-contain opacity-100"
			priority
		/>
	);
});

const WelcomeScreen = memo(function WelcomeScreen({
	isLoading = false,
	onPhone,
	onApple,
	onGoogle,
	onGuest,
	onLanguageToggle,
}: WelcomeScreenProps) {
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

			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ type: "spring", stiffness: 200, damping: 15 }}
					>
						<Logo />
					</motion.div>

					<motion.h1
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.25, duration: 0.5 }}
						className="h-[30px] w-[272px] text-center text-[30px] leading-[30px] font-bold tracking-tight text-gray-900 opacity-100"
					>
						مرحباً بك
					</motion.h1>
				</div>
			</div>

			<div className="w-full space-y-3">
				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.35, duration: 0.4 }}
					whileTap={{ scale: 0.98 }}
					onClick={onPhone}
					disabled={isLoading}
					className="w-full rounded-2xl bg-[#30913F] py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					المتابعة برقم الهاتف
				</motion.button>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.45 }}
					className="relative flex items-center py-2"
				>
					<div className="h-px flex-1 bg-gray-200" />
					<span className="mx-4 text-sm font-medium text-gray-400">أو المتابعة بحساب</span>
					<div className="h-px flex-1 bg-gray-200" />
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.4 }}
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

				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.4 }}
					whileTap={{ scale: 0.98 }}
					onClick={onGuest}
					disabled={isLoading}
					className="w-full rounded-2xl bg-gray-100 py-4 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					المتابعة كزائر
				</motion.button>
			</div>
		</div>
	);
});

export default WelcomeScreen;
