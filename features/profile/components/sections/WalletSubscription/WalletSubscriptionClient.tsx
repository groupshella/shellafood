"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

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

const STEP_TITLES: Record<WalletStep, string> = {
    "personal-info": "المعلومات الشخصية",
    income: "مصدر الدخل والمستندات",
    contract: "التوثيق عبر نفاذ",
    pending: "",
};

export function WalletSubscriptionClient() {
    const router = useRouter();
    const { error: notifyError, success: notifySuccess } = useNotification();
    const formAreaRef = useRef<HTMLDivElement>(null);

    const [currentStep, setCurrentStep] = useState<WalletStep>("personal-info");
    const [formData, setFormData] = useState<WalletFormData>(initialFormData);
    const [errors, setErrors] = useState<QidhaFieldErrors>({});
    const [isSubmitting, startSubmit] = useTransition();

    useEffect(() => {
        formAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentStep]);

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
        const nextErrors = validatePersonalStep(formData);
        if (Object.keys(nextErrors).length > 0) {
            applyErrors(nextErrors);
            return;
        }
        setErrors({});
        setCurrentStep("income");
    };

    const handleIncomeSubmit = () => {
        const nextErrors = validateIncomeStep(formData);
        if (Object.keys(nextErrors).length > 0) {
            applyErrors(nextErrors);
            return;
        }

        startSubmit(async () => {
            try {
                const res = await fetch(QIDHA_BFF.store, {
                    method: "POST",
                    body: buildQidhaStoreFormData(formData),
                });
                const json = await res.json().catch(() => ({}));

                if (!res.ok || !json.success) {
                    const backendErrors = mapBackendFieldErrors(
                        (json as { errors?: unknown }).errors ?? {},
                    );
                    const message =
                        (json as { message?: string }).message ??
                        "فشل في إرسال طلب محفظة قيدها";

                    if (Object.keys(backendErrors).length > 0) {
                        applyErrors({ ...backendErrors, general: message });
                    } else {
                        applyErrors({ general: message });
                    }
                    notifyError(message);
                    return;
                }

                notifySuccess("تم إرسال الطلب بنجاح");
                setErrors({});
                setCurrentStep("contract");
            } catch {
                const message = "فشل في إرسال طلب محفظة قيدها";
                applyErrors({ general: message });
                notifyError(message);
            }
        });
    };

    const showStepper = currentStep !== "pending";
    const showFormFooter =
        currentStep === "personal-info" || currentStep === "income";

    return (
        <div className="flex min-h-dvh flex-col overflow-hidden bg-white dark:bg-gray-950" dir="rtl">
            <header className="z-20 grid shrink-0 grid-cols-[auto_1fr_auto] items-center border-b border-[#F6F5F8] bg-white px-4 py-4 shadow-[0px_6px_25.1px_rgba(0,0,0,0.05)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0px_6px_25.1px_rgba(0,0,0,0.25)] sm:px-5 md:px-6">
                <button
                    type="button"
                    onClick={handleBack}
                    aria-label="رجوع"
                    className="-me-1 flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-gray-100 dark:active:bg-gray-800"
                >
                    <ChevronRight
                        className="h-6 w-6 text-[#111B18] dark:text-gray-100"
                        strokeWidth={1.5}
                    />
                </button>
                <div className="min-w-0 text-center">
                    <h1 className="truncate text-[18px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100">
                        محفظة قيدها
                    </h1>
                    {STEP_TITLES[currentStep] ? (
                        <p className="truncate text-[12px] font-medium text-[#707784] dark:text-gray-400">
                            {STEP_TITLES[currentStep]}
                        </p>
                    ) : null}
                </div>
                <div className="w-9" aria-hidden />
            </header>

            {showStepper && (
                <div className="z-10 shrink-0 border-b border-[#F6F5F8] bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 sm:px-5 md:px-6">
                    <div className="mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-3xl">
                        <WalletStepper currentStep={currentStep} variant="form" />
                    </div>
                </div>
            )}

            <div
                ref={formAreaRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 sm:px-5 lg:px-6"
            >
                <div className="mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-3xl">
                {currentStep === "personal-info" && (
                    <PersonalInfoStep
                        formId={PERSONAL_FORM_ID}
                        data={formData}
                        errors={errors}
                        onChange={handleUpdate}
                        onSubmit={handlePersonalNext}
                    />
                )}
                {currentStep === "income" && (
                    <IncomeStep
                        formId={INCOME_FORM_ID}
                        data={formData}
                        errors={errors}
                        onChange={handleUpdate}
                        onSubmit={handleIncomeSubmit}
                    />
                )}
                {currentStep === "contract" && (
                    <ContractStep
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
                        onViewContract={() => {
                            // TODO: open contract preview
                        }}
                        onContactSupport={() => {
                            // TODO: open customer support
                        }}
                    />
                )}
                    {showFormFooter && <div className="h-4" aria-hidden />}
                </div>
            </div>

            {showFormFooter && (
                <footer className="z-20 shrink-0 border-t border-[#F6F5F8] bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.25)] sm:px-5 md:px-6">
                    <div className="mx-auto flex w-full max-w-lg flex-col gap-2.5 sm:max-w-2xl lg:max-w-3xl">
                        {currentStep === "personal-info" ? (
                            <button
                                type="submit"
                                form={PERSONAL_FORM_ID}
                                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#30913F] text-[16px] font-bold text-white transition-opacity active:bg-[#267332] sm:h-[52px]"
                            >
                                التالي
                            </button>
                        ) : (
                            <button
                                type="submit"
                                form={INCOME_FORM_ID}
                                disabled={isSubmitting}
                                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#30913F] text-[16px] font-bold text-white transition-opacity active:bg-[#267332] disabled:opacity-50 sm:h-[52px]"
                            >
                                {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب والمتابعة"}
                            </button>
                        )}
                    </div>
                </footer>
            )}
        </div>
    );
}
