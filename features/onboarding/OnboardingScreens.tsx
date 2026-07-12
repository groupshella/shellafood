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

const STAGE_W = 306;
const STAGE_H = 390;

const RING_SIZE = 87;
const RING_STROKE = 4.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const INNER_BTN = 63;

const LANGUAGE_STEP = {
	id: "language",
	title: "اختر لغتك",
	description: "",
} as const;

const CONTENT_STEPS = [
	{
		id: "shopping",
		title: "كل احتياجاتك في تطبيق واحد",
		description: "تسوّق واطلب خدماتك اليومية من مكان واحد",
	},
	{
		id: "discount",
		title: "وفّر أكثر مع شِلّة وسجل في قيدها",
		description: "استمتع بالخصومات مع امكانية السداد شهريآ\nمن راتبك",
	},
	{
		id: "fast",
		title: "تجربة أسرع",
		description: "اطلب، احجز، وتابع كل شيء بسهولة.",
	},
] as const;

const STEPS = [LANGUAGE_STEP, ...CONTENT_STEPS] as const;
const CONTENT_COUNT = CONTENT_STEPS.length;
const LAST_STEP = STEPS.length - 1;

type StepId = (typeof STEPS)[number]["id"];
type LanguageCode = "ar" | "en";

const LANGUAGE_OPTIONS: { code: LanguageCode; label: string }[] = [
	{ code: "ar", label: "العربية" },
	{ code: "en", label: "English (US)" },
];

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

const slideVariants = {
	enter: { x: "-100%", opacity: 0 },
	center: { x: 0, opacity: 1 },
	exit: { x: "100%", opacity: 0 },
};

function BlurredGradientBackground() {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-x-0 top-0 h-[min(55vh,480px)] overflow-hidden opacity-70 dark:opacity-40"
		>
			<motion.div
				className="absolute rounded-full"
				style={{
					left: "5%",
					top: "-10%",
					width: "55%",
					height: "55%",
					background: "#45A6FF",
					filter: "blur(100px)",
				}}
				animate={{ rotate: [0, 6, 0] }}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute rounded-full"
				style={{
					right: "0%",
					top: "30%",
					width: "45%",
					height: "45%",
					background: "#3AEAAB",
					filter: "blur(100px)",
				}}
				animate={{ rotate: [0, -4, 0] }}
				transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute rounded-full"
				style={{
					left: "20%",
					bottom: "0%",
					width: "50%",
					height: "40%",
					background: "#F0C043",
					filter: "blur(100px)",
				}}
				animate={{ rotate: [0, 5, 0] }}
				transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute rounded-full"
				style={{
					left: "0%",
					top: "35%",
					width: "40%",
					height: "40%",
					background: "#B04AFF",
					filter: "blur(100px)",
				}}
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
			<div
				className="relative mx-auto"
				style={{ width: STAGE_W, height: STAGE_H, maxWidth: "100%" }}
			>
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

function ShoppingIllustration() {
	return (
		<Stage>
			<Entrance className="absolute inset-x-0 bottom-0 flex justify-center">
				<Image
					src="/onboarding/bag.png"
					alt="حقيبة تسوق"
					width={240}
					height={240}
					className="h-auto w-[min(240px,70vw)] object-contain"
					priority
				/>
			</Entrance>
		</Stage>
	);
}

function DiscountIllustration() {
	return (
		<Stage>
			<Entrance className="absolute inset-x-0 bottom-0 flex justify-center">
				<Image
					src="/onboarding/discount.png"
					alt="خصومات حصرية"
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
						style={{
							top: b.top,
							left: b.left,
							width: b.size,
							height: b.size,
							fontSize: b.fontSize,
						}}
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

function FastIllustration() {
	return (
		<Stage>
			<Entrance className="absolute inset-x-0 top-8 flex justify-center">
				<Image
					src="/onboarding/clock.png"
					alt="ساعة"
					width={230}
					height={230}
					className="h-auto w-[min(230px,65vw)] object-contain"
				/>
			</Entrance>
			<Entrance delay={0.1} className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
				<Image
					src="/onboarding/boxes.png"
					alt="طرود"
					width={218}
					height={125}
					className="h-auto w-[min(218px,60vw)] object-contain"
				/>
			</Entrance>
		</Stage>
	);
}

function LanguageIllustration() {
	return (
		<Stage>
			<Entrance className="absolute inset-x-0 bottom-0 flex justify-center">
				<div className="relative">
					<Image
						src="/onboarding/world.png"
						alt="اختر لغتك"
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

function LanguageSelector({
	value,
	onChange,
}: {
	value: LanguageCode;
	onChange: (code: LanguageCode) => void;
}) {
	return (
		<div
			className="mx-auto mt-4 w-full max-w-[343px]"
			role="radiogroup"
			aria-label="اختر لغتك"
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
								selected
									? "bg-[#111B18] dark:bg-gray-100"
									: "bg-[#D1D5DB] dark:bg-gray-600",
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

function ProgressRingButton({
	progress,
	onClick,
}: {
	progress: number;
	onClick: () => void;
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
			aria-label="التالي"
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

const OnboardingScreens = memo(function OnboardingScreens() {
	const [step, setStep] = useState(0);
	const [language, setLanguage] = useState<LanguageCode>("ar");
	const router = useRouter();

	const current = STEPS[step];
	const isLanguageStep = current.id === "language";
	const isLast = step === LAST_STEP;
	const progress = isLanguageStep ? 0 : step / CONTENT_COUNT;

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
			dir="rtl"
			lang="ar"
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
					aria-label="تخطي"
				>
					تخطي
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
							<StepIllustration stepId={current.id} />
						</div>

						<TextEntrance
							delay={0.2}
							className="mx-auto mt-6 flex max-w-[300px] flex-col items-center gap-2 text-center sm:mt-8"
						>
							<h1 className="w-full text-[20px] font-bold leading-6 text-black dark:text-gray-50 sm:text-[22px]">
								{current.title}
							</h1>
							{current.description ? (
								<p className="w-full whitespace-pre-line text-[15px] font-medium leading-[18px] text-black dark:text-gray-300">
									{current.description}
								</p>
							) : null}
						</TextEntrance>

						{isLanguageStep ? (
							<LanguageSelector value={language} onChange={setLanguage} />
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
							التالي
						</motion.button>
					) : (
						<ProgressRingButton progress={progress} onClick={handleNext} />
					)}
				</div>
			</div>
		</div>
	);
});

export default OnboardingScreens;
