import { Check, Clock, FileText, ShieldCheck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

export type WalletStep = "personal-info" | "income" | "contract" | "pending";
type StepState = "upcoming" | "current" | "completed";

interface StepDef {
    label: string;
    Icon: LucideIcon;
}

const FORM_STEPS: StepDef[] = [
    { label: "المعلومات الشخصية", Icon: FileText },
    { label: "الدخل", Icon: Wallet },
    { label: "تاكيد ومراجعة العقد", Icon: ShieldCheck },
];

const PENDING_STEPS: StepDef[] = [
    { label: "تم استلام الطلب", Icon: Check },
    { label: "قيد المراجعة", Icon: Clock },
    { label: "تفعيل المحفظة", Icon: Wallet },
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
            ? "bg-[#30913F]"
            : state === "current"
              ? "bg-[#E8F5EA] border-[2.13px] border-[#30913F] dark:bg-[#30913F]/15"
              : "bg-[#F0F4F0] border-[2.13px] border-[#E8ECEF] dark:bg-gray-800 dark:border-gray-700";

    const iconColor =
        state === "completed"
            ? "#FFFFFF"
            : state === "current"
              ? "#30913F"
              : undefined;

    const iconMutedCls = state === "upcoming" ? "text-[#B8C4B8] dark:text-gray-600" : "";

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: containerDim, height: containerDim }}
        >
            {state === "current" && (
                <div
                    className="absolute inset-0 rounded-full bg-[#30913F]/14 dark:bg-[#30913F]/20"
                    aria-hidden
                />
            )}
            <div
                className={`relative z-10 flex items-center justify-center rounded-full ${dim} ${circleCls}`}
            >
                {state === "completed" ? (
                    <Check className={iconDim} style={{ color: iconColor }} strokeWidth={2.5} />
                ) : (
                    <Icon
                        className={`${iconDim} ${iconMutedCls}`}
                        style={iconColor ? { color: iconColor } : undefined}
                        strokeWidth={1.75}
                    />
                )}
            </div>
        </div>
    );
}

interface WalletStepperProps {
    currentStep: WalletStep;
    variant: "form" | "pending";
}

export function WalletStepper({ currentStep, variant }: WalletStepperProps) {
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

    const maxLabelWidth = variant === "pending" ? "max-w-[72px]" : "max-w-[84px]";

    return (
        <div className="flex w-full items-start">
            {steps.map((step, index) => {
                const state = getState(index);
                const labelCls =
                    state === "upcoming"
                        ? "text-[#555555] dark:text-gray-500"
                        : "text-[#30913F] dark:text-[#4db860]";
                return (
                    <React.Fragment key={step.label}>
                        <div className="flex flex-col items-center gap-1.5">
                            <StepCircle state={state} Icon={step.Icon} size={size} />
                            <span
                                className={`${maxLabelWidth} text-center text-[12px] font-bold leading-[1.4] ${labelCls}`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`${lineMarginTop} h-[3px] flex-1 self-start bg-[#E8ECEF] dark:bg-gray-700`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
