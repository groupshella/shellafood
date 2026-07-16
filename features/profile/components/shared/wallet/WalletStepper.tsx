import { Check, Clock, FileText, ShieldCheck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

export type WalletStep = "personal-info" | "income" | "contract" | "pending";
type StepState = "upcoming" | "current" | "completed";

interface StepDef {
	label: { ar: string; en: string };
	Icon: LucideIcon;
}

const FORM_STEPS: StepDef[] = [
	{ label: { ar: "المعلومات الشخصية", en: "Personal info" }, Icon: FileText },
	{ label: { ar: "الدخل", en: "Income" }, Icon: Wallet },
	{
		label: { ar: "تاكيد ومراجعة العقد", en: "Confirm & review contract" },
		Icon: ShieldCheck,
	},
];

const PENDING_STEPS: StepDef[] = [
	{ label: { ar: "تم استلام الطلب", en: "Request received" }, Icon: Check },
	{ label: { ar: "قيد المراجعة", en: "Under review" }, Icon: Clock },
	{ label: { ar: "تفعيل المحفظة", en: "Wallet activation" }, Icon: Wallet },
];

const FORM_STEP_ORDER: WalletStep[] = ["personal-info", "income", "contract"];

function getFormStepState(index: number, currentStep: WalletStep): StepState {
	const currentIndex = FORM_STEP_ORDER.indexOf(currentStep);
	if (currentIndex === -1) return "completed";
	if (index < currentIndex) return "completed";
	if (index === currentIndex) return "current";
	return "upcoming";
}

interface StepCircleProps {
	state: StepState;
	Icon: LucideIcon;
	size: "lg" | "sm";
}

function StepCircle({ state, Icon, size }: StepCircleProps) {
	const dim = size === "lg" ? "h-12 w-12" : "h-9 w-9";
	const containerDim = size === "lg" ? 69 : 52;
	const iconDim = size === "lg" ? "h-5 w-5" : "h-4 w-4";

	const circleCls =
		state === "completed"
			? "bg-brand text-brand-foreground"
			: state === "current"
				? "border-[2.13px] border-brand bg-brand/10 text-brand"
				: "border-[2.13px] border-border bg-card text-muted";

	return (
		<div
			className="relative flex items-center justify-center"
			style={{ width: containerDim, height: containerDim }}
		>
			{state === "current" && (
				<div
					className="absolute inset-0 rounded-full bg-brand/15"
					aria-hidden
				/>
			)}
			<div
				className={`relative z-10 flex items-center justify-center rounded-full ${dim} ${circleCls}`}
			>
				{state === "completed" ? (
					<Check className={iconDim} strokeWidth={2.5} />
				) : (
					<Icon className={iconDim} strokeWidth={1.75} />
				)}
			</div>
		</div>
	);
}

interface WalletStepperProps {
	currentStep: WalletStep;
	variant: "form" | "pending";
	isArabic?: boolean;
}

export function WalletStepper({
	currentStep,
	variant,
	isArabic = true,
}: WalletStepperProps) {
	const steps = variant === "pending" ? PENDING_STEPS : FORM_STEPS;
	const size = variant === "pending" ? "sm" : "lg";
	const lineMarginTop = variant === "pending" ? "mt-[26px]" : "mt-[34px]";

	const getState = (index: number): StepState => {
		if (variant === "pending") {
			const pendingStates: StepState[] = ["completed", "current", "upcoming"];
			return pendingStates[index] ?? "upcoming";
		}
		return getFormStepState(index, currentStep);
	};

	const maxLabelWidth =
		variant === "pending"
			? "max-w-[72px] sm:max-w-[88px]"
			: "max-w-[84px] sm:max-w-[100px] md:max-w-[120px]";

	return (
		<div className="flex w-full items-start">
			{steps.map((step, index) => {
				const state = getState(index);
				const label = isArabic ? step.label.ar : step.label.en;
				const labelCls =
					state === "upcoming" ? "text-muted" : "text-brand";
				return (
					<React.Fragment key={step.label.en}>
						<div className="flex flex-col items-center gap-1.5">
							<StepCircle state={state} Icon={step.Icon} size={size} />
							<span
								className={`${maxLabelWidth} text-center text-[12px] font-bold leading-[1.4] ${labelCls}`}
							>
								{label}
							</span>
						</div>
						{index < steps.length - 1 && (
							<div
								className={`${lineMarginTop} h-[3px] flex-1 self-start bg-border`}
							/>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
}
