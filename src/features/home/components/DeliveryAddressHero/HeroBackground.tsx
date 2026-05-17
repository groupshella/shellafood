"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HeroBackground() {
	return (
		<div className="absolute inset-0 overflow-hidden" aria-hidden>
			{/* Base mesh */}
			<div className="absolute inset-0 bg-gradient-to-b from-emerald-50/90 via-white to-gray-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

			{/* Soft color washes */}
			<div className="absolute -top-24 start-0 h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />
			<div className="absolute top-1/3 -end-32 h-[360px] w-[360px] rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-800/15" />
			<div className="absolute -bottom-20 start-1/4 h-[280px] w-[280px] rounded-full bg-green-200/40 blur-3xl dark:bg-green-900/20" />

			{/* Slow drift orbs */}
			<motion.div
				animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
				transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-16 end-[10%] h-56 w-56 rounded-full bg-emerald-300/25 blur-2xl dark:bg-emerald-700/15"
			/>
			<motion.div
				animate={{ x: [0, -32, 0], y: [0, 28, 0] }}
				transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
				className="absolute bottom-24 start-[8%] h-64 w-64 rounded-full bg-green-400/20 blur-2xl dark:bg-green-800/10"
			/>

			{/* Subtle grid */}
			<div
				className="absolute inset-0 opacity-[0.35] dark:opacity-20"
				style={{
					backgroundImage:
						"linear-gradient(to right, rgb(16 185 129 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(16 185 129 / 0.06) 1px, transparent 1px)",
					backgroundSize: "48px 48px",
				}}
			/>

			{/* Bottom fade into page content */}
			<div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80" />
		</div>
	);
}
