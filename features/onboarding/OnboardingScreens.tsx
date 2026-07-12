"use client";

import {
	memo,
	useCallback,
	useState,
	type CSSProperties,
	type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage, type AppLocale } from "@/features/language/useLanguage";

// ── Stage geometry ────────────────────────────────────────────────────────────

const STAGE_W = 306;
const STAGE_H = 390;

const RING_SIZE = 87;
const RING_STROKE = 4.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const INNER_BTN = 63;

// ── Step content (bilingual, inline) ─────────────────────────────────────────

type StepContent = { title: string; description?: string };
type Step = { id: string; ar: StepContent; en: StepContent };

const LANGUAGE_STEP: Step = {
	id: "language",
	ar: { title: "اختر لغتك" },
	en: { title: "Choose Your Language" },
};

const CONTENT_STEPS: readonly Step[] = [
	{
		id: "shopping",
		ar: {
			title: "كل احتياجاتك في تطبيق واحد",
			description: "تسوّق واطلب خدماتك اليومية من مكان واحد",
		},
		en: {
			title: "All your needs in one app",
			description: "Shop and order your daily services from one place",
		},
	},
	{
		id: "discount",
		ar: {
			title: "وفّر أكثر مع شِلّة وسجل في قيدها",
			description: "استمتع بالخصومات مع امكانية السداد شهريآ\nمن راتبك",
		},
		en: {
			title: "Save more with Shella & Qidha",
			description: "Enjoy discounts with the option to pay monthly\nfrom your salary",
		},
	},
	{
		id: "fast",
		ar: {
			title: "تجربة أسرع",
			description: "اطلب، احجز، وتابع كل شيء بسهولة.",
		},
		en: {
			title: "A Faster Experience",
			description: "Order, book, and track everything easily.",
		},
	},
];

const STEPS = [LANGUAGE_STEP, ...CONTENT_STEPS] as const;
const CONTENT_COUNT = CONTENT_STEPS.length;
const LAST_STEP = STEPS.length - 1;

type StepId = (typeof STEPS)[number]["id"];

// ── Language options ──────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS: { code: AppLocale; label: string }[] = [
	{ code: "ar", label: "العربية" },
	{ code: "en", label: "English (US)" },
];

// ── Discount badges (static, language-independent) ───────────────────────────

const DISCOUNT_BADGES = [
	{
		id: "b50",
		value: 50,
		top: 14,
		left: 113,
		size: 72,
		fontSize: 42,
		className: "bg-[#EBFEEB] text-[#237D2D] dark:bg-[#1A3D22] dark:text-[#4DB860]",
	},
	{
		id: "b20",
		value: 20,
		top: 96,
		left: 4,
		size: 60,
		fontSize: 30,
		className: "bg-[#47AF57] text-[#EBFEEB] dark:bg-[#30913F]",
	},
	{
		id: "b30",
		value: 30,
		top: 82,
		left: 218,
		size: 60,
		fontSize: 25,
		className: "bg-[#47AF57] text-[#EBFEEB] dark:bg-[#30913F]",
	},
] as const;

// ── Animation variants ────────────────────────────────────────────────────────

const slideVariants = {
	enter: { x: "-100%", opacity: 0 },
	center: { x: 0, opacity: 1 },
	exit: { x: "100%", opacity: 0 },
};

// ── Shared motion primitives ──────────────────────────────────────────────────

function BlurredGradientBackground() {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-x-0 top-0 h-[min(55vh,480px)] overflow-hidden opacity-70 dark:opacity-40"
		>
			<motion.div
				className="absolute rounded-full"
				style={{ left: "5%", top: "-10%", width: "55%", height: "55%", background: "#45A6FF", filter: "blur(100px)" }}
				animate={{ rotate: [0, 6, 0] }}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute rounded-full"
				style={{ right: "0%", top: "30%", width: "45%", height: "45%", background: "#3AEAAB", filter: "blur(100px)" }}
				animate={{ rotate: [0, -4, 0] }}
				transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute rounded-full"
				style={{ left: "20%", bottom: "0%", width: "50%", height: "40%", background: "#F0C043", filter: "blur(100px)" }}
				animate={{ rotate: [0, 5, 0] }}
				transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute rounded-full"
				style={{ left: "0%", top: "35%", width: "40%", height: "40%", background: "#B04AFF", filter: "blur(100px)" }}
				animate={{ rotate: [0, -6, 0] }}
				transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white dark:via-gray-900/40 dark:to-gray-900" />
		</div>
	);
}

function Entrance({
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
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay, ease: "easeOut" }}
		>
			{children}
		</motion.div>
	);
}

function TextEntrance({
	children,
	delay = 0,
	className = "",
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
}) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay, ease: "easeOut" }}
		>
			{children}
		</motion.div>
	);
}

function Stage({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto w-full" style={{ maxWidth: STAGE_W }}>
			<div className="relative mx-auto" style={{ width: STAGE_W, height: STAGE_H, maxWidth: "100%" }}>
				{children}
			</div>
			<div
				aria-hidden
				className="mx-auto border-t-[0.81px] border-[#213134] dark:border-gray-600"
				style={{ width: STAGE_W, maxWidth: "100%" }}
			/>
		</div>
	);
}

// ── Illustrations ─────────────────────────────────────────────────────────────

function ShoppingIllustration({ isArabic }: { isArabic: boolean }) {
	return (
		<Stage>
			<Entrance className="absolute inset-x-0 bottom-0 flex justify-center">
				<Image
					src="/onboarding/bag.png"
					alt={isArabic ? "حقيبة تسوق" : "Shopping bag"}
					width={240}
					height={240}
					className="h-auto w-[min(240px,70vw)] object-contain"
					priority
				/>
			</Entrance>
		</Stage>
	);
}

function DiscountIllustration({ isArabic }: { isArabic: boolean }) {
	return (
		<Stage>
			<Entrance className="absolute inset-x-0 bottom-0 flex justify-center">
				<Image
					src="/onboarding/discount.png"
					alt={isArabic ? "خصومات حصرية" : "Exclusive discounts"}
					width={240}
					height={240}
					className="h-auto w-[min(240px,70vw)] object-contain"
				/>
			</Entrance>
			<div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
				{DISCOUNT_BADGES.map((b, i) => (
					<motion.div
						key={b.id}
						className={`absolute flex items-center justify-center rounded-full font-bold ${b.className}`}
						style={{ top: b.top, left: b.left, width: b.size, height: b.size, fontSize: b.fontSize }}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: [0, -6, 0] }}
						transition={{
							opacity: { duration: 0.6, delay: 0.3 + i * 0.1 },
							y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 + i * 0.2 },
						}}
					>
						{b.value}
					</motion.div>
				))}
			</div>
		</Stage>
	);
}

function FastIllustration({ isArabic }: { isArabic: boolean }) {
	return (
		<Stage>
			<Entrance className="absolute inset-x-0 top-8 flex justify-center">
				<Image
					src="/onboarding/clock.png"
					alt={isArabic ? "ساعة" : "Clock"}
					width={230}
					height={230}
					className="h-auto w-[min(230px,65vw)] object-contain"
				/>
			</Entrance>
			<Entrance delay={0.1} className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
				<Image
					src="/onboarding/boxes.png"
					alt={isArabic ? "طرود" : "Packages"}
					width={218}
					height={125}
					className="h-auto w-[min(218px,60vw)] object-contain"
				/>
			</Entrance>
		</Stage>
	);
}

function LanguageIllustration({ isArabic }: { isArabic: boolean }) {
	return (
		<Stage>
			<Entrance className="absolute inset-x-0 bottom-0 flex justify-center">
				<div className="relative">
					<Image
						src="/onboarding/world.png"
						alt={isArabic ? "اختر لغتك" : "Choose your language"}
						width={260}
						height={260}
						className="h-auto w-[min(260px,72vw)] object-contain"
						priority
					/>
					<motion.span
						className="absolute text-[28px] font-bold leading-none text-[#30913F] sm:text-[32px]"
						style={{ right: "17%", top: "10.5%", rotate: "12.78deg" }}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						aria-hidden
					>
						ض
					</motion.span>
					<motion.span
						className="absolute text-[28px] font-bold leading-none text-[#30913F] sm:text-[32px]"
						style={{ left: "13%", bottom: "51%", rotate: "-26.13deg" }}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						aria-hidden
					>
						A
					</motion.span>
				</div>
			</Entrance>
		</Stage>
	);
}

function StepIllustration({ stepId, isArabic }: { stepId: StepId; isArabic: boolean }) {
	switch (stepId) {
		case "shopping": return <ShoppingIllustration isArabic={isArabic} />;
		case "discount": return <DiscountIllustration isArabic={isArabic} />;
		case "fast":     return <FastIllustration isArabic={isArabic} />;
		case "language": return <LanguageIllustration isArabic={isArabic} />;
	}
}

// ── Language selector ─────────────────────────────────────────────────────────

function LanguageSelector({
	value,
	onChange,
	isArabic,
}: {
	value: AppLocale;
	onChange: (code: AppLocale) => void;
	isArabic: boolean;
}) {
	return (
		<div
			className="mx-auto mt-4 w-full max-w-[343px]"
			role="radiogroup"
			aria-label={isArabic ? "اختر لغتك" : "Choose your language"}
		>
			{LANGUAGE_OPTIONS.map((opt, idx) => {
				const selected = value === opt.code;
				return (
					<button
						key={opt.code}
						type="button"
						role="radio"
						aria-checked={selected}
						onClick={() => onChange(opt.code)}
						className={`flex w-full items-center justify-between py-4 ${idx === 0 ? "border-b border-[#F6F5F8] dark:border-gray-700" : ""}`}
					>
						<span className="text-right text-[14px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100">
							{opt.label}
						</span>
						<span
							className={[
								"relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
								selected ? "bg-[#111B18] dark:bg-gray-100" : "bg-[#D1D5DB] dark:bg-gray-600",
							].join(" ")}
						>
							<motion.span
								className="h-2.5 w-2.5 rounded-full bg-white dark:bg-gray-900"
								initial={false}
								animate={{ scale: selected ? 1 : 0 }}
								transition={{ duration: 0.2 }}
							/>
						</span>
					</button>
				);
			})}
		</div>
	);
}

// ── Progress ring button ──────────────────────────────────────────────────────

function ProgressRingButton({
	progress,
	onClick,
	isArabic,
}: {
	progress: number;
	onClick: () => void;
	isArabic: boolean;
}) {
	const offset = RING_CIRCUMFERENCE - progress * RING_CIRCUMFERENCE;

	return (
		<motion.button
			type="button"
			onClick={onClick}
			className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
			style={{ width: RING_SIZE, height: RING_SIZE }}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{ duration: 0.2 }}
			aria-label={isArabic ? "التالي" : "Next"}
		>
			<svg
				width={RING_SIZE}
				height={RING_SIZE}
				viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
				className="absolute inset-0 -rotate-90"
				aria-hidden
			>
				<circle
					cx={RING_SIZE / 2}
					cy={RING_SIZE / 2}
					r={RING_RADIUS}
					fill="none"
					className="stroke-[#F8F8F8] dark:stroke-gray-700"
					strokeWidth={RING_STROKE}
				/>
				<motion.circle
					cx={RING_SIZE / 2}
					cy={RING_SIZE / 2}
					r={RING_RADIUS}
					fill="none"
					stroke="#30913F"
					strokeWidth={RING_STROKE}
					strokeLinecap="round"
					strokeDasharray={RING_CIRCUMFERENCE}
					animate={{ strokeDashoffset: offset }}
					transition={{ duration: 0.4, ease: "easeOut" }}
				/>
			</svg>
			<div
				className="relative flex items-center justify-center rounded-full bg-[#30913F]"
				style={{ width: INNER_BTN, height: INNER_BTN }}
			>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
					<path
						d="M5 2.5L10 7L5 11.5"
						stroke="#FEFEFE"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		</motion.button>
	);
}

// ── Root component ────────────────────────────────────────────────────────────

const OnboardingScreens = memo(function OnboardingScreens() {
	const [step, setStep] = useState(0);
	const router = useRouter();
	const { locale, isArabic, setLanguage } = useLanguage();

	const current = STEPS[step];
	const isLanguageStep = current.id === "language";
	const isLast = step === LAST_STEP;
	const progress = isLanguageStep ? 0 : step / CONTENT_COUNT;

	// Content switches instantly as language changes
	const content = isArabic ? current.ar : current.en;

	const finish = useCallback(() => {
		router.replace("/auth");
	}, [router]);

	const handleNext = useCallback(() => {
		if (isLast) {
			finish();
			return;
		}
		setStep((prev) => prev + 1);
	}, [finish, isLast]);

	return (
		<div
			className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white dark:bg-gray-900"
			dir={isArabic ? "rtl" : "ltr"}
			lang={locale}
		>
			<BlurredGradientBackground />

			{!isLanguageStep && (
				<motion.button
					type="button"
					onClick={finish}
					className="absolute top-6 z-20 rounded-full border border-[#F6F5F8] bg-white/25 px-6 py-2.5 text-[14px] font-medium text-[#2D2F35] backdrop-blur-sm start-6 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-200"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.15 }}
					aria-label={isArabic ? "تخطي" : "Skip"}
				>
					{isArabic ? "تخطي" : "Skip"}
				</motion.button>
			)}

			<div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-6 pb-8 pt-16 sm:px-8 sm:pt-20">
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={current.id}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ duration: 0.4, ease: "easeOut" }}
						className="flex flex-1 flex-col"
					>
						<div className="w-full">
							<StepIllustration stepId={current.id} isArabic={isArabic} />
						</div>

						<TextEntrance
							delay={0.2}
							className="mx-auto mt-6 flex max-w-[300px] flex-col items-center gap-2 text-center sm:mt-8"
						>
							<h1 className="w-full text-[20px] font-bold leading-6 text-black dark:text-gray-50 sm:text-[22px]">
								{content.title}
							</h1>
							{content.description ? (
								<p className="w-full whitespace-pre-line text-[15px] font-medium leading-[18px] text-black dark:text-gray-300">
									{content.description}
								</p>
							) : null}
						</TextEntrance>

						{isLanguageStep ? (
							<LanguageSelector
								value={locale}
								onChange={setLanguage}
								isArabic={isArabic}
							/>
						) : null}
					</motion.div>
				</AnimatePresence>

				<div className="mt-auto flex flex-col items-center pt-8 sm:pt-10">
					{isLanguageStep ? (
						<motion.button
							type="button"
							onClick={handleNext}
							className="w-full max-w-[343px] rounded-xl bg-[#30913F] py-3 text-[16px] font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							transition={{ duration: 0.2 }}
						>
							{isArabic ? "التالي" : "Next"}
						</motion.button>
					) : (
						<ProgressRingButton
							progress={progress}
							onClick={handleNext}
							isArabic={isArabic}
						/>
					)}
				</div>
			</div>
		</div>
	);
});

export default OnboardingScreens;
