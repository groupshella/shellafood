"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import { PrimaryButton } from "@/features/auth/components/shared/AuthPrimitives";

interface SuccessScreenProps {
	title: string;
	subtitle: string;
	buttonLabel: string;
	onAction: () => void;
}

const SuccessIllustration = memo(function SuccessIllustration() {
	return (
		<motion.svg
			viewBox="0 0 176 176"
			fill="none"
			className="h-auto w-full max-w-[160px] sm:max-w-[176px]"
			initial={{ scale: 0.6, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ type: "spring", stiffness: 200, damping: 14 }}
			aria-hidden
		>
			<defs>
				<linearGradient id="successGrad" x1="88" y1="30" x2="88" y2="146" gradientUnits="userSpaceOnUse">
					<stop stopColor="#8CC63F" />
					<stop offset="1" stopColor="#39B54A" />
				</linearGradient>
			</defs>

			<g opacity="0.18" fill="url(#successGrad)">
				<circle cx="26" cy="60" r="5" />
				<circle cx="150" cy="54" r="6" />
				<circle cx="40" cy="126" r="4" />
				<circle cx="140" cy="128" r="5" />
				<circle cx="88" cy="20" r="4" />
				<rect x="18" y="92" width="8" height="8" rx="2" transform="rotate(20 22 96)" />
				<rect x="150" y="96" width="9" height="9" rx="2" transform="rotate(-15 154 100)" />
			</g>

			<circle cx="88" cy="88" r="52" fill="url(#successGrad)" />

			<motion.path
				d="M66 89 82 105 112 73"
				stroke="#fff"
				strokeWidth="8"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
			/>
		</motion.svg>
	);
});

const SuccessScreen = memo(function SuccessScreen({
	title,
	subtitle,
	buttonLabel,
	onAction,
}: SuccessScreenProps) {
	return (
		<div
			dir="rtl"
			lang="ar"
			className="relative flex min-h-dvh w-full flex-col bg-white text-[#111B18] dark:bg-gray-900 dark:text-gray-100"
		>
			<div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 pb-8 pt-14 sm:pt-16">
				<div
					className="flex flex-1 flex-col items-center justify-center"
					role="status"
					aria-live="polite"
				>
					<SuccessIllustration />

					<motion.h1
						initial={{ y: 12, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.4 }}
						className="mt-8 text-center text-2xl font-bold leading-tight text-[#111B18] dark:text-gray-100 sm:text-[24px]"
					>
						{title}
					</motion.h1>

					<motion.p
						initial={{ y: 8, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.25, duration: 0.4 }}
						className="mt-2 max-w-xs text-center text-[15px] font-normal leading-relaxed text-[#555555] dark:text-gray-400 sm:max-w-sm sm:text-[16px]"
					>
						{subtitle}
					</motion.p>
				</div>

				<div className="w-full pt-4">
					<PrimaryButton onClick={onAction}>{buttonLabel}</PrimaryButton>
				</div>
			</div>
		</div>
	);
});

export default SuccessScreen;
