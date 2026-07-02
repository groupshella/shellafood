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
	UtensilsCrossed,
	type LucideIcon,
} from "lucide-react";
import { Tajawal } from "next/font/google";
import { useRouter } from "next/navigation";

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
	{
		id: "language",
		title: "اختر لغتك",
		description: "",
	},
] as const;

type StepId = (typeof STEPS)[number]["id"];

type LanguageCode = "ar" | "en";

const LANGUAGE_OPTIONS: { code: LanguageCode; label: string }[] = [
	{ code: "ar", label: "العربية" },
	{ code: "en", label: "English (US)" },
];

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
const DISCOUNT_BADGES: {
	id: string;
	value: number;
	top: number;
	left: number;
	size: number;
	reversed?: boolean;
}[] = [
		{ id: "b50", value: 50, top: 14, left: 113, size: 72, reversed: true },
		{ id: "b20", value: 20, top: 96, left: 4, size: 60 },
		{ id: "b30", value: 30, top: 82, left: 218, size: 60 },
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

// ─── Full-page background (gradient + blur) ───────────────────────────────────
function OnboardingPageBackground() {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			{/* Base: white fade from mid-screen down */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white" />

			{/* Color mesh – top half of screen */}
			<div
				className="absolute inset-0"
				style={{
					background: `
						radial-gradient(ellipse 80% 60% at 8% 0%,   rgba(147,197,253,0.75) 0%, transparent 70%),
						radial-gradient(ellipse 70% 55% at 92% 0%,  rgba(216,180,254,0.65) 0%, transparent 70%),
						radial-gradient(ellipse 75% 58% at 50% 18%, rgba(134,239,172,0.50) 0%, transparent 72%),
						radial-gradient(ellipse 60% 45% at 20% 55%, rgba(254,215,170,0.35) 0%, transparent 70%)
					`,
				}}
			/>

			{/* Soft blur washes */}
			<div
				className="absolute -left-16 top-0 h-80 w-80 opacity-70"
				style={{
					background:
						"linear-gradient(145deg, rgba(147,197,253,0.65) 0%, rgba(186,230,253,0.2) 55%, transparent 100%)",
					filter: "blur(72px)",
				}}
			/>
			<div
				className="absolute -right-12 top-4 h-72 w-72 opacity-65"
				style={{
					background:
						"linear-gradient(215deg, rgba(216,180,254,0.60) 0%, rgba(233,213,255,0.15) 55%, transparent 100%)",
					filter: "blur(68px)",
				}}
			/>
			<div
				className="absolute left-1/4 top-24 h-64 w-96 opacity-55"
				style={{
					background:
						"linear-gradient(180deg, rgba(134,239,172,0.45) 0%, rgba(187,247,208,0.12) 60%, transparent 100%)",
					filter: "blur(80px)",
				}}
			/>
		</div>
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
					const percentSize = Math.round(b.size * 0.22);
					const valueSize = Math.round(b.size * 0.32);

					return (
						<FadeIn
							key={b.id}
							delay={0.3 + i * 0.1}
							className={`absolute flex flex-col items-center justify-center gap-0.5 rounded-full shadow-lg ${b.reversed ? "bg-white" : "bg-[#47AF57]"
								}`}
							style={{ width: b.size, height: b.size, top: b.top, left: b.left }}
						>
							<span
								className={`font-bold leading-none ${b.reversed ? "text-[#47AF57]" : "text-white"}`}
								style={{ fontSize: percentSize }}
							>
								%
							</span>
							<span
								className={`font-bold leading-none ${b.reversed ? "text-[#47AF57]" : "text-white"}`}
								style={{ fontSize: valueSize }}
							>
								{b.value}
							</span>
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

// ─── Page 4: Language ─────────────────────────────────────────────────────────
function LanguageIllustration() {
	return (
		<Stage>
			{/* Globe: bottom-anchored, centered */}
			<FadeIn className="absolute inset-x-0 bottom-0 flex justify-center">
				<Image
					src="/onboarding/world.png"
					alt="اختر لغتك"
					width={260}
					height={260}
					className="h-auto w-[260px] object-contain"
					priority
				/>
			</FadeIn>
		</Stage>
	);
}

// ─── Language picker (radio list) ─────────────────────────────────────────────
function LanguageSelector({
	value,
	onChange,
}: {
	value: LanguageCode;
	onChange: (code: LanguageCode) => void;
}) {
	return (
		<div
			className="mx-auto mt-2 w-full divide-y divide-gray-100 border-y border-gray-100"
			style={{ width: 274 }}
			role="radiogroup"
			aria-label="اختر لغتك"
		>
			{LANGUAGE_OPTIONS.map((opt) => {
				const selected = value === opt.code;
				return (
					<button
						key={opt.code}
						type="button"
						role="radio"
						aria-checked={selected}
						onClick={() => onChange(opt.code)}
						className="flex w-full items-center justify-between py-4"
					>
						<span className="text-[15px] font-bold text-gray-900">
							{opt.label}
						</span>
						<span
							className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${selected ? "border-gray-900" : "border-gray-300"
								}`}
						>
							{selected && (
								<span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
							)}
						</span>
					</button>
				);
			})}
		</div>
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
		case "language":
			return <LanguageIllustration />;
	}
}

// ─── Main component ───────────────────────────────────────────────────────────
const OnboardingScreens = memo(function OnboardingScreens() {
	const [step, setStep] = useState(0);
	const [language, setLanguage] = useState<LanguageCode>("ar");
	const isLast = step === STEPS.length - 1;
	const current = STEPS[step];
	const router = useRouter();
	const progressOffset = useMemo(
		() => CIRCUMFERENCE - ((step + 1) / STEPS.length) * CIRCUMFERENCE,
		[step],
	);

	const handleAction = useCallback(() => {
		if (isLast) {
			// `language` holds the user's selected locale (ar | en) if you need
			// to persist it (e.g. cookie, API call) before navigating.
			router.replace("/auth");
		} else {
			setStep((prev) => prev + 1);
		}
	}, [isLast, language]);

	return (
		<div
			className={`${tajawal.className} relative flex min-h-dvh w-full flex-col overflow-hidden pb-10 pt-16`}
			dir="rtl"
			lang="ar"
		>
			<OnboardingPageBackground />

			{/* Skip – top RIGHT (visual right on any RTL/LTR screen) */}
			{!isLast && (
				<motion.button
					type="button"
					onClick={() => router.replace("/auth")}
					className="absolute top-6 right-6 z-20 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-sm font-medium text-gray-600 shadow-sm backdrop-blur-md"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.15 }}
					aria-label="تخطي"
				>
					تخطي
				</motion.button>
			)}

			<div className="relative z-10 mx-auto flex w-full max-w-[390px] flex-1 flex-col px-6">
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
							{current.description && (
								<p className="w-full text-[15px] font-medium leading-[130%] text-gray-500">
									{current.description}
								</p>
							)}
						</div>

						{/* Language radio list – only on the language step */}
						{current.id === "language" && (
							<LanguageSelector value={language} onChange={setLanguage} />
						)}
					</motion.div>
				</AnimatePresence>

				{/* Progress button + dots, OR full-width action button on the language step */}
				<div className="mt-auto flex flex-col items-center pt-8">
					{current.id === "language" ? (
						<motion.button
							type="button"
							onClick={handleAction}
							className="w-full rounded-full bg-[#30913F] py-4 text-base font-bold text-white shadow-lg shadow-[#30913F]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
							whileTap={{ scale: 0.98 }}
						>
							التالي
						</motion.button>
					) : (
						<>
							<motion.button
								type="button"
								onClick={handleAction}
								className="relative flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
								style={{ width: BTN_SIZE, height: BTN_SIZE }}
								whileTap={{ scale: 0.95 }}
								aria-label="التالي"
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
									<ChevronRight className="h-5 w-5" strokeWidth={2.5} />
								</div>
							</motion.button>

							{/* Step dots */}
							<div className="mt-5 flex justify-center gap-2" aria-hidden>
								{STEPS.map((s, idx) => (
									<div
										key={s.id}
										className={`h-1.5 rounded-full transition-all duration-300 ${idx === step ? "w-6 bg-[#30913F]" : "w-1.5 bg-gray-300"
											}`}
									/>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
});

export default OnboardingScreens;