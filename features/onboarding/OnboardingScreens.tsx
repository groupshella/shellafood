"use client";

import {
	memo,
	useCallback,
	useMemo,
	useState,
	type CSSProperties,
	type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
	Check,
	ChevronRight,
	Pill,
	Salad,
	Settings2,
	UtensilsCrossed,
	type LucideIcon,
} from "lucide-react";
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["500", "700"] });

// ─── Layout constants ─────────────────────────────────────────────────────────
const STAGE_W = 306;
const STAGE_H = 390;
const BTN_SIZE = 63;
const BTN_INNER = 48;
const BTN_RADIUS = 26;
const BTN_STROKE = 3;
const CIRCUMFERENCE = 2 * Math.PI * BTN_RADIUS;

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
	{
		id: "shopping",
		title: "كل احتياجاتك في تطبيق واحد",
		description: "تسوّق واطلب خدماتك اليومية من مكان واحد",
	},
	{
		id: "discount",
		title: "وفّر أكثر مع شِلّة وسجل في قيدها",
		description: "استمتع بالخصومات مع إمكانية السداد شهرياً من راتبك",
	},
	{
		id: "fast",
		title: "تجربة أسرع",
		description: "اطلب، احجز، وتابع كل شيء بسهولة.",
	},
] as const;

type StepId = (typeof STEPS)[number]["id"];

// ─── Shopping circles ─────────────────────────────────────────────────────────
// Positions are within the 306×390 stage coordinate system.
// Bag is 240px wide, bottom-anchored → bag top ≈ y=150, handles top ≈ y=165.
// Circles float above and around the bag.
const SHOPPING_CIRCLES: {
	id: string;
	top: number;
	left: number;
	size: number;
	bg: string;
	Icon: LucideIcon;
	iconClass: string;
}[] = [
	// Medicine – white, top center, above bag handles
	{ id: "medicine", top: 52, left: 118, size: 70, bg: "#FFFFFF", Icon: Pill, iconClass: "text-[#47AF57]" },
	// Burger – green, left side
	{ id: "burger", top: 170, left: 6, size: 58, bg: "#47AF57", Icon: UtensilsCrossed, iconClass: "text-white" },
	// Salad – green, right side, slightly higher than burger
	{ id: "salad", top: 142, left: 214, size: 62, bg: "#47AF57", Icon: Salad, iconClass: "text-white" },
];

// ─── Discount badges ──────────────────────────────────────────────────────────
// Discount image is 240px wide, bottom-anchored → image top ≈ y=170.
// Badges float above the image.
const DISCOUNT_BADGES: { id: string; value: number; top: number; left: number; size: number }[] = [
	{ id: "b50", value: 50, top: 14, left: 113, size: 72 },   // largest, top center
	{ id: "b20", value: 20, top: 96, left: 4, size: 60 },     // left
	{ id: "b30", value: 30, top: 82, left: 218, size: 60 },   // right
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FadeIn({
	children,
	delay = 0,
	className = "",
	style,
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<motion.div
			className={className}
			style={style}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.45, delay }}
		>
			{children}
		</motion.div>
	);
}

// ─── Shared stage background gradient ────────────────────────────────────────
function StageGradient() {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0"
			style={{
				background: `
					radial-gradient(ellipse 65% 55% at 12% 0%,  rgba(147,197,253,0.70) 0%, transparent 65%),
					radial-gradient(ellipse 55% 50% at 88% 2%,  rgba(216,180,254,0.60) 0%, transparent 65%),
					radial-gradient(ellipse 55% 52% at 50% 32%, rgba(134,239,172,0.42) 0%, transparent 65%)
				`,
			}}
		/>
	);
}

// ─── Illustration stage wrapper ───────────────────────────────────────────────
function Stage({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto w-full" style={{ maxWidth: STAGE_W }}>
			<div
				className="relative"
				style={{ width: STAGE_W, height: STAGE_H, overflow: "visible" }}
			>
				<StageGradient />
				{children}
			</div>
			{/* Figma divider: width 306, border 0.81px #213134 */}
			<div
				aria-hidden
				style={{
					width: STAGE_W,
					height: 0,
					borderTop: "0.81px solid #213134",
					opacity: 1,
				}}
			/>
		</div>
	);
}

// ─── Page 1: Shopping ─────────────────────────────────────────────────────────
function ShoppingIllustration() {
	return (
		<Stage>
			{/* Bag: bottom-anchored, centered */}
			<FadeIn className="absolute inset-x-0 bottom-0 flex justify-center">
				<div className="relative">
					<Image
						src="/onboarding/bag.png"
						alt="حقيبة تسوق"
						width={240}
						height={240}
						className="relative z-10 h-auto w-[240px] object-contain"
						priority
					/>
					{/* Shella logo centered on bag face */}
					<div
						className="pointer-events-none absolute z-20"
						style={{
							width: 111,
							height: 80,
							left: "50%",
							top: "57%",
							transform: "translate(-50%, -50%)",
						}}
					>
						<Image
							src="/favicon.ico"
							alt="شلة"
							width={111}
							height={80}
							className="h-[80px] w-[111px] object-contain"
							priority
						/>
					</div>
				</div>
			</FadeIn>

			{/* Icon circles – rendered above bag */}
			<div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
				{SHOPPING_CIRCLES.map((c, i) => {
					const { Icon } = c;
					const iconSize = Math.round(c.size * 0.42);
					return (
						<FadeIn
							key={c.id}
							delay={0.3 + i * 0.1}
							className="absolute flex items-center justify-center rounded-full shadow-lg"
							style={{
								width: c.size,
								height: c.size,
								top: c.top,
								left: c.left,
								backgroundColor: c.bg,
							}}
						>
							<Icon className={c.iconClass} size={iconSize} strokeWidth={2.2} />
						</FadeIn>
					);
				})}
			</div>
		</Stage>
	);
}

// ─── Page 2: Discount ─────────────────────────────────────────────────────────
function DiscountIllustration() {
	return (
		<Stage>
			{/* Discount image: bottom-anchored, centered */}
			<FadeIn className="absolute inset-x-0 bottom-0 flex justify-center">
				<Image
					src="/onboarding/discount.png"
					alt="خصومات حصرية"
					width={240}
					height={240}
					className="h-auto w-[240px] object-contain"
				/>
			</FadeIn>

			{/* Discount badges – rendered above image */}
			<div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
				{DISCOUNT_BADGES.map((b, i) => {
					const iconSize = Math.round(b.size * 0.26);
					return (
						<FadeIn
							key={b.id}
							delay={0.3 + i * 0.1}
							className="absolute flex flex-col items-center justify-center gap-0.5 rounded-full bg-[#47AF57] shadow-lg"
							style={{ width: b.size, height: b.size, top: b.top, left: b.left }}
						>
							<Settings2
								size={iconSize}
								className="text-white opacity-90"
								strokeWidth={2}
							/>
							<span
								className="font-bold leading-none text-white"
								style={{ fontSize: Math.round(b.size * 0.28) }}
							>
								{b.value}
							</span>
							<span className="text-[9px] font-semibold leading-none text-green-100">%</span>
						</FadeIn>
					);
				})}
			</div>
		</Stage>
	);
}

// ─── Page 3: Fast ─────────────────────────────────────────────────────────────
function FastIllustration() {
	return (
		<Stage>
			{/* Clock: centered, upper area */}
			<FadeIn className="absolute inset-x-0 top-8 flex justify-center">
				<Image
					src="/onboarding/clock.png"
					alt="ساعة"
					width={230}
					height={230}
					className="h-auto w-[230px] object-contain"
				/>
			</FadeIn>

			{/* Boxes: foreground, lower – z-index above clock */}
			<FadeIn
				delay={0.35}
				className="absolute inset-x-0 bottom-0 z-20 flex justify-center"
			>
				<Image
					src="/onboarding/boxes.png"
					alt="طرود"
					width={218}
					height={125}
					className="h-auto w-[218px] object-contain"
				/>
			</FadeIn>
		</Stage>
	);
}

// ─── Illustration router ──────────────────────────────────────────────────────
function StepIllustration({ stepId }: { stepId: StepId }) {
	switch (stepId) {
		case "shopping":
			return <ShoppingIllustration />;
		case "discount":
			return <DiscountIllustration />;
		case "fast":
			return <FastIllustration />;
	}
}

// ─── Main component ───────────────────────────────────────────────────────────
interface OnboardingScreensProps {
	onComplete: () => void;
	onSkip: () => void;
}

const OnboardingScreens = memo(function OnboardingScreens({
	onComplete,
	onSkip,
}: OnboardingScreensProps) {
	const [step, setStep] = useState(0);
	const isLast = step === STEPS.length - 1;
	const current = STEPS[step];

	const progressOffset = useMemo(
		() => CIRCUMFERENCE - ((step + 1) / STEPS.length) * CIRCUMFERENCE,
		[step],
	);

	const handleAction = useCallback(() => {
		if (isLast) {
			onComplete();
		} else {
			setStep((prev) => prev + 1);
		}
	}, [isLast, onComplete]);

	return (
		<div
			className={`${tajawal.className} relative flex min-h-dvh w-full flex-col bg-white pb-10 pt-16`}
			dir="rtl"
			lang="ar"
		>
			{/* Skip – top RIGHT (visual right on any RTL/LTR screen) */}
			{!isLast && (
				<motion.button
					type="button"
					onClick={onSkip}
					className="absolute top-6 right-6 z-20 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 shadow-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.15 }}
					aria-label="تخطي"
				>
					تخطي
				</motion.button>
			)}

			<div className="relative mx-auto flex w-full max-w-[390px] flex-1 flex-col px-6">
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={current.id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="flex flex-1 flex-col"
					>
						{/* Illustration */}
						<div className="w-full">
							<StepIllustration stepId={current.id} />
						</div>

						{/* Text block – 274px wide, 8px gap, immediately below divider */}
						<div
							className="mx-auto mt-6 flex flex-col items-center gap-2 text-center"
							style={{ width: 274 }}
						>
							<h1 className="w-full text-[20px] font-bold leading-[100%] text-gray-900">
								{current.title}
							</h1>
							<p className="w-full text-[15px] font-medium leading-[130%] text-gray-500">
								{current.description}
							</p>
						</div>
					</motion.div>
				</AnimatePresence>

				{/* Progress button + dots */}
				<div className="mt-auto flex flex-col items-center pt-8">
					<motion.button
						type="button"
						onClick={handleAction}
						className="relative flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
						style={{ width: BTN_SIZE, height: BTN_SIZE }}
						whileTap={{ scale: 0.95 }}
						aria-label={isLast ? "ابدأ" : "التالي"}
					>
						{/* Ring progress */}
						<svg
							width={BTN_SIZE}
							height={BTN_SIZE}
							viewBox={`0 0 ${BTN_SIZE} ${BTN_SIZE}`}
							className="absolute inset-0 -rotate-90"
						>
							<circle
								cx={BTN_SIZE / 2}
								cy={BTN_SIZE / 2}
								r={BTN_RADIUS}
								fill="none"
								stroke="#E5E7EB"
								strokeWidth={BTN_STROKE}
							/>
							<motion.circle
								cx={BTN_SIZE / 2}
								cy={BTN_SIZE / 2}
								r={BTN_RADIUS}
								fill="none"
								stroke="#30913F"
								strokeWidth={BTN_STROKE}
								strokeLinecap="round"
								strokeDasharray={CIRCUMFERENCE}
								animate={{ strokeDashoffset: progressOffset }}
								transition={{ duration: 0.5, ease: "easeInOut" }}
							/>
						</svg>
						{/* Inner circle */}
						<div
							className="flex items-center justify-center rounded-full bg-[#30913F] text-white shadow-lg shadow-[#30913F]/25"
							style={{ width: BTN_INNER, height: BTN_INNER }}
						>
							{isLast ? (
								<Check className="h-5 w-5" strokeWidth={2.5} />
							) : (
								<ChevronRight className="h-5 w-5" strokeWidth={2.5} />
							)}
						</div>
					</motion.button>

					{/* Step dots */}
					<div className="mt-5 flex justify-center gap-2" aria-hidden>
						{STEPS.map((s, idx) => (
							<div
								key={s.id}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									idx === step ? "w-6 bg-[#30913F]" : "w-1.5 bg-gray-300"
								}`}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
});

export default OnboardingScreens;
