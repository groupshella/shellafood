"use client";

import { memo, type CSSProperties } from "react";
import { motion } from "framer-motion";

interface RoleSelectionScreenProps {
	onSelectRole: (role: "receiver" | "provider") => void;
}

interface BlurGlowProps {
	color: string;
	width: number;
	height: number;
	rotate?: number;
	className?: string;
	blur?: number;
}

const BlurGlow = memo(function BlurGlow({
	color,
	width,
	height,
	rotate = 0,
	className = "",
	blur = 80,
}: BlurGlowProps) {
	const wrapperStyle: CSSProperties = {
		width,
		height,
		transform: `rotate(${rotate}deg)`,
	};

	const glowStyle: CSSProperties = {
		background: color,
		filter: `blur(${blur}px)`,
	};

	return (
		<div
			aria-hidden
			className={`pointer-events-none absolute z-0 ${className}`}
			style={wrapperStyle}
		>
			<div className="h-full w-full scale-125 rounded-[50%] opacity-100" style={glowStyle} />
		</div>
	);
});

const ReceiverBlob = memo(function ReceiverBlob() {
	return (
		<img
			src="/login/receiver.png"
			alt=""
			width={160}
			height={160}
			className="relative z-10 object-contain"
		/>
	);
});

const ProviderBlob = memo(function ProviderBlob() {
	return (
		<img
			src="/login/provider.png"
			alt=""
			width={160}
			height={160}
			className="relative z-10 object-contain"
		/>
	);
});

const RoleSelectionScreen = memo(function RoleSelectionScreen({
	onSelectRole,
}: RoleSelectionScreenProps) {
	return (
		<div
			dir="rtl"
			lang="ar"
			className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-white px-6 pt-20 pb-10"
		>
			<div className="relative mx-auto h-[300px] w-full max-w-sm overflow-visible sm:h-[340px]">
				<motion.div
					initial={{ x: 30, opacity: 0, rotate: -8 }}
					animate={{ x: 0, opacity: 1, rotate: -6 }}
					transition={{ type: "spring", stiffness: 120, damping: 12 }}
					className="absolute top-0 left-0 z-20"
				>
					<div className="relative isolate">
						<BlurGlow
							color="rgba(48, 145, 63, 0.5)"
							width={200}
							height={200}
							rotate={-18}
							blur={88}
							className="-bottom-14 -left-16"
						/>
						<ReceiverBlob />
						<span className="absolute -top-2 right-2 z-20 rounded-lg bg-white/80 px-2 py-0.5 text-lg font-bold text-[#30913F] backdrop-blur-sm">
							متلقي للخدمة
						</span>
					</div>
				</motion.div>

				<motion.div
					initial={{ x: -30, opacity: 0, rotate: 8 }}
					animate={{ x: 0, opacity: 1, rotate: 6 }}
					transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.15 }}
					className="absolute top-[5.5rem] right-0 z-20 sm:top-24"
				>
					<div className="relative isolate">
						<BlurGlow
							color="#6B7280"
							width={179.61}
							height={183.94}
							rotate={-111.32}
							blur={72}
							className="-bottom-20 left-2"
						/>

						<ProviderBlob />
						<span className="absolute -top-8 left-2 z-20 rounded-lg bg-white/80 px-2 py-0.5 text-lg font-bold text-[#21133E] backdrop-blur-sm">
							مقدم للخدمة
						</span>
					</div>
				</motion.div>
			</div>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="mt-4 text-center"
			>
				<h1 className="text-2xl leading-snug font-bold text-gray-900">
					هل أنت متلقي ام مقدم للخدمة؟
				</h1>
				<p className="mt-2 text-sm text-gray-500">يمكنك تغيير الوضع لاحقاً</p>
			</motion.div>

			<div className="mt-auto w-full space-y-3">
				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => onSelectRole("receiver")}
					className="w-full rounded-2xl bg-[#30913F] py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
				>
					متلقي للخدمة
				</motion.button>

				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => onSelectRole("provider")}
					className="w-full rounded-2xl bg-gray-100 py-4 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
				>
					مقدم للخدمة
				</motion.button>
			</div>
		</div>
	);
});

export default RoleSelectionScreen;
