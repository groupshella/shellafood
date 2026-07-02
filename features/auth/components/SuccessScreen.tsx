"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SuccessScreenProps {
	title: string;
	subtitle: string;
	buttonLabel: string;
	onAction: () => void;
}

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
			className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-white px-6 pb-8"
		>
			<motion.div
				initial={{ scale: 0.6, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: "spring", stiffness: 200, damping: 14 }}
				className="flex h-28 w-28 items-center justify-center rounded-full bg-[#30913F]/10"
			>
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#30913F] shadow-lg shadow-[#30913F]/25">
					<Check className="h-10 w-10 text-white" strokeWidth={2.5} />
				</div>
			</motion.div>

			<motion.h1
				initial={{ y: 15, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.4 }}
				className="mt-8 text-center text-[22px] font-bold text-gray-900"
			>
				{title}
			</motion.h1>

			<motion.p
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="mt-2 max-w-[280px] text-center text-sm leading-relaxed text-gray-500"
			>
				{subtitle}
			</motion.p>

			<motion.button
				type="button"
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.4 }}
				whileTap={{ scale: 0.98 }}
				onClick={onAction}
				className="mt-10 w-full rounded-2xl bg-[#30913F] py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
			>
				{buttonLabel}
			</motion.button>
		</div>
	);
});

export default SuccessScreen;
