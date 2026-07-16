"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { QIDHA_BFF } from "@/features/profile/constants/qidha.constants";
import { buildQidhaStoreFormData } from "@/features/profile/lib/qidha-store-form";
import {
	mapBackendFieldErrors,
	validateIncomeStep,
	validatePersonalStep,
	type QidhaFieldErrors,
	type QidhaFormField,
} from "@/features/profile/lib/qidha-subscription-validation";
import { scrollToFirstFormIssue } from "@/features/profile/lib/scroll-to-form-issue";
import { useNotification } from "@/shared/components/NotificationToast";
import { WalletStepper } from "../../shared/wallet/WalletStepper";
import type { WalletStep } from "../../shared/wallet/WalletStepper";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { IncomeStep } from "./steps/IncomeStep";
import { ContractStep } from "./steps/ContractStep";
import { PendingStep } from "./steps/PendingStep";
import type { WalletFormData } from "./types";

const PERSONAL_FORM_ID = "qidha-personal-form";
const INCOME_FORM_ID = "qidha-income-form";

const initialFormData: WalletFormData = {
	firstName: "",
	fatherName: "",
	grandfatherName: "",
	familyName: "",
	birthDate: "",
	nationality: "",
	maritalStatus: "",
	familyCount: "",
	idNumber: "",
	idExpiryDate: "",
	phone: "",
	homeType: "",
	city: "",
	neighborhood: "",
	incomeSource: "",
	employerName: "",
	monthlyIncome: "",
	salaryDay: "",
	hasInstallments: "",
	uploadedDoc: null,
};

const STEP_TITLES: Record<WalletStep, { ar: string; en: string }> = {
	"personal-info": {
		ar: "المعلومات الشخصية",
		en: "Personal information",
	},
	income: {
		ar: "مصدر الدخل والمستندات",
		en: "Income source and documents",
	},
	contract: { ar: "التوثيق عبر نفاذ", en: "Verification via Nafath" },
	pending: { ar: "", en: "" },
};

export function WalletSubscriptionClient({
	isArabic,
}: {
	isArabic: boolean;
}) {
	const router = useRouter();
	const lang = isArabic ? "ar" : "en";
	const { error: notifyError, success: notifySuccess } = useNotification();
	const formAreaRef = useRef<HTMLDivElement>(null);

	const [currentStep, setCurrentStep] = useState<WalletStep>("personal-info");
	const [formData, setFormData] = useState<WalletFormData>(initialFormData);
	const [errors, setErrors] = useState<QidhaFieldErrors>({});
	const [isSubmitting, startSubmit] = useTransition();

	const handleUpdate = (updates: Partial<WalletFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
		setErrors((prev) => {
			const next = { ...prev };
			for (const key of Object.keys(updates) as QidhaFormField[]) {
				delete next[key];
			}
			delete next.general;
			return next;
		});
	};

	const handleBack = () => {
		setErrors({});
		if (currentStep === "personal-info") {
			router.back();
		} else if (currentStep === "income") {
			setCurrentStep("personal-info");
		} else if (currentStep === "contract") {
			setCurrentStep("income");
		} else {
			router.back();
		}
	};

	const applyErrors = (next: QidhaFieldErrors) => {
		setErrors(next);
		requestAnimationFrame(() => scrollToFirstFormIssue(formAreaRef.current));
	};

	const handlePersonalNext = () => {
		const nextErrors = validatePersonalStep(formData, lang);
		if (Object.keys(nextErrors).length > 0) {
			applyErrors(nextErrors);
			return;
		}
		setErrors({});
		setCurrentStep("income");
	};

	const handleIncomeSubmit = () => {
		const nextErrors = validateIncomeStep(formData, lang);
		if (Object.keys(nextErrors).length > 0) {
			applyErrors(nextErrors);
			return;
		}

		startSubmit(async () => {
			try {
				const res = await fetch(QIDHA_BFF.store, {
					method: "POST",
					headers: {
						"Accept-Language": lang,
						lang,
					},
					body: buildQidhaStoreFormData(formData),
				});
				const json = await res.json().catch(() => ({}));

				if (!res.ok || !json.success) {
					const backendErrors = mapBackendFieldErrors(
						(json as { errors?: unknown }).errors ?? {},
					);
					const message =
						(json as { message?: string }).message ??
						(isArabic
							? "فشل في إرسال طلب محفظة قيدها"
							: "Failed to submit Qidha wallet request");

					if (Object.keys(backendErrors).length > 0) {
						applyErrors({ ...backendErrors, general: message });
					} else {
						applyErrors({ general: message });
					}
					notifyError(message);
					return;
				}

				notifySuccess(
					isArabic
						? "تم إرسال الطلب بنجاح"
						: "Request submitted successfully",
				);
				setErrors({});
				setCurrentStep("contract");
			} catch {
				const message = isArabic
					? "فشل في إرسال طلب محفظة قيدها"
					: "Failed to submit Qidha wallet request";
				applyErrors({ general: message });
				notifyError(message);
			}
		});
	};

	const showStepper = currentStep !== "pending";
	const showFormFooter =
		currentStep === "personal-info" || currentStep === "income";
	const stepTitle = STEP_TITLES[currentStep];
	const stepSubtitle = isArabic ? stepTitle.ar : stepTitle.en;

	return (
		<div
			className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header className="z-20 grid shrink-0 grid-cols-[auto_1fr_auto] items-center border-b border-border bg-background px-4 py-4 shadow-[0px_6px_25.1px_rgba(0,0,0,0.05)] sm:px-5 md:px-6 lg:px-8">
				<button
					type="button"
					onClick={handleBack}
					aria-label={isArabic ? "رجوع" : "Back"}
					className="-me-1 flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-card sm:h-10 sm:w-10"
				>
					<ChevronRight
						className="h-6 w-6 text-foreground ltr:rotate-180"
						strokeWidth={1.5}
					/>
				</button>
				<div className="min-w-0 text-center">
					<h1 className="truncate text-[18px] font-bold leading-[160%] text-foreground sm:text-[19px] md:text-xl">
						{isArabic ? "محفظة قيدها" : "Qidha wallet"}
					</h1>
					{stepSubtitle ? (
						<p className="truncate text-[12px] font-medium text-muted sm:text-[13px]">
							{stepSubtitle}
						</p>
					) : null}
				</div>
				<div className="w-9 sm:w-10" aria-hidden />
			</header>

			{showStepper && (
				<div className="z-10 shrink-0 border-b border-border bg-background px-4 py-3 sm:px-5 md:px-6 lg:px-8">
					<div className="mx-auto w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
						<WalletStepper
							currentStep={currentStep}
							variant="form"
							isArabic={isArabic}
						/>
					</div>
				</div>
			)}

			{/* Bound height via h-dvh parent so this pane scrolls; footer stays pinned */}
			<div
				ref={formAreaRef}
				className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 sm:px-5 md:px-6 lg:px-8"
			>
				<div className="mx-auto w-full max-w-lg pb-6 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
					{currentStep === "personal-info" && (
						<PersonalInfoStep
							formId={PERSONAL_FORM_ID}
							data={formData}
							errors={errors}
							onChange={handleUpdate}
							onSubmit={handlePersonalNext}
							isArabic={isArabic}
						/>
					)}
					{currentStep === "income" && (
						<IncomeStep
							formId={INCOME_FORM_ID}
							data={formData}
							errors={errors}
							onChange={handleUpdate}
							onSubmit={handleIncomeSubmit}
							isArabic={isArabic}
						/>
					)}
					{currentStep === "contract" && (
						<ContractStep
							isArabic={isArabic}
							onViewContract={() => {
								// TODO: open contract preview
							}}
							onCheckStatus={() => {
								// TODO: check Nafath status
							}}
							onVerify={() => setCurrentStep("pending")}
						/>
					)}
					{currentStep === "pending" && (
						<PendingStep
							isArabic={isArabic}
							onViewContract={() => {
								// TODO: open contract preview
							}}
							onContactSupport={() => {
								// TODO: open customer support
							}}
						/>
					)}
				</div>
			</div>

			{showFormFooter && (
				<footer className="z-20 shrink-0 border-t border-border bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:px-5 md:px-6 lg:px-8">
					<div className="mx-auto flex w-full max-w-lg flex-col gap-2.5 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
						{currentStep === "personal-info" ? (
							<button
								type="submit"
								form={PERSONAL_FORM_ID}
								className="flex h-12 w-full items-center justify-center rounded-xl bg-brand text-[16px] font-bold text-brand-foreground transition-opacity active:brightness-95 sm:h-[52px]"
							>
								{isArabic ? "التالي" : "Next"}
							</button>
						) : (
							<button
								type="submit"
								form={INCOME_FORM_ID}
								disabled={isSubmitting}
								className="flex h-12 w-full items-center justify-center rounded-xl bg-brand text-[16px] font-bold text-brand-foreground transition-opacity active:brightness-95 disabled:opacity-50 sm:h-[52px]"
							>
								{isSubmitting
									? isArabic
										? "جاري الإرسال..."
										: "Submitting..."
									: isArabic
										? "إرسال الطلب والمتابعة"
										: "Submit and continue"}
							</button>
						)}
					</div>
				</footer>
			)}
		</div>
	);
}
