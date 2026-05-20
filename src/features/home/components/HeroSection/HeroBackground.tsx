"use client";

import React from "react";
import { motion } from "framer-motion";

// ── Floating food chip (emoji, no external images) ─────────────────────────
function FloatingFood({
	emoji,
	className,
	delay = 0,
	duration = 20,
	x,
	y,
	size = 52,
}: {
	emoji: string;
	className?: string;
	delay?: number;
	duration?: number;
	x: [number, number, number];
	y: [number, number, number];
	size?: number;
}) {
	return (
		<motion.div
			className={`absolute select-none pointer-events-none ${className ?? ""}`}
			animate={{ x, y, rotate: [0, 8, -5, 0] }}
			transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
			style={{
				fontSize: size,
				lineHeight: 1,
				filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.13))",
			}}
			aria-hidden
		>
			{emoji}
		</motion.div>
	);
}

export default function HeroBackground() {
	return (
		<div className="absolute inset-0 overflow-hidden" aria-hidden>

			{/* ── BASE GRADIENT ────────────────────────────── */}
			{/* Light: warm cream → pale green */}
			<div
				className="absolute inset-0 dark:hidden"
				style={{
					background:
						"linear-gradient(140deg, #fffbf0 0%, #f0fff8 45%, #ecfdf5 100%)",
				}}
			/>
			{/* Dark: deep green-black */}
			<div
				className="absolute inset-0 hidden dark:block"
				style={{
					background:
						"linear-gradient(140deg, #0b1810 0%, #0d2318 50%, #091410 100%)",
				}}
			/>

			{/* ── COLOUR BLOBS ─────────────────────────────── */}
			{/* Amber/yellow — top-left — gives warmth */}
			<div
				className="absolute -top-28 -left-24 h-[460px] w-[460px] rounded-full blur-3xl opacity-55 dark:opacity-15"
				style={{
					background: "radial-gradient(circle, #fde68a 0%, #fbbf24 50%, transparent 78%)",
				}}
			/>
			{/* Mint green — top-right */}
			<div
				className="absolute -top-16 right-0 h-[400px] w-[400px] rounded-full blur-3xl opacity-50 dark:opacity-12"
				style={{
					background: "radial-gradient(circle, #bbf7d0 0%, #6ee7b7 50%, transparent 75%)",
				}}
			/>
			{/* Coral/peach — bottom-left accent */}
			<div
				className="absolute -bottom-8 left-[20%] h-[300px] w-[300px] rounded-full blur-3xl opacity-30 dark:opacity-10"
				style={{
					background: "radial-gradient(circle, #fca5a5 0%, #fb923c 50%, transparent 75%)",
				}}
			/>

			{/* ── DRIFTING ORBS ───────────────────────────── */}
			<motion.div
				animate={{ x: [0, 36, 0], y: [0, -20, 0] }}
				transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-[20%] right-[10%] h-56 w-56 rounded-full blur-3xl opacity-35 dark:opacity-10"
				style={{ background: "radial-gradient(circle, #fde68a 0%, transparent 72%)" }}
			/>
			<motion.div
				animate={{ x: [0, -28, 0], y: [0, 28, 0] }}
				transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
				className="absolute bottom-[18%] left-[4%] h-64 w-64 rounded-full blur-3xl opacity-30 dark:opacity-8"
				style={{ background: "radial-gradient(circle, #86efac 0%, transparent 70%)" }}
			/>

			{/* ── FLOATING FOOD ─────────────────────────────── */}
			{/* Positioned on the right half so they never crowd the copy */}
			<FloatingFood emoji="🍕" size={60} x={[0, 18, 0]} y={[0, -14, 0]} delay={0} duration={20}
				className="top-[6%] right-[5%] sm:right-[8%]" />

			<FloatingFood emoji="🍔" size={52} x={[0, -14, 0]} y={[0, 12, 0]} delay={1.1} duration={25}
				className="top-[52%] right-[2%] sm:right-[4%]" />

			<FloatingFood emoji="🌮" size={46} x={[0, 10, 0]} y={[0, -16, 0]} delay={0.5} duration={22}
				className="bottom-[16%] right-[14%] sm:right-[16%] hidden sm:block" />

			<FloatingFood emoji="🍜" size={44} x={[0, -12, 0]} y={[0, 14, 0]} delay={2.2} duration={28}
				className="top-[28%] right-[1%] hidden lg:block" />

			<FloatingFood emoji="🥗" size={40} x={[0, 10, 0]} y={[0, 18, 0]} delay={1.7} duration={24}
				className="top-[14%] right-[28%] hidden xl:block" />

			<FloatingFood emoji="🧆" size={38} x={[0, 6, 0]} y={[0, -10, 0]} delay={0.3} duration={19}
				className="bottom-[22%] right-[30%] hidden md:block" />

			{/* ── DOT GRID ─────────────────────────────────── */}
			<div
				className="absolute inset-0 opacity-[0.06] dark:opacity-[0.10]"
				style={{
					backgroundImage: "radial-gradient(circle, #059669 1px, transparent 1px)",
					backgroundSize: "42px 42px",
				}}
			/>

			{/* ── BOTTOM FADE ──────────────────────────────── */}
			<div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-gray-950 dark:via-gray-950/50 dark:to-transparent" />
		</div>
	);
}